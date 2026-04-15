import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  activo: {
    label: "Activo",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/20",
  },
  vencido: {
    label: "Vencido",
    className: "bg-red-500/15 text-red-700 border-red-500/20",
  },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status]
  
  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
