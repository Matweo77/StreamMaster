"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClientsTable } from "./client-table"
import { CreateClientDialog } from "./CreateClientDialog"
import { EditClientDialog } from "./EditClientDialog"
import { DeleteClientDialog } from "./delete-client-dialog"

import {
  getClientsWithDetails,
  createClientWithSubscription,
  getActiveAccounts,
  updateClientWithSubscription,
  deleteClientWithSubscription
} from "@/services/clients.service"

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [deletingClient, setDeletingClient] = useState(null)

  const [cuentas, setCuentas] = useState([])

  const loadAccountsData = async () => {
    try {
      const data = await getActiveAccounts()
      setCuentas(data)
    } catch (error) {
      console.error("❌ Error cargando cuentas:", error)
    }
  }

  const fetchClients = async () => {
    setLoading(true)
    try {
      const data = await getClientsWithDetails()
      setClients(data)
    } catch (error) {
      console.error("❌ Error cargando detalles de clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
    loadAccountsData()
  }, [])

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients

    const q = searchQuery.toLowerCase()

    return clients.filter((c) =>
      c.nombre?.toLowerCase().includes(q) ||
      c.whatsapp?.includes(q) ||
      c.plataforma?.toLowerCase().includes(q) ||
      c.pantalla?.toLowerCase().includes(q)
    )
  }, [clients, searchQuery])

  const handleCreateClient = async (data) => {
    try {
      setLoading(true)
      await createClientWithSubscription(data)
      await fetchClients()
      await loadAccountsData()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("❌ Error creando cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClient = async (data) => {
    if (!editingClient) return

    try {
      setLoading(true)
      await updateClientWithSubscription(editingClient.id, data)
      await fetchClients()
      await loadAccountsData()
      setEditingClient(null)
    } catch (error) {
      console.error("❌ Error editando cliente en Supabase:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!deletingClient) return

    try {
      setLoading(true)
      await deleteClientWithSubscription(deletingClient.id)
      await fetchClients()
      await loadAccountsData()
      setDeletingClient(null)
    } catch (error) {
      console.error("❌ Error eliminando cliente en Supabase:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Clientes</h1>

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="size-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cliente..."
          />
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ClientsTable
            clients={filteredClients}
            onEdit={(client) => {
              setEditingClient({
                ...client,
                accountId: client.accountId || client.account_id || "",
                profileId: client.profileId || client.profile_id || "",
                pantalla: client.pantalla || client.profile_name || "",
                // 🌟 ASEGÚRATE DE INCLUIR ESTA LÍNEA PARA QUE PASE EL PRICE REAL DE SUPABASE:
                price: client.price !== undefined ? client.price : (client.amount || ""),
              })
            }}
            onDelete={setDeletingClient}
          />
        )}

{/* Modal exclusivo de Creación */}
        <CreateClientDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateClient}
          pantallas={cuentas} 
        />

        {/* Modal exclusivo de Edición */}
        <EditClientDialog
          open={!!editingClient}
          onOpenChange={(o) => !o && setEditingClient(null)}
          onSubmit={handleEditClient}
          clientData={editingClient}
          pantallas={cuentas}
        />

        <DeleteClientDialog
          open={!!deletingClient}
          onOpenChange={(o) => !o && setDeletingClient(null)}
          onConfirm={handleDeleteClient}
          clientName={deletingClient?.nombre ?? ""}
        />

      </div>
    </main>
  )
}