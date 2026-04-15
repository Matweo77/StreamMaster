import { Link, useLocation } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"

export function TopNav() {
  const { pathname } = useLocation()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/Dashboard" className="font-medium">
            Interfaz
          </Link>

          {pathSegments.map((segment, index) => (
            <div key={segment} className="flex items-center">
              <span className="mx-2 text-muted-foreground">/</span>

              <Link
                to={`/${pathSegments.slice(0, index + 1).join("/")}`}
                className="capitalize"
              >
                {segment}
              </Link>
            </div>
          ))}
        </nav>

        {/* Usuario menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
              <Avatar>
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/Profile">Perfil</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}