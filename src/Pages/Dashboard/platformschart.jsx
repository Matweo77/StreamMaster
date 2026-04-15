import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const platforms = [
  { name: "Netflix", profiles: 45, total: 50, color: "bg-red-500" },
  { name: "Disney+", profiles: 38, total: 40, color: "bg-blue-600" },
  { name: "HBO Max", profiles: 28, total: 35, color: "bg-purple-600" },
  { name: "Spotify", profiles: 25, total: 30, color: "bg-green-500" },
  { name: "Amazon Prime", profiles: 20, total: 25, color: "bg-cyan-500" },
]

export function PlatformsChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Plataformas mas usadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => {
          const percentage = Math.round((platform.profiles / platform.total) * 100)
          return (
            <div key={platform.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${platform.color}`} />
                  <span className="font-medium text-foreground">{platform.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {platform.profiles}/{platform.total} ({percentage}%)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
