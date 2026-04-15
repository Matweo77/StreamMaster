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
import { PLATFORMS, PANTALLA, PROFILES, STATUS_OPTIONS } from "../../lib/types";

const emptyFormData = {
  nombre: "",
  whatsapp: "",
  plataforma: "",
  pantalla: "",
  amount: "",
  perfil: "",
  proximoPago: "",
  estado: "activo",
}

export function ClientDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) {
  const [formData, setFormData] = useState(emptyFormData)

  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id, ...rest } = initialData
        setFormData(rest)
      } else {
        setFormData(emptyFormData)
      }
    }
  }, [open, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isValid =
    formData.nombre.trim() &&
    formData.whatsapp.trim() &&
    formData.plataforma &&
    formData.pantalla &&
    formData.amount &&
    formData.perfil &&
    formData.proximoPago.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Modifica los datos del cliente y guarda los cambios."
              : "Completa el formulario para agregar un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>

            {/* WhatsApp */}
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="Ej: 555-1234"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
              />
            </div>

            {/* Plataforma, pantalla y Perfil */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plataforma">Plataforma</Label>
                <Select
                  value={formData.plataforma}
                  onValueChange={(value) => handleChange("plataforma", value)}
                >
                  <SelectTrigger id="plataforma" className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pantalla">Pantalla</Label>
                <Select
                  value={formData.pantalla}
                  onValueChange={(value) => handleChange("pantalla", value)}
                >
                  <SelectTrigger id="pantalla" className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PANTALLA.map((pantalla) => (
                      <SelectItem key={pantalla} value={pantalla}>
                        {pantalla}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  value={formData.perfil}
                  onValueChange={(value) => handleChange("perfil", value)}
                >
                  <SelectTrigger id="perfil" className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
             <div className="grid gap-2">
                <Label htmlFor="amount">Perfil</Label>
                <Select
                  value={formData.amount}
                  onValueChange={(value) => handleChange("amount", value)}
                >
                  <SelectTrigger id="amount" className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILES.map((amount) => (
                      <SelectItem key={amount} value={amount}>
                        {amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Próximo Pago y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="proximoPago">Próximo Pago</Label>
                <Input
                  id="proximoPago"
                  placeholder="Ej: 15 Jun"
                  value={formData.proximoPago}
                  onChange={(e) => handleChange("proximoPago", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleChange("estado", value)}
                >
                  <SelectTrigger id="estado" className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              {initialData ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
