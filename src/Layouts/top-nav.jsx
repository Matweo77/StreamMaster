import { Link, useLocation } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
} from "../components/ui/avatar"

export function TopNav() {
  const { pathname } = useLocation()

  const pathSegments = pathname
    .split("/")
    .filter(Boolean)

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Link
            to="/Dashboard"
            className="font-medium"
          >
            Interfaz
          </Link>

          {pathSegments.map((segment, index) => (
            <div
              key={segment}
              className="flex items-center"
            >
              <span className="mx-2 text-muted-foreground">
                /
              </span>

              <Link
                to={`/${pathSegments
                  .slice(0, index + 1)
                  .join("/")}`}
                className="capitalize"
              >
                {segment}
              </Link>
            </div>
          ))}
        </nav>

        {/* Usuario menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="
              flex h-8 w-8 items-center
              justify-center rounded-full
              transition-colors
              hover:bg-accent
              focus:outline-none
              focus:ring-2
              focus:ring-ring
            "
          >
            <Avatar>
              <AvatarFallback>
                US
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/Profile">
                Perfil
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}