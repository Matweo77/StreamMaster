"use client"

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./status-badge"

export function ClientsTable({ clients, onEdit, onDelete }) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground">No se encontraron clientes</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Plataforma</TableHead>
            <TableHead>Pantalla (cuenta)</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Próximo Pago</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-17.5">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.nombre}</TableCell>
              <TableCell>{client.whatsapp}</TableCell>
              <TableCell>
                <Badge variant="outline">{client.plataforma}</Badge>
              </TableCell>
              <TableCell>{client.pantalla}</TableCell>
              <TableCell>{client.perfil}</TableCell>
              <TableCell>${client.amount}</TableCell>
              <TableCell>{client.proximoPago}</TableCell>
              <TableCell>
                <StatusBadge status={client.estado} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(client)}>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="size-4" />
                      Ver pagos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(client)}
                    >
                      <Trash2 className="size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
