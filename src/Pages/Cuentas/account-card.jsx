import { MoreHorizontal, Pencil, Trash2, UserPlus, UserMinus } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const platformIcons = {
  Neflix: (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#E50914]">
      <path d="M5.398 0v24l6.63-7.476L18.602 24V0H5.398zM8.882 3.09h2.484v13.236l-2.484-2.79V3.09zm6.236 0v10.446l-2.484 2.79V3.09h2.484z" />
    </svg>
  ),
  "Disney+": (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#113CCF]">
      <path d="M2.063 8.672c.627-.424 2.86-.81 4.152-.878.266-.013.442-.025.578-.017.095.006.195.025.195.102 0 .056-.034.096-.127.133-.578.229-2.271 1.127-2.271 1.127s-.067.045-.067.088c0 .045.048.063.108.063.067 0 2.13-.263 3.728-.263 1.598 0 2.98.263 2.98.263.068 0 .12-.018.12-.063 0-.043-.067-.088-.067-.088s-1.693-.898-2.271-1.127c-.093-.037-.127-.077-.127-.133 0-.077.1-.096.195-.102.136-.008.312.004.578.017 1.292.068 3.525.454 4.152.878.04.027.067.077.067.127 0 .128-.167.153-.257.153-.15 0-.437-.043-.727-.086-.47-.068-.988-.136-1.142-.136-.117 0-.16.034-.16.096 0 .05.043.086.12.119l2.313 1.06c.077.034.12.084.12.153 0 .085-.06.136-.18.17-.728.204-3.59.898-3.59.898s-.127.034-.127.085c0 .051.093.077.186.103 1.143.305 3.185.898 3.185.898.146.043.213.112.213.196 0 .153-.227.17-.337.17-.253 0-.897-.102-1.38-.178-.495-.077-.896-.136-.987-.136-.076 0-.12.034-.12.085 0 .034.034.077.093.111 1.09.712 2.313 2.047 2.313 3.616 0 .56-.194 1.025-.504 1.391-.512.602-1.402.965-2.454.965-1.858 0-3.356-1.119-3.356-2.677 0-.747.32-1.416.89-1.929.077-.069.127-.111.127-.162 0-.06-.067-.094-.16-.094-.085 0-.186.034-.303.111-.918.615-1.481 1.56-1.481 2.618 0 1.97 1.783 3.531 4.283 3.531 2.262 0 4.047-1.34 4.047-3.107 0-1.493-.988-2.763-2.506-3.446.253.051.555.094.84.094 1.142 0 2.096-.543 2.096-1.527 0-.678-.512-1.263-1.31-1.552.798-.424 1.31-1.017 1.31-1.748 0-.39-.143-.728-.396-1.008.694-.127 1.218-.373 1.218-.747 0-.373-.626-.764-1.667-.967-1.785-.347-4.58-.517-6.737-.517-2.157 0-4.952.17-6.737.517-1.04.203-1.667.594-1.667.967 0 .374.524.62 1.218.747-.253.28-.396.618-.396 1.008 0 .73.512 1.324 1.31 1.748-.798.289-1.31.874-1.31 1.552 0 .984.954 1.527 2.096 1.527.286 0 .587-.043.84-.094-1.518.683-2.506 1.953-2.506 3.446 0 1.767 1.785 3.107 4.047 3.107 2.5 0 4.283-1.561 4.283-3.531 0-1.058-.563-2.003-1.481-2.618-.117-.077-.218-.111-.303-.111-.093 0-.16.034-.16.094 0 .051.05.093.127.162.57.513.89 1.182.89 1.929 0 1.558-1.498 2.677-3.356 2.677-1.052 0-1.942-.363-2.454-.965-.31-.366-.504-.83-.504-1.391 0-1.569 1.223-2.904 2.313-3.616.059-.034.093-.077.093-.111 0-.051-.044-.085-.12-.085-.091 0-.492.06-.987.136-.483.076-1.127.178-1.38.178-.11 0-.337-.017-.337-.17 0-.084.067-.153.213-.196 0 0 2.042-.593 3.185-.898.093-.026.186-.052.186-.103 0-.051-.127-.085-.127-.085s-2.862-.694-3.59-.898c-.12-.034-.18-.085-.18-.17 0-.07.043-.119.12-.153l2.313-1.06c.077-.033.12-.068.12-.119 0-.062-.043-.096-.16-.096-.154 0-.672.068-1.142.136-.29.043-.577.086-.727.086-.09 0-.257-.025-.257-.153 0-.05.027-.1.067-.127z" />
    </svg>
  ),
  "HBO Max": (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#5822B4]">
      <path d="M4.5 3.5A1.5 1.5 0 006 5v14a1.5 1.5 0 00-3 0V5a1.5 1.5 0 011.5-1.5zM12 3.5A1.5 1.5 0 0113.5 5v6.5h5V5a1.5 1.5 0 013 0v14a1.5 1.5 0 01-3 0v-6.5h-5V19a1.5 1.5 0 01-3 0V5A1.5 1.5 0 0112 3.5z" />
    </svg>
  ),
  "Amazon Prime": (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#00A8E1]">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.54.167.117.168.107.378-.03.564-.098.136-.224.28-.378.432-.659.652-1.478 1.218-2.458 1.692-.98.474-1.978.825-2.992 1.056-1.013.23-2.023.347-3.028.347-2.448 0-4.792-.494-7.03-1.48-2.238-.988-4.168-2.346-5.79-4.074-.082-.088-.086-.178-.015-.268l.008-.014zm6.925-4.873c0-1.022.274-1.99.822-2.906.548-.916 1.295-1.597 2.24-2.044-.036.036-.085.137-.144.303-.06.166-.114.34-.162.522-.048.18-.09.364-.126.55-.036.186-.063.337-.078.453l-.024.188c0 .083.012.193.038.33.025.136.075.297.148.48.073.185.172.386.295.603.123.218.27.453.44.707.084.12.123.22.117.305-.006.083-.056.163-.15.24-.094.076-.218.155-.372.237-.153.082-.32.167-.5.258-.18.09-.353.19-.52.297-.166.107-.32.223-.456.35-.138.125-.253.264-.345.417-.093.152-.14.32-.14.5 0 .107.01.217.033.328.023.11.06.224.114.337.054.113.128.224.22.333.093.11.204.21.336.3.132.09.286.167.464.23.177.064.378.096.603.096.18 0 .36-.02.54-.064.18-.043.354-.097.522-.162.169-.066.32-.14.457-.22.135-.082.248-.16.337-.235.09-.075.16-.14.215-.195l.07-.07c.01-.01.045 0 .104.025.06.025.132.05.216.074.084.024.17.047.258.07.088.022.158.034.21.034.22 0 .403-.06.548-.177.146-.118.218-.267.218-.45 0-.145-.04-.285-.118-.42-.08-.137-.176-.264-.29-.386-.115-.12-.228-.232-.342-.336-.113-.105-.21-.2-.288-.286-.078-.086-.117-.164-.117-.235 0-.07.046-.17.136-.302.09-.132.2-.278.328-.44.13-.16.26-.334.39-.52.13-.187.248-.382.354-.586.106-.204.19-.41.252-.62.062-.21.093-.418.093-.623 0-.296-.05-.59-.152-.88-.1-.29-.24-.554-.418-.79-.177-.236-.39-.437-.635-.603-.245-.166-.506-.29-.784-.37-.277-.082-.562-.123-.855-.123-.372 0-.727.063-1.065.19-.337.127-.64.303-.905.527-.265.223-.493.49-.68.797-.187.307-.326.638-.417.994l-1.254-.22c.216-.928.655-1.68 1.315-2.256.66-.577 1.466-.866 2.42-.866.4 0 .78.054 1.14.162.36.107.688.26.98.456.294.196.548.432.764.707.216.275.384.58.503.915.12.335.178.686.178 1.055 0 .35-.048.688-.145 1.01-.096.324-.228.627-.394.91-.166.284-.356.542-.57.775-.216.232-.44.433-.676.603-.235.17-.466.305-.693.404-.227.1-.435.16-.624.185-.07.01-.16.015-.266.015h-.298c-.203 0-.356.062-.46.187-.104.124-.156.27-.156.438 0 .17.047.316.14.44.095.124.21.225.348.303.138.078.286.14.448.183.162.044.307.074.44.092.13.017.237.026.316.026.195 0 .37-.023.524-.068.154-.045.284-.1.39-.166.106-.066.19-.137.248-.21.06-.073.088-.14.088-.198 0-.09-.042-.14-.125-.148-.1-.01-.2-.068-.3-.175-.1-.108-.15-.288-.15-.54 0-.253.097-.476.29-.667.194-.19.43-.334.71-.428.277-.095.556-.142.835-.142.385 0 .744.077 1.076.23.332.152.62.368.862.645.243.277.434.607.573.99.14.38.21.796.21 1.245 0 .568-.11 1.1-.328 1.594-.22.494-.527.92-.923 1.28-.397.36-.867.64-1.41.84-.545.2-1.14.3-1.788.3-.684 0-1.3-.1-1.848-.298-.548-.2-1.012-.47-1.39-.812-.38-.343-.665-.745-.854-1.206-.19-.46-.285-.95-.285-1.472z" />
    </svg>
  ),
  Spotify: (
    <svg viewBox="0 0 24 24" className="size-6 fill-[#1DB954]">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  "Apple TV+": (
    <svg viewBox="0 0 24 24" className="size-6 fill-foreground">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
}

function getOccupancyColor(occupied, total) {
  if (total === 0) return "bg-muted"
  const percentage = (occupied / total) * 100
  if (percentage < 50) return "bg-emerald-500"
  if (percentage < 80) return "bg-amber-500"
  return "bg-rose-500"
}

function getOccupancyTextColor(occupied, total) {
  if (total === 0) return "text-muted-foreground"
  const percentage = (occupied / total) * 100
  if (percentage < 50) return "text-emerald-600"
  if (percentage < 80) return "text-amber-600"
  return "text-rose-600"
}

export function AccountCard({ account, onEdit, onDelete, onAssign, onUnassign }) {
  // 🌟 Se filtra usando la columna 'status === occupied' de tu base de datos
  const occupiedProfiles = account.profiles?.filter((p) => p.status === "occupied").length || 0
  const totalProfiles = account.profiles?.length || 0
  const occupancyPercentage = totalProfiles > 0 ? (occupiedProfiles / totalProfiles) * 100 : 0

  return (
    <Card className="gap-4 transition-shadow hover:shadow-md">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            {platformIcons[account.platform] || (
              <span className="text-xs font-bold">{account.platform?.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{account.platform}</CardTitle>
            <CardDescription className="truncate text-xs">
              {account.email}
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(account)}
              >
                <Trash2 className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Occupancy Indicator */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-sm font-medium",
                getOccupancyTextColor(occupiedProfiles, totalProfiles)
              )}
            >
              {occupiedProfiles} / {totalProfiles} Perfiles Ocupados
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full transition-all",
                getOccupancyColor(occupiedProfiles, totalProfiles)
              )}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Profiles Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Perfiles
          </span>
          <div className="flex flex-wrap gap-2">
            {account.profiles?.map((profile) => (
              <div
                key={profile.id}
                className={cn(
                  "group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                  profile.status === "occupied"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {/* 🌟 Cambiado 'profile.name' por 'profile.profile_name' */}
                <span className="font-medium">{profile.profile_name}</span>
                {profile.status === "occupied" ? (
                  <>
                    <span className="text-xs">- {profile.client || "Cliente"}</span>
                    <button
                      onClick={() => onUnassign(profile.id)}
                      className="ml-1 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
                      title="Desasignar cliente"
                    >
                      <UserMinus className="size-3 text-destructive" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onAssign(account.id, profile.id)}
                    className="ml-1 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <UserPlus className="size-3" />
                    Asignar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}