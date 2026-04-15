// Payments table with pagination
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const statusConfig = {
  pagado: {
    label: "Pagado",
    className: "bg-green-500/20 text-green-400 hover:bg-green-500/30",
  },
  proximo: {
    label: "Proximo",
    className: "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
  },
  vencido: {
    label: "Vencido",
    className: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
  },
}

const platformColors = {
  Netflix: "bg-red-500",
  "Disney+": "bg-blue-600",
  "HBO Max": "bg-purple-600",
  Spotify: "bg-green-500",
  "Amazon Prime": "bg-cyan-500",
}

const payments = [
  {
    id: "1",
    cliente: "Juan Perez",
    plataforma: "Netflix",
    perfil: "Perfil 2",
    proximoPago: "05 abr 2026",
    estado: "proximo",
  },
  {
    id: "2",
    cliente: "Maria Garcia",
    plataforma: "Disney+",
    perfil: "Perfil 1",
    proximoPago: "03 abr 2026",
    estado: "proximo",
  },
  {
    id: "3",
    cliente: "Carlos Lopez",
    plataforma: "HBO Max",
    perfil: "Perfil 3",
    proximoPago: "28 mar 2026",
    estado: "vencido",
  },
  {
    id: "4",
    cliente: "Ana Martinez",
    plataforma: "Netflix",
    perfil: "Perfil 4",
    proximoPago: "01 abr 2026",
    estado: "pagado",
  },
  {
    id: "5",
    cliente: "Roberto Sanchez",
    plataforma: "Spotify",
    perfil: "Familia",
    proximoPago: "08 abr 2026",
    estado: "proximo",
  },
  {
    id: "6",
    cliente: "Laura Fernandez",
    plataforma: "Amazon Prime",
    perfil: "Principal",
    proximoPago: "30 mar 2026",
    estado: "vencido",
  },
  {
    id: "7",
    cliente: "Pedro Gomez",
    plataforma: "Netflix",
    perfil: "Perfil 1",
    proximoPago: "10 abr 2026",
    estado: "proximo",
  },
  {
    id: "8",
    cliente: "Sofia Ruiz",
    plataforma: "Disney+",
    perfil: "Perfil 3",
    proximoPago: "12 abr 2026",
    estado: "pagado",
  },
  {
    id: "9",
    cliente: "Miguel Torres",
    plataforma: "HBO Max",
    perfil: "Perfil 2",
    proximoPago: "15 abr 2026",
    estado: "proximo",
  },
  {
    id: "10",
    cliente: "Carmen Diaz",
    plataforma: "Spotify",
    perfil: "Individual",
    proximoPago: "02 abr 2026",
    estado: "pagado",
  },
]

const ITEMS_PER_PAGE = 5

export function PaymentsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPayments = payments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pagos Proximos</CardTitle>
          <Badge variant="secondary" className="font-normal">
            {payments.length} pagos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Cliente</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead className="hidden sm:table-cell">Perfil</TableHead>
              <TableHead className="hidden md:table-cell">Proximo pago</TableHead>
              <TableHead className="pr-6 text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="pl-6 font-medium">{payment.cliente}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${platformColors[payment.plataforma] || "bg-gray-500"}`}
                    />
                    {payment.plataforma}
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {payment.perfil}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {payment.proximoPago}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Badge className={statusConfig[payment.estado].className}>
                    {statusConfig[payment.estado].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, payments.length)} de {payments.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
