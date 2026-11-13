"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_OPTIONS } from "../../lib/types"
import { getAvailableProfilesByAccount } from "@/services/clients.service"

const emptyFormData = {
  nombre: "",
  whatsapp: "",
  accountId: "",  
  profileId: "",  
  amount: "",
  proximoPago: "",
  estado: "active",
}

export function CreateClientDialog({ open, onOpenChange, onSubmit, pantallas = [] }) {
  const [formData, setFormData] = useState(emptyFormData)
  const [perfilesFiltrados, setPerfilesFiltrados] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Limpiar al abrir
  useEffect(() => {
    if (open) {
      setFormData(emptyFormData)
      setPerfilesFiltrados([])
      setIsSubmitting(false)
    }
  }, [open])

  // Efecto cascada limpio para buscar perfiles disponibles al elegir cuenta
  useEffect(() => {
    const fetchPerfiles = async () => {
      if (!formData.accountId) {
        setPerfilesFiltrados([])
        return
      }

      setLoadingProfiles(true)
      try {
        const data = await getAvailableProfilesByAccount(formData.accountId)
        setPerfilesFiltrados(data)
      } catch (error) {
        console.error("Error cargando perfiles libres:", error)
      } finally {
        setLoadingProfiles(false)
      }
    }

    fetchPerfiles()
  }, [formData.accountId])

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "accountId") {
        updated.profileId = "" // Resetear perfil si cambia de cuenta
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al crear cliente:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid =
    formData.nombre.trim() &&
    formData.whatsapp.trim() &&
    formData.accountId &&
    formData.profileId &&
    formData.amount &&
    formData.proximoPago.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Completa el formulario para registrar un nuevo cliente y asignarle una pantalla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre completo</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label>WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="Ej. 3001234567"
              />
            </div>

            <div className="grid gap-2">
              <Label>1. Seleccionar Cuenta / Pantalla</Label>
              <Select 
                value={formData.accountId}
                onValueChange={(v) => handleChange("accountId", v)}
              >
                <SelectTrigger className="w-100">
                  <SelectValue placeholder="Busca la cuenta del servicio" />
                </SelectTrigger>
                <SelectContent >
                  {pantallas.map((acc) => (
                    <SelectItem  key={acc.id} value={String(acc.id)}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>2. Perfiles Disponibles</Label>
              <Select
                value={formData.profileId}
                onValueChange={(v) => handleChange("profileId", v)}
                disabled={!formData.accountId || loadingProfiles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingProfiles ? "Buscando cupos..." : "Elige un perfil"} />
                </SelectTrigger>
                <SelectContent>
                  {perfilesFiltrados.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      ⚠️ Esta cuenta no tiene perfiles libres.
                    </div>
                  ) : (
                    perfilesFiltrados.map((perf) => (
                      <SelectItem key={perf.id} value={String(perf.id)}>
                        {perf.profile_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="25000"
                />
              </div>
              <div className="grid gap-2">
                <Label>Próximo pago</Label>
                <Input
                  type="date"
                  value={formData.proximoPago}
                  onChange={(e) => handleChange("proximoPago", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Estado de Suscripción</Label>
              <Select
                value={formData.estado}
                onValueChange={(v) => handleChange("estado", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}