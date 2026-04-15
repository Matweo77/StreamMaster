import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, CreditCard, Tv, UserCheck } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "new_client",
    message: "Nuevo cliente registrado",
    detail: "Pedro Gomez",
    time: "Hace 5 min",
    icon: UserPlus,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
  },
  {
    id: 2,
    type: "payment",
    message: "Pago recibido",
    detail: "Ana Martinez - Netflix",
    time: "Hace 15 min",
    icon: CreditCard,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    id: 3,
    type: "profile",
    message: "Perfil asignado",
    detail: "Disney+ Perfil 3",
    time: "Hace 1 hora",
    icon: Tv,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    id: 4,
    type: "account",
    message: "Cuenta renovada",
    detail: "HBO Max Premium",
    time: "Hace 2 horas",
    icon: UserCheck,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
]

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`rounded-lg p-2 ${activity.iconBg}`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
