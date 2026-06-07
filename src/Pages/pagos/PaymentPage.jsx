import { useState } from "react"
import {
  DollarSign,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample data
const paymentsData = [
  {
    id: 1,
    client: "Juan Perez",
    platform: "Neflix",
    screem: "juan@gmail.com",
    profile: "Profile 2",
    amount: 5,
    dueDate: "Apr 12",
    status: "paid",
  },
  {
    id: 2,
    client: "Maria Garcia",
    platform: "Disney+",
    screem: "juan@gmail.com",
    profile: "Profile 1",
    amount: 6,
    dueDate: "Apr 15",
    status: "pending",
  },
  {
    id: 3,
    client: "Carlos Lopez",
    platform: "Netflix",
    screem: "juan@gmail.com",
    profile: "Profile 3",
    amount: 5,
    dueDate: "Apr 10",
    status: "overdue",
  },
  {
    id: 4,
    client: "Ana Martinez",
    platform: "HBO Max",
    screem: "juan@gmail.com",
    profile: "Profile 1",
    amount: 7,
    dueDate: "Apr 18",
    status: "paid",
  },
  {
    id: 5,
    client: "Luis Rodriguez",
    platform: "Netflix",
    screem: "juan@gmail.com",
    profile: "Profile 4",
    amount: 5,
    dueDate: "Apr 20",
    status: "pending",
  },
  {
    id: 6,
    client: "Sofia Hernandez",
    platform: "Disney+",
    screem: "juan@gmail.com",
    profile: "Profile 2",
    amount: 6,
    dueDate: "Apr 08",
    status: "overdue",
  },
  {
    id: 7,
    client: "Pedro Sanchez",
    platform: "Netflix",
    screem: "juan@gmail.com",
    profile: "Profile 1",
    amount: 5,
    dueDate: "Apr 22",
    status: "pending",
  },
  {
    id: 8,
    client: "Laura Torres",
    platform: "Amazon Prime",
    screem: "juan@gmail.com",
    profile: "Profile 1",
    amount: 4,
    dueDate: "Apr 25",
    status: "pending",
  },
]

const clientsData = [
  { id: 1, name: "Juan Perez", platform: "Netflix", profile: "Profile 2" },
  { id: 2, name: "Maria Garcia", platform: "Disney+", profile: "Profile 1" },
  { id: 3, name: "Carlos Lopez", platform: "Netflix", profile: "Profile 3" },
  { id: 4, name: "Ana Martinez", platform: "HBO Max", profile: "Profile 1" },
  { id: 5, name: "Luis Rodriguez", platform: "Netflix", profile: "Profile 4" },
]

function StatusBadge({ status }) {
  const statusConfig = {
    paid: {
      label: "Paid",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    overdue: {
      label: "Overdue",
      className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

function SummaryCard({ icon: Icon, title, value, iconBgColor, iconColor }) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function RegisterPaymentModal({ open, onOpenChange }) {
  const [selectedClient, setSelectedClient] = useState("")
  const [platform, setPlatform] = useState("")
  const [profile, setProfile] = useState("")

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId)
    const client = clientsData.find((c) => c.id.toString() === clientId)
    if (client) {
      setPlatform(client.platform)
      setProfile(client.profile)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registrar un nuevo pago para el cliente
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select value={selectedClient} onValueChange={handleClientChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clientsData.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Input
                id="platform"
                value={platform}
                readOnly
                className="bg-muted"
                placeholder="Auto-filled"
              />
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="profile">Perfil</Label>
              <Input
                id="profile"
                value={profile}
                readOnly
                className="bg-muted"
                placeholder="Auto-filled"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Precio</Label>
              <Input
                id="amount"
                type="number"
                placeholder="$0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Fecha de pago</Label>
              <Input id="paymentDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Metodo de pago</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="transfer">Nequi</SelectItem>
                <SelectItem value="zelle">Daviplata</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar Pago</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PaymentRow({ payment, onMarkPaid }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{payment.client}</TableCell>
      <TableCell>{payment.platform}</TableCell>
      <TableCell>{payment.profile}</TableCell>
      <TableCell>{payment.screem}</TableCell>
      <TableCell>${payment.amount}</TableCell>
      <TableCell>{payment.dueDate}</TableCell>
      <TableCell>
        <StatusBadge status={payment.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {(payment.status === "pending" || payment.status === "overdue") && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => onMarkPaid(payment.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Marcar como pagado
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como pagado
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Editar Pago
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Pago
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("april")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [payments, setPayments] = useState(paymentsData)

  const handleMarkPaid = (paymentId) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "paid" } : payment
      )
    )
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.client
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate summary stats
  const monthlyRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingCount = payments.filter((p) => p.status === "pending").length
  const overdueCount = payments.filter((p) => p.status === "overdue").length

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-50"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32.5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>

            {/* Month Filter */}
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-32.5">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">Enero</SelectItem>
                <SelectItem value="february">Febrero</SelectItem>
                <SelectItem value="march">Marzo</SelectItem>
                <SelectItem value="april">Abril</SelectItem>
                <SelectItem value="may">Mayo</SelectItem>
                <SelectItem value="june">Junio</SelectItem>
                <SelectItem value="july">Julio</SelectItem>
                <SelectItem value="august">Agosto</SelectItem>
                <SelectItem value="september">Septiembre</SelectItem>
                <SelectItem value="october">Octubre</SelectItem>
                <SelectItem value="november">Noviembre</SelectItem>
                <SelectItem value="december">Diciembre</SelectItem>
              </SelectContent>
            </Select>

            {/* Register Payment Button */}
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar pago
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            icon={DollarSign}
            title="Ingresos mensuales"
            value={`$${monthlyRevenue}`}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <SummaryCard
            icon={Clock}
            title="Pagos mensuales"
            value={`${pendingCount} Clientes`}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
          <SummaryCard
            icon={AlertTriangle}
            title="Pagos atrasados"
            value={`${overdueCount} Clientes`}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Perfil</TableHead> 
                  <TableHead>Pantalla (cuenta)</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onMarkPaid={handleMarkPaid}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Register Payment Modal */}
        <RegisterPaymentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </div>
  )
}
