"use client"

import { useEffect, useState } from "react"
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

export function ClientDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  pantallas = [], 
}) {
  const [formData, setFormData] = useState(emptyFormData)
  const [perfilesFiltrados, setPerfilesFiltrados] = useState([]) 
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  // Estado para prevenir múltiples envíos
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Resetear o cargar datos iniciales
  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id, ...rest } = initialData
        setFormData({
          nombre: rest.nombre || "",
          whatsapp: rest.whatsapp || "",
          accountId: rest.accountId || "",
          profileId: rest.profileId || "",
          amount: rest.amount || "",
          proximoPago: rest.proximoPago || "",
          estado: rest.estado || "active",
        })
      } else {
        setFormData(emptyFormData)
        setPerfilesFiltrados([])
      }
      setIsSubmitting(false) // Resetear estado de envío al abrir
    }
  }, [open, initialData])

  // 2. EFECTO CASCADA
  useEffect(() => {
    const fetchPerfilesDeCuenta = async () => {
      if (!formData.accountId) {
        setPerfilesFiltrados([])
        return
      }

      setLoadingProfiles(true)
      try {
        const data = await getAvailableProfilesByAccount(formData.accountId)
        let listadoFinal = [...data]

        if (initialData && formData.accountId === initialData.accountId && initialData.profileId) {
          const existePerfilActual = listadoFinal.some(p => p.id === initialData.profileId)
          if (!existePerfilActual) {
            listadoFinal.unshift({
              id: initialData.profileId,
              profile_name: initialData.profileName || "Perfil Actual (Asignado)" 
            })
          }
        }
        setPerfilesFiltrados(listadoFinal)
      } catch (error) {
        console.error("Error filtrando perfiles:", error)
      } finally {
        setLoadingProfiles(false)
      }
    }

    fetchPerfilesDeCuenta()
  }, [formData.accountId, initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Evitar múltiples envíos si ya se está procesando
    if (isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await onSubmit(initialData ? { ...formData, id: initialData.id } : formData)
      onOpenChange(false) // Solo cerrar si la operación fue exitosa
    } catch (error) {
      console.error("Error al guardar cliente:", error)
      // Opcional: mostrar un toast de error aquí
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "accountId") {
        updated.profileId = ""
      }
      return updated
    })
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Modifica los datos del cliente y reasigna su cuenta o pantalla libre."
              : "Completa el formulario para agregar un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* NOMBRE */}
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            {/* WHATSAPP */}
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="Ej. 3001234567"
              />
            </div>

            {/* SELECTOR CUENTA */}
            <div className="grid gap-2">
              <Label>1. Seleccionar Cuenta / Pantalla</Label>
              <Select
                value={formData.accountId}
                onValueChange={(v) => handleChange("accountId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Busca la cuenta del servicio" />
                </SelectTrigger>
                <SelectContent>
                  {pantallas.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SELECTOR PERFILES */}
            <div className="grid gap-2">
              <Label>2. Perfiles Disponibles en esta Cuenta</Label>
              <Select
                value={formData.profileId}
                onValueChange={(v) => handleChange("profileId", v)}
                disabled={!formData.accountId || loadingProfiles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingProfiles ? "Buscando cupos..." : "Elige un perfil"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {perfilesFiltrados.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      ⚠️ Esta cuenta no tiene perfiles libres.
                    </div>
                  ) : (
                    perfilesFiltrados.map((perf) => (
                      <SelectItem key={perf.id} value={perf.id}>
                        {perf.profile_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* MONTO Y FECHA */}
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

            {/* ESTADO */}
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
              {isSubmitting 
                ? (initialData ? "Guardando..." : "Creando...") 
                : (initialData ? "Guardar cambios" : "Crear cliente")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}