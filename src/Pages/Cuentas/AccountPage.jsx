import { useEffect, useState , useMemo} from "react"
import { Plus, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AccountCard } from "./account-card"
import { AddAccountModal } from "./add-account-modal"
import { AssignClientModal } from "./assign-client-modal"
import { DeleteAccountDialog } from "./delete-account-dialog" // 🌟 Nuevo modal de borrado

import {
  getAccounts,
  createAccount,
  deleteAccount,
  updateAccount, // 🌟 Importamos la actualización
  assignClient,
  unassignClient,
} from "../../services/account.service"

const platforms = [
  "All",
  "Neflix",
  "Disney+",
  "HBO Max",
  "Amazon Prime",
  "Spotify",
  "Apple TV+",
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("All")
  
  // Estados de control de modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  
  // 🌟 Nuevos estados para controlar la edición y eliminación
  const [editingAccount, setEditingAccount] = useState(null)
  const [deletingAccount, setDeletingAccount] = useState(null)

  // ========================================
  // LOAD ACCOUNTS
  // ========================================
  async function loadAccounts() {
    try {
      setLoading(true)
      const data = await getAccounts()

      const formattedAccounts = (data || []).map((account) => ({
        ...account,
        platform:
          account.platforms?.name ||
          account.platform ||
          "Unknown",
        profiles: account.profiles || [],
      }))

      setAccounts(formattedAccounts)
    } catch (error) {
      console.error("❌ Error cargando cuentas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  // ========================================
  // FILTER ACCOUNTS
  // ========================================
  // ========================================
  // FILTER ACCOUNTS (Optimizado y Case-Insensitive)
  // ========================================
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // 1. Normalizar búsquedas por texto (Email o Plataforma)
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = 
        !query || 
        account.email?.toLowerCase().includes(query) ||
        account.platform?.toLowerCase().includes(query)

      // 2. Normalizar filtro de plataforma (Evita fallas por strings exactos)
      const matchesPlatform =
        platformFilter === "All" ||
        account.platform?.toLowerCase() === platformFilter.toLowerCase()

      return matchesSearch && matchesPlatform
    })
  }, [accounts, searchQuery, platformFilter]) // Re-calcula solo si cambia la data o los inputs

  // ========================================
  // ADD OR UPDATE ACCOUNT (Persistencia real en Supabase)
  // ========================================
  const handleAddAccountSubmit = async (formData) => {
    try {
      setLoading(true)
      if (editingAccount) {
        // Si hay una cuenta en estado 'editing', corremos la actualización
        await updateAccount(editingAccount.id, formData)
        setEditingAccount(null)
      } else {
        // Si no, es una creación limpia
        await createAccount(formData)
        setIsAddModalOpen(false)
      }
      await loadAccounts() // Recargar tabla con data fresca de la BD
    } catch (error) {
      console.error("❌ Error al procesar cuenta:", error)
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // EDIT ACCOUNT (Abre el diálogo rellenando los datos)
  // ========================================
  const handleEditAccount = (account) => {
    setEditingAccount(account)
  }

  // ========================================
  // DELETE ACCOUNT (Confirmación real asíncrona)
  // ========================================
  const handleDeleteAccountConfirm = async () => {
    if (!deletingAccount) return
    try {
      setLoading(true)
      await deleteAccount(deletingAccount.id)
      setDeletingAccount(null) // Cerrar diálogo
      await loadAccounts()     // Refrescar interfaz
    } catch (error) {
      console.error("❌ Error al eliminar cuenta:", error)
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // OPEN ASSIGN MODAL
  // ========================================
  const handleAssign = (accountId, profileId) => {
    const account = accounts.find((a) => a.id === accountId)
    const profile = account?.profiles?.find((p) => p.id === profileId)

    setSelectedProfile({
      accountId,
      profileId,
      profileName: profile?.profile_name, 
    })

    setIsAssignModalOpen(true)
  }

  // ========================================
  // ASSIGN CLIENT
  // ========================================
  const handleAssignSubmit = async (clientName) => {
    if (!selectedProfile) return
    try {
      await assignClient(selectedProfile.profileId, clientName)
      setIsAssignModalOpen(false)
      await loadAccounts()
    } catch (error) {
      console.error("❌ Error al asignar cliente:", error)
    }
  }

  // ========================================
  // UNASSIGN CLIENT
  // ========================================
  const handleUnassign = async (profileId) => {
    try {
      await unassignClient(profileId)
      await loadAccounts()
    } catch (error) {
      console.error("❌ Error al desasignar cliente:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Procesando transacciones de streaming...
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              Cuentas de Streaming
            </h1>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar cuenta o plataforma..."
                  className="w-full pl-9 sm:w-70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter */}
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <Filter className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform === "All" ? "Todas" : platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add */}
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 size-4" />
                Añadir Cuenta
              </Button>
            </div>
          </div>

          {/* Grid de Cuentas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
                onDelete={setDeletingAccount} // 🌟 Setea la cuenta a eliminar abriendo el nuevo modal
                onAssign={handleAssign}
                onUnassign={handleUnassign}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAccounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No se encontraron cuentas</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || platformFilter !== "All"
                  ? "Prueba cambiando los términos de búsqueda o filtros."
                  : "Añade tu primera cuenta de streaming para empezar."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 🌟 MODAL UNIFICADO: Sirve para Crear (limpio) y Editar (con initialData) */}
      <AddAccountModal
        open={isAddModalOpen || !!editingAccount}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsAddModalOpen(false)
            setEditingAccount(null)
          }
        }}
        onSubmit={handleAddAccountSubmit}
        initialData={editingAccount ?? undefined}
      />

      {/* 🌟 MODAL DE CONFIRMACIÓN DE BORRADO */}
      <DeleteAccountDialog
        open={!!deletingAccount}
        onOpenChange={(isOpen) => !isOpen && setDeletingAccount(null)}
        onConfirm={handleDeleteAccountConfirm}
        accountEmail={deletingAccount?.email ?? ""}
      />

      {/* Modal de Asignación */}
      <AssignClientModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onSubmit={handleAssignSubmit}
        profileInfo={selectedProfile}
      />
    </div>
  )
}