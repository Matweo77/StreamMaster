import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, DollarSign, Settings, HelpCircle, ChevronDown, Menu,Users, Mail, TriangleAlert } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/Dashboard", icon: Home },
  { name: "Gestion clientes", href: "/Gestion-clientes", icon: Users },
  { name: "Gestion cuentas", href: "/Gestion-cuentas", icon:  Mail},
  { name: "Gestion pagos", href: "/Gestion-pagos", icon: DollarSign},
  { name: "Vencimiento", href: "/Calendar", icon: TriangleAlert}
]

const bottomNavigation = [
  { name: "Configuración", href: "/configuracion", icon: Settings },
  { name: "Ayuda", href: "/ayuda", icon: HelpCircle },
]

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { pathname } = useLocation()
  const [expandedItems, setExpandedItems] = useState({})

  const toggleSubmenu = (name) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const NavItem = ({ item }) => {
    if (item.submenu) {
      return (
        <ExpandableNavItem
          item={item}
          isExpanded={expandedItems[item.name]}
          onToggle={() => toggleSubmenu(item.name)}
        />
      )
    }

    return (
      <Tooltip delayDuration={0} >
        <TooltipTrigger asChild className=" w-full" >
          <Link
            to={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm transition-colors", // Este es el menu de incio
              pathname === item.href
                ? "bg-blue-50 text-secondary-foreground"
                : "text-foreground hover:bg-blue-50 hover:text-secondary-foreground",
              isCollapsed && "justify-center ",
            )}
          >
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  const ExpandableNavItem = ({ item, isExpanded, onToggle }) => {
    return (
      <div className="space-y-1" >
        <button
          onClick={onToggle}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-blue-50"
        >
          <item.icon className="h-4 w-4 mr-2" />

          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </>
          )}
        </button>

        {!isCollapsed && isExpanded && (
          <div className="ml-6 space-y-1 border-l pl-2">
            {item.submenu.map((sub) => (
              <Link
                key={sub.name}
                to={sub.href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider >
      <div
        className={cn(
  "h-screen sticky top-0 flex flex-col border-r bg-background transition-all",
  isCollapsed ? "w-17.5" : "w-50"
)}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && <span className="font-semibold">StreamManager</span>}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="border-t p-2">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}