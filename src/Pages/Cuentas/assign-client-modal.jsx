"use client"

import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AssignClientModal({
  open,
  onOpenChange,
  profileInfo,
  onSubmit,
}) {
  const [clientName, setClientName] = useState("")
  const [loading, setLoading] = useState(false)

  // Limpiar el input cuando el modal cambie de estado (abrir/cerrar)
  useEffect(() => {
    if (!open) {
      setClientName("")
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profileInfo || !clientName.trim()) return

    try {
      setLoading(true)

      // 🌟 Llama a handleAssignSubmit heredado en 'onSubmit' desde AccountsPage
      await onSubmit(clientName.trim())

      // Cerrar modal (la limpieza del input ocurre en el useEffect superior)
      onOpenChange(false)
    } catch (error) {
      console.error("❌ Error al procesar la asignación del cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Asignar Cliente</DialogTitle>
          <DialogDescription>
            Asigna un cliente al cupo del{" "}
            <span className="font-semibold text-primary">
              {profileInfo?.profileName || "este perfil"}
            </span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nombre del Cliente</Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Asignando..." : "Asignar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}