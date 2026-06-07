import { supabase } from "@/lib/supabaseClient"

// ========================================
// GET ALL ACCOUNTS
// ========================================

export async function getAccounts() {
  const { data, error } = await supabase
    .from("accounts")
    .select(`
      *,
      platforms (
        id,
        name
      ),
      profiles (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error obteniendo cuentas:", error)
    throw error
  }

  // Transformar datos
  const formattedAccounts = data.map((account) => ({
    ...account,
    platform: account.platforms?.name || "Unknown",
  }))

  return formattedAccounts
}

// ========================================
// CREATE ACCOUNT (¡AUTOMATIZADO Y CORREGIDO!)
// ========================================

export async function createAccount(formData) {
  // 1. Insertar la cuenta en la tabla 'accounts'
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .insert([
      {
        platform_id: formData.platform_id,
        email: formData.email,
        password: formData.password,
        notes: formData.notes,
      },
    ])
    .select()
    .maybeSingle()

  if (accountError) {
    console.error("Error al insertar cuenta:", accountError)
    throw accountError
  }

  if (!account) {
    throw new Error("No se pudo recuperar la cuenta creada.")
  }

  // 2. Generar los perfiles automáticamente usando los estados válidos ('free')
  const profilesToInsert = Array.from({ length: formData.profile_count }, (_, i) => ({
    account_id: account.id,
    profile_name: `Perfil ${i + 1}`,
    status: "free", // 🌟 Modificado con el string exacto que tu BD acepta
    client: null,   // Nace sin cliente asignado
  }))

  const { error: profilesError } = await supabase
    .from("profiles")
    .insert(profilesToInsert)

  if (profilesError) {
    console.error("❌ Error al crear los perfiles automáticos:", profilesError)
    throw profilesError
  }

  return account
}


// ========================================
// DELETE ACCOUNT
// ========================================

export async function deleteAccount(accountId) {
  try {
    // 1. Obtener los IDs de todos los perfiles asociados a la cuenta que se va a borrar
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .eq("account_id", accountId);

    if (profilesError) throw profilesError;

    if (profiles && profiles.length > 0) {
      const profileIds = profiles.map((p) => p.id);

      // 2. Buscar las suscripciones de esos perfiles para obtener los 'client_id' reales
      const { data: subscriptions, error: subsError } = await supabase
        .from("subscriptions")
        .select("client_id")
        .in("profile_id", profileIds);

      if (subsError) throw subsError;

      if (subscriptions && subscriptions.length > 0) {
        // Extraer los IDs de los clientes únicos ignorando valores nulos
        const clientIdsToDelete = subscriptions
          .map((s) => s.client_id)
          .filter(Boolean);

        if (clientIdsToDelete.length > 0) {
          // 3. Eliminar los clientes huérfanos directamente de la tabla 'clients'
          const { error: clientsDeleteError } = await supabase
            .from("clients")
            .delete()
            .in("id", clientIdsToDelete);

          if (clientsDeleteError) {
            console.error("⚠️ Error al limpiar clientes huérfanos:", clientsDeleteError);
            // No bloqueamos el flujo principal si falla la limpieza de clientes, pero lo reportamos
          }
        }
      }
    }

    // 4. Finalmente, borrar la cuenta original
    // (Esto disparará el CASCADE en cascada sobre 'profiles' y consecutivamente sobre 'subscriptions')
    const { error: accountDeleteError } = await supabase
      .from("accounts")
      .delete()
      .eq("id", accountId);

    if (accountDeleteError) throw accountDeleteError;

    return true;
  } catch (error) {
    console.error("❌ Error crítico en el servicio deleteAccount:", error);
    throw error;
  }
}

// ========================================
// UPDATE ACCOUNT
// ========================================

export async function updateAccount(accountId, updates) {
  try {
    // 1. ACTUALIZAR LOS DATOS BÁSICOS DE LA CUENTA
    const fieldsToUpdate = {
      email: updates.email,
      password: updates.password,
      notes: updates.notes,
      platform_id: updates.platform_id,
    };

    // Limpiar campos undefined
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .update(fieldsToUpdate)
      .eq("id", accountId)
      .select()
      .maybeSingle();

    if (accountError) throw accountError;

    // 2. MANEJO DINÁMICO DE PERFILES (CUPOS)
    if (updates.profile_count !== undefined) {
      // Obtener perfiles actuales ordenados para saber cuántos hay
      const { data: currentProfiles, error: fetchProfError } = await supabase
        .from("profiles")
        .select("id, profile_name")
        .eq("account_id", accountId)
        .order("created_at", { ascending: true });

      if (fetchProfError) throw fetchProfError;

      const currentCount = currentProfiles ? currentProfiles.length : 0;
      const targetCount = parseInt(updates.profile_count, 10);

      if (targetCount > currentCount) {
        // CASO A: El usuario aumentó los cupos -> Crear los que faltan
        const diff = targetCount - currentCount;
        const newProfiles = Array.from({ length: diff }, (_, i) => ({
          account_id: accountId,
          profile_name: `Perfil ${currentCount + i + 1}`,
          status: "free",
          client: null,
        }));

        const { error: insertProfError } = await supabase
          .from("profiles")
          .insert(newProfiles);

        if (insertProfError) throw insertProfError;

      } else if (targetCount < currentCount) {
        // CASO B: El usuario disminuyó los cupos -> Eliminar los sobrantes
        // Traemos primero los perfiles que NO tengan clientes en 'subscriptions' para no borrar cupos activos por accidente
        const { data: activeSubs, error: subsFetchError } = await supabase
          .from("subscriptions")
          .select("profile_id")
          .in("profile_id", currentProfiles.map(p => p.id));
        
        if (subsFetchError) throw subsFetchError;
        const activeProfileIds = activeSubs.map(s => s.profile_id);

        // Separar perfiles libres de los ocupados
        const freeProfiles = currentProfiles.filter(p => !activeProfileIds.includes(p.id));
        const busyProfiles = currentProfiles.filter(p => activeProfileIds.includes(p.id));
        
        // El orden de sacrificio para borrar: primero los libres, si faltan, sacrificamos ocupados
        const sortedToSacrifice = [...freeProfiles, ...busyProfiles];
        const numToDelete = currentCount - targetCount;
        const profilesToDelete = sortedToSacrifice.slice(-numToDelete); // Tomamos los últimos de la lista

        if (profilesToDelete.length > 0) {
          const idsToDelete = profilesToDelete.map(p => p.id);
          
          // Nota: Si borramos perfiles ocupados, las tablas 'subscriptions' y 'clients' requerirían limpieza previa. 
          // Para este código asumimos que limpias o que el Cascade delete de 'subscriptions' está activo.
          const { error: deleteProfError } = await supabase
            .from("profiles")
            .delete()
            .in("id", idsToDelete);

          if (deleteProfError) throw deleteProfError;
        }
      }
    }

    // 3. ACTUALIZAR O EDITAR LOS NOMBRES DE LOS CLIENTES EN LOS CUPOS
    // 'updates.clients_data' debe ser un Array de objetos: [{ profile_id: '...', full_name: 'Juan', phone: '...' }]
    if (updates.clients_data && Array.from(updates.clients_data).length > 0) {
      for (const item of updates.clients_data) {
        if (!item.profile_id) continue;

        // Verificar si este perfil ya tiene una suscripción y un cliente asociado
        const { data: existingSub, error: subCheckError } = await supabase
          .from("subscriptions")
          .select("id, client_id")
          .eq("profile_id", item.profile_id)
          .maybeSingle();

        if (subCheckError) throw subCheckError;

        if (item.full_name && item.full_name.trim() !== "") {
          if (existingSub && existingSub.client_id) {
            // Caso 3.1: Ya existe el cliente -> Actualizamos su nombre y datos en 'clients'
            const { error: clientUpdateError } = await supabase
              .from("clients")
              .update({
                full_name: item.full_name.trim(),
                phone: item.phone || "555-1234", // valor por defecto si no viene
              })
              .eq("id", existingSub.client_id);

            if (clientUpdateError) throw clientUpdateError;

            // Cambiamos el estado del perfil a occupied por si acaso
            await supabase.from("profiles").update({ status: "occupied" }).eq("id", item.profile_id);

          } else {
            // Caso 3.2: El cupo estaba libre -> Creamos el cliente nuevo y luego su suscripción
            const { data: newClient, error: clientInsertError } = await supabase
              .from("clients")
              .insert([{
                full_name: item.full_name.trim(),
                phone: item.phone || "555-1234",
                status: "active"
              }])
              .select()
              .single();

            if (clientInsertError) throw clientInsertError;

            // Insertamos la fila intermediaria en 'subscriptions'
            const { error: subInsertError } = await supabase
              .from("subscriptions")
              .insert([{
                client_id: newClient.id,
                profile_id: item.profile_id,
                status: "active",
                start_date: new Date().toISOString().split('T')[0], // Fecha de hoy formato YYYY-MM-DD
              }]);

            if (subInsertError) throw subInsertError;

            // Actualizamos el estado del perfil en la tabla profiles
            await supabase.from("profiles").update({ status: "occupied" }).eq("id", item.profile_id);
          }
        } else {
          // Caso 3.3: El nombre vino vacío -> El usuario quiere DESVINCULAR o quitar al cliente de ese cupo
          if (existingSub && existingSub.client_id) {
            // Borramos la suscripción primero
            await supabase.from("subscriptions").delete().eq("id", existingSub.id);
            // Borramos al cliente para que no quede flotando en la BD
            await supabase.from("clients").delete().eq("id", existingSub.client_id);
            // Seteamos el perfil de vuelta a 'free'
            await supabase.from("profiles").update({ status: "free" }).eq("id", item.profile_id);
          }
        }
      }
    }

    return account;
  } catch (error) {
    console.error("❌ Error crítico en updateAccount:", error);
    throw error;
  }
}

// ========================================
// ASSIGN CLIENT
// ========================================

export async function assignClient(profileId, clientName) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      client: clientName,
      status: "occupied" // Cambia a ocupado al asignar
    })
    .eq("id", profileId)
    .select()
    .single()

  if (error) {
    console.error("Error asignando cliente:", error)
    throw error
  }

  return data
}

// ========================================
// UNASSIGN CLIENT
// ========================================

export async function unassignClient(profileId) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      client: null,
      status: "available" // Se libera y vuelve a estar disponible
    })
    .eq("id", profileId)
    .select()
    .single()

  if (error) {
    console.error("Error desasignando cliente:", error)
    throw error
  }

  return data
}

export async function getPlatforms() {
  const { data, error } = await supabase
    .from("platforms")
    .select("id, name")
    .order("name", { ascending: true })

  if (error) throw error
  return data
}