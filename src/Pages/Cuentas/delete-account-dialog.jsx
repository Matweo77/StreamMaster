"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DeleteAccountDialog({ open, onOpenChange, onConfirm, accountEmail }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Estás completamente seguro?</DialogTitle>
          <DialogDescription className="pt-2">
            Estás a punto de eliminar la cuenta <strong className="text-foreground">{accountEmail}</strong>. 
            Esta acción eliminará de forma permanente la cuenta, sus perfiles y las suscripciones asociadas en la base de datos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sí, eliminar cuenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}