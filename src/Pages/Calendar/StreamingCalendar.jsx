import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Bell, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Colores de los servicios de streaming
const COLORS = {
  background: "oklch(1 0 0)",
  cardBg: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  inputBg: "#f1f5f9",
  primary: "#6366f1",
  primaryLight: "#eef2ff",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  success: "#10b981",
  successLight: "#d1fae5",
  // Servicios de streaming
  netflix: "#e50914",
  spotify: "#1db954",
  disney: "#113ccf",
  hbo: "#9c27b0",
  prime: "#00a8e1",
}

const STREAMING_SERVICES = [
  { id: "netflix", name: "Netflix", color: COLORS.netflix },
  { id: "spotify", name: "Spotify", color: COLORS.spotify },
  { id: "disney", name: "Disney+", color: COLORS.disney },
  { id: "hbo", name: "HBO Max", color: COLORS.hbo },
  { id: "prime", name: "Prime Video", color: COLORS.prime },
]

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export default function StreamingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [accounts, setAccounts] = useState([
    { id: 1, service: "netflix", name: "Netflix Familiar", expirationDay: 8, price: 15.99 },
    { id: 2, service: "spotify", name: "Spotify Premium", expirationDay: 15, price: 9.99 },
    { id: 3, service: "disney", name: "Disney+ Anual", expirationDay: 22, price: 12.99 },
    { id: 4, service: "hbo", name: "HBO Max", expirationDay: 5, price: 14.99 },
    { id: 5, service: "prime", name: "Amazon Prime", expirationDay: 28, price: 8.99 },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    service: "",
    name: "",
    expirationDay: "",
    price: "",
  })

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDayOfMonth }
  }

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate)

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getAccountsForDay = (day) => {
    return accounts.filter((account) => account.expirationDay === day)
  }

  const getServiceInfo = (serviceId) => {
    return STREAMING_SERVICES.find((s) => s.id === serviceId) || STREAMING_SERVICES[0]
  }

  const handleAddAccount = () => {
    if (newAccount.service && newAccount.name && newAccount.expirationDay && newAccount.price) {
      setAccounts([
        ...accounts,
        {
          id: Date.now(),
          service: newAccount.service,
          name: newAccount.name,
          expirationDay: parseInt(newAccount.expirationDay),
          price: parseFloat(newAccount.price),
        },
      ])
      setNewAccount({ service: "", name: "", expirationDay: "", price: "" })
      setIsDialogOpen(false)
    }
  }

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear()

  const getUpcomingExpirations = () => {
    const todayDay = today.getDate()
    return accounts
      .map((account) => {
        let daysUntil = account.expirationDay - todayDay
        if (daysUntil < 0) {
          daysUntil += daysInMonth
        }
        return { ...account, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3)
  }

  const totalMonthly = accounts.reduce((sum, acc) => sum + acc.price, 0)

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: COLORS.background,
        padding: "2rem"
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div 
          style={{ 
            marginBottom: "2rem", 
            display: "flex", 
            flexWrap: "wrap",
            alignItems: "center", 
            justifyContent: "space-between",
            gap: "1rem"
          }}
        >
          <div>
            <h1 
              style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: COLORS.textPrimary,
                margin: 0
              }}
            >
              Calendario de vencimiento
            </h1>
            <p style={{ marginTop: "0.25rem", color: COLORS.textSecondary, margin: "0.5rem 0 0 0" }}>
              Administra tus suscripciones y fechas de vencimiento
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                style={{ 
                  backgroundColor: COLORS.primary, 
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Plus style={{ width: "1rem", height: "1rem" }} />
                Nueva Cuenta
              </Button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: COLORS.cardBg }}>
              <DialogHeader>
                <DialogTitle style={{ color: COLORS.textPrimary }}>Agregar Nueva Cuenta</DialogTitle>
              </DialogHeader>
              <div style={{ display: "grid", gap: "1rem", paddingTop: "1rem" }}>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <Label style={{ color: COLORS.textPrimary }}>Servicio</Label>
                  <Select
                    value={newAccount.service}
                    onValueChange={(value) => setNewAccount({ ...newAccount, service: value })}
                  >
                    <SelectTrigger style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}>
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {STREAMING_SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span 
                              style={{ 
                                width: "0.75rem", 
                                height: "0.75rem", 
                                borderRadius: "50%",
                                backgroundColor: service.color 
                              }} 
                            />
                            {service.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <Label style={{ color: COLORS.textPrimary }}>Nombre de la cuenta</Label>
                  <Input
                    placeholder="Ej: Netflix Familiar"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Label style={{ color: COLORS.textPrimary }}>Dia de vencimiento</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="1-31"
                      value={newAccount.expirationDay}
                      onChange={(e) => setNewAccount({ ...newAccount, expirationDay: e.target.value })}
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                    />
                  </div>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <Label style={{ color: COLORS.textPrimary }}>Precio mensual</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="$0.00"
                      value={newAccount.price}
                      onChange={(e) => setNewAccount({ ...newAccount, price: e.target.value })}
                      style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border }}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddAccount} 
                  style={{ 
                    marginTop: "0.5rem", 
                    backgroundColor: COLORS.primary, 
                    color: "white" 
                  }}
                >
                  Agregar Cuenta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div 
          style={{ 
            marginBottom: "2rem", 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem" 
          }}
        >
          <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
            <CardContent style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
              <div 
                style={{ 
                  borderRadius: "0.75rem", 
                  backgroundColor: COLORS.primaryLight, 
                  padding: "0.75rem" 
                }}
              >
                <Calendar style={{ width: "1.5rem", height: "1.5rem", color: COLORS.primary }} />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: COLORS.textSecondary, margin: 0 }}>Total Cuentas</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700", color: COLORS.textPrimary, margin: 0 }}>
                  {accounts.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
            <CardContent style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
              <div 
                style={{ 
                  borderRadius: "0.75rem", 
                  backgroundColor: COLORS.warningLight, 
                  padding: "0.75rem" 
                }}
              >
                <Bell style={{ width: "1.5rem", height: "1.5rem", color: COLORS.warning }} />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: COLORS.textSecondary, margin: 0 }}>Proximo Vencimiento</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700", color: COLORS.textPrimary, margin: 0 }}>
                  {getUpcomingExpirations()[0]?.daysUntil || 0} dias
                </p>
              </div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
            <CardContent style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
              <div 
                style={{ 
                  borderRadius: "0.75rem", 
                  backgroundColor: COLORS.successLight, 
                  padding: "0.75rem" 
                }}
              >
                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: COLORS.success }}>$</span>
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: COLORS.textSecondary, margin: 0 }}>Gasto Mensual</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700", color: COLORS.textPrimary, margin: 0 }}>
                  ${totalMonthly.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr",
            gap: "1.5rem"
          }}
          className="lg:grid-cols-3"
        >
          {/* Calendar */}
          <Card 
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
            className="lg:col-span-2"
          >
            <CardHeader style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.5rem" }}>
              <CardTitle style={{ fontSize: "1.25rem", fontWeight: "600", color: COLORS.textPrimary }}>
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.inputBg }}
                >
                  <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.inputBg }}
                >
                  <ChevronRight style={{ width: "1rem", height: "1rem" }} />
                </Button>
              </div>
            </CardHeader>
            <CardContent style={{ padding: "1rem" }}>
              {/* Days of week header */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    style={{ 
                      padding: "0.5rem", 
                      textAlign: "center", 
                      fontSize: "0.75rem", 
                      fontWeight: "500", 
                      color: COLORS.textSecondary 
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ aspectRatio: "1" }} />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dayAccounts = getAccountsForDay(day)
                  const isToday = isCurrentMonth && day === today.getDate()
                  const hasExpiration = dayAccounts.length > 0

                  return (
                    <div
                      key={day}
                      style={{
                        position: "relative",
                        display: "flex",
                        aspectRatio: "1",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderRadius: "0.5rem",
                        padding: "0.25rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: isToday 
                          ? COLORS.primaryLight 
                          : hasExpiration 
                            ? COLORS.inputBg 
                            : "transparent",
                        boxShadow: isToday ? `inset 0 0 0 2px ${COLORS.primary}` : "none"
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: isToday ? COLORS.primary : COLORS.textPrimary
                        }}
                      >
                        {day}
                      </span>
                      {hasExpiration && (
                        <div style={{ marginTop: "0.25rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px" }}>
                          {dayAccounts.slice(0, 3).map((account) => {
                            const service = getServiceInfo(account.service)
                            return (
                              <div
                                key={account.id}
                                style={{ 
                                  width: "0.5rem", 
                                  height: "0.5rem", 
                                  borderRadius: "50%",
                                  backgroundColor: service.color 
                                }}
                                title={account.name}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                {STREAMING_SERVICES.map((service) => (
                  <div key={service.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", backgroundColor: service.color }} />
                    <span style={{ fontSize: "0.75rem", color: COLORS.textSecondary }}>{service.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Expirations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
              <CardHeader>
                <CardTitle style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem", color: COLORS.textPrimary }}>
                  <AlertTriangle style={{ width: "1.25rem", height: "1.25rem", color: COLORS.warning }} />
                  Proximos Vencimientos
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {getUpcomingExpirations().map((account) => {
                  const service = getServiceInfo(account.service)
                  const isUrgent = account.daysUntil <= 3
                  return (
                    <div
                      key={account.id}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        borderRadius: "0.5rem", 
                        backgroundColor: COLORS.inputBg, 
                        padding: "0.75rem" 
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div 
                          style={{ 
                            width: "2.5rem", 
                            height: "2.5rem", 
                            borderRadius: "0.5rem", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            backgroundColor: service.color 
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "white" }}>
                            {service.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontWeight: "500", color: COLORS.textPrimary, margin: 0 }}>{account.name}</p>
                          <p style={{ fontSize: "0.875rem", color: COLORS.textSecondary, margin: 0 }}>
                            Dia {account.expirationDay}
                          </p>
                        </div>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: isUrgent ? COLORS.dangerLight : COLORS.inputBg,
                          color: isUrgent ? COLORS.danger : COLORS.textSecondary,
                          border: `1px solid ${isUrgent ? COLORS.danger : COLORS.border}`
                        }}
                      >
                        {account.daysUntil === 0 ? "Hoy" : `${account.daysUntil}d`}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* All Accounts */}
            <Card style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
              <CardHeader>
                <CardTitle style={{ fontSize: "1.125rem", color: COLORS.textPrimary }}>Todas las Cuentas</CardTitle>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {accounts.map((account) => {
                  const service = getServiceInfo(account.service)
                  return (
                    <div
                      key={account.id}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        borderRadius: "0.5rem", 
                        border: `1px solid ${COLORS.border}`,
                        backgroundColor: COLORS.inputBg, 
                        padding: "0.75rem",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div 
                          style={{ 
                            width: "0.5rem", 
                            height: "0.5rem", 
                            borderRadius: "50%",
                            backgroundColor: service.color 
                          }} 
                        />
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: "500", color: COLORS.textPrimary, margin: 0 }}>{account.name}</p>
                          <p style={{ fontSize: "0.75rem", color: COLORS.textSecondary, margin: 0 }}>
                            Vence el {account.expirationDay} - ${account.price}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAccount(account.id)}
                        style={{ 
                          width: "2rem", 
                          height: "2rem", 
                          color: COLORS.textSecondary 
                        }}
                      >
                        <X style={{ width: "1rem", height: "1rem" }} />
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
