"use client"

import { useState } from "react"
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

export function AssignClientModal({ open, onOpenChange, onSubmit, profileInfo }) {
  const [clientName, setClientName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(clientName)
    setClientName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Assign Client</DialogTitle>
          <DialogDescription>
            Assign a client to {profileInfo?.profileName || "this profile"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Assign Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
