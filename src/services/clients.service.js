import { supabase } from "@/lib/supabaseClient"

export const getClientsWithDetails = async () => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      id,
      price,
      next_payment_date,
      status,

      clients (
        id,
        full_name,
        phone
      ),

      profiles (
        id,
        profile_name,

        accounts (
          id,
          email,

          platforms (
            id,
            name
          )
        )
      )
    `)

  if (error) throw error

  return data.map((item) => ({
    id: item.id,
    nombre: item.clients?.full_name || "",
    whatsapp: item.clients?.phone || "",
    plataforma: item.profiles?.accounts?.platforms?.name || "",
    pantalla: item.profiles?.accounts?.email || "",
    perfil: item.profiles?.profile_name || "",
    amount: item.price,
    proximoPago: item.next_payment_date,
    estado: item.status,
  }))
}

export const createClientWithSubscription = async (form) => {
  // 1. CREAR CLIENTE
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      full_name: form.nombre,
      phone: form.whatsapp,
    })
    .select()
    .single()

  if (clientError) throw clientError

  // 2. CREAR SUBSCRIPCIÓN
  // 🌟 FIX CLAVE: Quitamos la búsqueda repetitiva por texto.
  // Ahora tomamos directamente 'profile_id' que viene desde el formulario frontend.
  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      client_id: client.id,
      profile_id: form.profileId,  // 🔥 Cambiado a form.profileId (Debe ser un UUID)
      price: Number(form.amount),  // Asegurar número
      next_payment_date: form.proximoPago,
      status: form.estado,
    })
    .select()
    .single()

  if (subError) {
    console.error("ERROR SUBSCRIPTION:", subError)
    throw subError
  }

  // 3. ACTUALIZAR ESTADO DEL PERFIL (Opcional pero muy útil)
  // Cambiamos el estado en la tabla profiles para que sepamos que ya no está libre.
  await supabase
    .from("profiles")
    .update({ status: "occupied" })
    .eq("id", form.profileId)

  return sub
}

export const getAccountsEmails = async () => {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, email")

  if (error) throw error

  return data
}

// ==========================================
// NUEVAS FUNCIONES PARA SELECTORES EN CASCADA
// ==========================================

/**
 * 1. Trae todas las cuentas registradas con el nombre de su plataforma
 * para el primer selector.
 */
export const getActiveAccounts = async () => {
  const { data, error } = await supabase
    .from("accounts")
    .select(`
      id,
      email,
      platforms ( name )
    `)
    .eq("status", "active") // Solo cuentas activas

  if (error) throw error

  return data.map((acc) => ({
    id: acc.id,
    label: `${acc.platforms?.name || "Streaming"} - ${acc.email}`,
  }))
}

/**
 * 2. Trae SOLO los perfiles libres de una cuenta específica (usando su account_id)
 * para el segundo selector.
 */
export const getAvailableProfilesByAccount = async (accountId) => {
  if (!accountId) return []

  const { data, error } = await supabase
    .from("profiles")
    .select("id, profile_name")
    .eq("account_id", accountId)
    .neq("status", "occupied") // 🌟 Trae solo los que NO están 'occupied'

  if (error) throw error

  return data // Devuelve un array de objetos: [{ id, profile_name }, ...]
}


/**
 * Actualiza los datos de un cliente y su suscripción en cascada
 */
export const updateClientWithSubscription = async (clientId, form) => {
  if (!clientId) throw new Error("ID de suscripción ausente.");

  // 1. Obtener los datos actuales de la suscripción para saber si cambió de perfil
  const { data: oldSub, error: fetchSubError } = await supabase
    .from("subscriptions")
    .select("client_id, profile_id")
    .eq("id", clientId)
    .single();

  if (fetchSubError) throw fetchSubError;

  // 2. Actualizar los datos personales del cliente en la tabla 'clients'
  const { error: clientError } = await supabase
    .from("clients")
    .update({
      full_name: form.nombre,
      phone: form.whatsapp,
    })
    .eq("id", oldSub.client_id);

  if (clientError) throw clientError;

  // 3. Actualizar los datos de la suscripción
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      profile_id: form.profileId, // El UUID del perfil nuevo o actual
      price: Number(form.amount),
      next_payment_date: form.proximoPago,
      status: form.estado,
    })
    .eq("id", clientId);

  if (subError) throw subError;

  // 4. MUDANZA DE PERFILES: Si el usuario cambió de perfil/pantalla
  if (oldSub.profile_id !== form.profileId) {
    // A. Liberamos el perfil viejo (vuelve a estar libre)
    await supabase
      .from("profiles")
      .update({ status: "free" })
      .eq("id", oldSub.profile_id);

    // B. Ocupamos el perfil nuevo
    await supabase
      .from("profiles")
      .update({ status: "occupied" })
      .eq("id", form.profileId);
  }

  return true;
};


/**
 * Elimina por completo una suscripción, libera su perfil y borra al cliente
 * @param {string} subscriptionId - El ID de la fila de la suscripción (id que viene en la tabla)
 */
export const deleteClientWithSubscription = async (subscriptionId) => {
  if (!subscriptionId) throw new Error("ID de suscripción ausente.");

  // 1. Obtener el client_id y el profile_id antes de borrar nada
  const { data: subData, error: fetchError } = await supabase
    .from("subscriptions")
    .select("client_id, profile_id")
    .eq("id", subscriptionId)
    .single();

  if (fetchError) throw fetchError;

  const { client_id, profile_id } = subData;

  // 2. ELIMINAR LA SUSCRIPCIÓN PRIMERO (Rompe la relación)
  const { error: deleteSubError } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", subscriptionId);

  if (deleteSubError) throw deleteSubError;

  // 3. ELIMINAR AL CLIENTE
  if (client_id) {
    const { error: deleteClientError } = await supabase
      .from("clients")
      .delete()
      .eq("id", client_id);

    if (deleteClientError) throw deleteClientError;
  }

  // 4. LIBERAR EL PERFIL (Volver a ponerlo 'free' para que otra cuenta lo use)
  if (profile_id) {
    await supabase
      .from("profiles")
      .update({ status: "free" })
      .eq("id", profile_id);
  }

  return true;
};