import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Tv, Clock } from "lucide-react"

const metrics = [
  {
    title: "Ingresos del mes",
    value: "$1,245.00",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Clientes activos",
    value: "48",
    change: "+3",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Perfiles ocupados",
    value: "156/180",
    change: "86.7%",
    changeType: "neutral",
    icon: Tv,
  },
  {
    title: "Pagos proximos",
    value: "12",
    change: "Esta semana",
    changeType: "warning",
    icon: Clock,
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p
                  className={`text-xs ${
                    metric.changeType === "positive"
                      ? "text-green-500"
                      : metric.changeType === "warning"
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {metric.change}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
