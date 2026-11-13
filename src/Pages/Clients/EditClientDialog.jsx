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

export function EditClientDialog({ open, onOpenChange, onSubmit, clientData, pantallas = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    accountId: "",  
    profileId: "",  
    amount: "",
    proximoPago: "",
    estado: "active",
  })
  const [perfilesFiltrados, setPerfilesFiltrados] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos al abrir el modal de edición
  useEffect(() => {
    if (open && clientData) {
      const accId = String(clientData.accountId || clientData.account_id || "")
      
      // Capturamos el monto de donde venga (price, amount o monto)
      const currentAmount = clientData.price !== undefined ? clientData.price : (clientData.amount !== undefined ? clientData.amount : (clientData.monto !== undefined ? clientData.monto : ""))
      const currentPago = clientData.proximoPago || clientData.next_payment_date || clientData.fecha_pago || ""

      setFormData({
        nombre: clientData.nombre || clientData.name || "",
        whatsapp: clientData.whatsapp || clientData.telefono || "",
        accountId: accId,
        profileId: "", // Vacío por defecto para mantener el perfil actual si no se cambia
        amount: currentAmount !== null && currentAmount !== undefined ? String(currentAmount) : "",
        proximoPago: currentPago,
        estado: clientData.estado || clientData.status || "active",
      })
      setPerfilesFiltrados([])
    }
    setIsSubmitting(false)
  }, [open, clientData])

  // Efecto cascada para buscar perfiles disponibles si cambia de cuenta
  useEffect(() => {
    const fetchPerfiles = async () => {
      if (!formData.accountId) {
        setPerfilesFiltrados([])
        return
      }

      setLoadingProfiles(true)
      try {
        const data = await getAvailableProfilesByAccount(formData.accountId)
        setPerfilesFiltrados(data || [])
      } catch (error) {
        console.error("Error cargando perfiles libres:", error)
      } finally {
        setLoadingProfiles(false)
      }
    }

    if (formData.accountId) {
      fetchPerfiles()
    }
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
      // Si no selecciona un nuevo perfil, mantenemos el que ya tenía el cliente
      const finalProfileId = formData.profileId ? formData.profileId : (clientData.profileId || clientData.profile_id || null)

      const payload = {
        ...clientData,
        ...formData,
        id: clientData.id,
        // 🌟 Clave absoluta: Mandamos price formateado como número para Supabase
        price: Number(formData.amount),
        amount: formData.amount,
        monto: formData.amount,
        profileId: finalProfileId,
      }

      await onSubmit(payload)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al actualizar cliente:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid =
    formData.nombre.trim() &&
    formData.whatsapp.trim() &&
    formData.accountId &&
    formData.amount !== "" &&
    formData.proximoPago.trim()

  const cuentaActualObj = pantallas.find(p => String(p.id) === String(formData.accountId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos del cliente. Si no deseas cambiar el perfil, déjalo en blanco.
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

            {/* TARJETA INFORMATIVA */}
            <div className="rounded-lg border bg-muted/50 p-3 flex flex-col gap-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Cuenta actual:</span>
                <span className="text-foreground truncate max-w-[280px]">
                  {clientData?.pantalla || clientData?.plataforma || "No asignada"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Perfil actual:</span>
                <span className="font-semibold text-primary">
                  {clientData?.perfil ? `Perfil ${clientData.perfil}` : "Sin perfil"}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>1. Seleccionar Cuenta / Pantalla</Label>
              <Select
                value={formData.accountId}
                onValueChange={(v) => handleChange("accountId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Busca la cuenta del servicio">
                    {cuentaActualObj ? cuentaActualObj.label : (clientData?.plataforma || "Seleccione cuenta")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {pantallas.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>2. Perfiles Disponibles <span className="text-xs text-muted-foreground">(Opcional)</span></Label>
              <Select
                value={formData.profileId}
                onValueChange={(v) => handleChange("profileId", v)}
                disabled={!formData.accountId || loadingProfiles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingProfiles ? "Buscando cupos..." : "Mantener perfil actual (Opcional)"} />
                </SelectTrigger>
                <SelectContent>
                  {perfilesFiltrados.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      ⚠️ No hay perfiles libres nuevos.
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
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}