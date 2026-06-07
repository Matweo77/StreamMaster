"use client"

import { useState, useEffect } from "react"
import { getPlatforms } from "@/services/account.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddAccountModal({ open, onOpenChange, onSubmit, initialData }) {
  const [platforms, setPlatforms] = useState([])
  const [formData, setFormData] = useState({
    platform_id: "",
    email: "",
    password: "",
    profile_count: 5,
    notes: "",
  })

  // Cargar las plataformas reales de Supabase
  useEffect(() => {
    async function loadPlatforms() {
      try {
        const data = await getPlatforms()
        setPlatforms(data || [])
      } catch (error) {
        console.error("Error al cargar plataformas en modal:", error)
      }
    }
    if (open) loadPlatforms()
  }, [open])

  // Rellenar datos si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        platform_id: initialData.platform_id || "",
        email: initialData.email || "",
        password: initialData.password || "",
        profile_count: initialData.profiles?.length || 5,
        notes: initialData.notes || "",
      })
    } else {
      // Limpiar formulario si es una creación limpia
      setFormData({
        platform_id: "",
        email: "",
        password: "",
        profile_count: 5,
        notes: "",
      })
    }
  }, [initialData, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cuenta" : "Añadir Cuenta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {/* Selector de Plataforma */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plataforma</label>
            <Select
              value={formData.platform_id}
              onValueChange={(value) => setFormData({ ...formData, platform_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo Electrónico</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ejemplo@streaming.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña</label>
            <Input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Contraseña de la cuenta"
            />
          </div>

          {/* Cantidad de Perfiles */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cantidad de Perfiles (Cupos)</label>
            <Input
              type="number"
              min={1}
              max={10}
              required
              value={formData.profile_count}
              onChange={(e) => setFormData({ ...formData, profile_count: parseInt(e.target.value, 10) })}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas / Observaciones</label>
            <Input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Opcional (Ej: Pin de perfiles, dueño, etc.)"
            />
          </div>

          <DialogFooter className="pt-4 bg-white">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Guardar Cambios" : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}