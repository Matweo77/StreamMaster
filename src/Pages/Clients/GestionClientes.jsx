import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClientsTable } from "./client-table"
import { ClientDialog } from "./client-dialog"
import { DeleteClientDialog } from "./delete-client-dialog"

// Datos de ejemplo
const initialClients = [
  {
    id: "1",
    nombre: "Juan Pérez",
    whatsapp: "555-1234",
    plataforma: "Netflix",
    pantalla: "juan@gmail.com",
    amount: 5,
    perfil: "Perfil 2",
    proximoPago: "15 Jun",
    estado: "activo",
  },
  {
    id: "2",
    nombre: "María López",
    whatsapp: "555-7777",
    plataforma: "Disney+",
    pantalla: "juan@gmail.com",
    amount: 5,
    perfil: "Perfil 1",
    proximoPago: "20 Jun",
    estado: "vencido",
  },
  {
    id: "3",
    nombre: "Carlos García",
    whatsapp: "555-9999",
    plataforma: "HBO Max",
    pantalla: "juan@gmail.com",
    amount: 4,
    perfil: "Perfil 3",
    proximoPago: "25 Jun",
    estado: "activo",
  },
  {
    id: "4",
    nombre: "Ana Martínez",
    whatsapp: "555-4444",
    plataforma: "Amazon Prime",
    pantalla: "juan@gmail.com",
    amount: 12,
    perfil: "Perfil 1",
    proximoPago: "10 Jun",
    estado: "pendiente",
  },
  {
    id: "5",
    nombre: "Roberto Sánchez",
    whatsapp: "555-2222",
    plataforma: "Netflix",
    pantalla: "juan@gmail.com",
    amount: 44,
    perfil: "Perfil 4",
    proximoPago: "05 Jun",
    estado: "vencido",
  },
  {
    id: "6",
    nombre: "Felife buitragoz",
    whatsapp: "335-2442",
    plataforma: "Netflix",
    pantalla: "juan@gmail.com",
    amount: "5",
    perfil: "Perfil 5",
    proximoPago: "06 Jun",
    estado: "vencido",
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [deletingClient, setDeletingClient] = useState(null)

  // Filtrar clientes por búsqueda
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients
    const query = searchQuery.toLowerCase()
    return clients.filter(
      (client) =>
        client.nombre.toLowerCase().includes(query) ||
        client.whatsapp.includes(query) ||
        client.plataforma.toLowerCase().includes(query)||
        client.pantalla.toLowerCase().includes(query)
    )
  }, [clients, searchQuery])

  // Crear cliente
  const handleCreateClient = (data) => {
    const newClient = {
      ...data,
      id: Date.now().toString(),
    }
    setClients((prev) => [...prev, newClient])
    setIsCreateDialogOpen(false)
  }

  // Editar cliente
  const handleEditClient = (data) => {
    if (!editingClient) return
    setClients((prev) =>
      prev.map((client) =>
        client.id === editingClient.id ? { ...data, id: client.id } : client
      )
    )
    setEditingClient(null)
  }

  // Eliminar cliente
  const handleDeleteClient = () => {
    if (!deletingClient) return
    setClients((prev) => prev.filter((client) => client.id !== deletingClient.id))
    setDeletingClient(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Clientes
            </h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Nuevo Cliente
            </Button>
          </div>

          {/* Buscador */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla de clientes */}
        <ClientsTable
          clients={filteredClients}
          onEdit={setEditingClient}
          onDelete={setDeletingClient}
        />

        {/* Dialog para crear cliente */}
        <ClientDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateClient}
          title="Nuevo Cliente"
        />

        {/* Dialog para editar cliente */}
        <ClientDialog
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onSubmit={handleEditClient}
          initialData={editingClient ?? undefined}
          title="Editar Cliente"
        />

        {/* Dialog para eliminar cliente */}
        <DeleteClientDialog
          open={!!deletingClient}
          onOpenChange={(open) => !open && setDeletingClient(null)}
          onConfirm={handleDeleteClient}
          clientName={deletingClient?.nombre ?? ""}
        />
      </div>
    </main>
  )
}
