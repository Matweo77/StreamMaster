"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AccountCard } from "./account-card"
import { AddAccountModal } from "./add-account-modal"
import { AssignClientModal } from "./assign-client-modal"

// Sample data
const initialAccounts = [
  {
    id: "1",
    platform: "Netflix",
    email: "netflixfamily@gmail.com",
    password: "password123",
    profiles: [
      { id: "1-1", name: "Profile 1", client: "Juan" },
      { id: "1-2", name: "Profile 2", client: null },
      { id: "1-3", name: "Profile 3", client: "Maria" },
      { id: "1-4", name: "Profile 4", client: null },
      { id: "1-5", name: "Profile 5", client: "Pedro" },
    ],
  },
  {
    id: "2",
    platform: "Disney+",
    email: "disney.shared@gmail.com",
    password: "disney2024",
    profiles: [
      { id: "2-1", name: "Profile 1", client: "Ana" },
      { id: "2-2", name: "Profile 2", client: "Carlos" },
      { id: "2-3", name: "Profile 3", client: "Luis" },
      { id: "2-4", name: "Profile 4", client: "Sofia" },
    ],
  },
  {
    id: "3",
    platform: "HBO Max",
    email: "hbomax.premium@gmail.com",
    password: "hbo2024secure",
    profiles: [
      { id: "3-1", name: "Profile 1", client: "Miguel" },
      { id: "3-2", name: "Profile 2", client: null },
      { id: "3-3", name: "Profile 3", client: null },
      { id: "3-4", name: "Profile 4", client: null },
      { id: "3-5", name: "Profile 5", client: null },
    ],
  },
  {
    id: "4",
    platform: "Amazon Prime",
    email: "prime.video@outlook.com",
    password: "amazonsecure123",
    profiles: [
      { id: "4-1", name: "Profile 1", client: "Elena" },
      { id: "4-2", name: "Profile 2", client: "Roberto" },
      { id: "4-3", name: "Profile 3", client: null },
    ],
  },
  {
    id: "5",
    platform: "Spotify",
    email: "spotify.family@gmail.com",
    password: "spotify2024",
    profiles: [
      { id: "5-1", name: "Profile 1", client: "Laura" },
      { id: "5-2", name: "Profile 2", client: "Diego" },
      { id: "5-3", name: "Profile 3", client: "Carmen" },
      { id: "5-4", name: "Profile 4", client: "Pablo" },
      { id: "5-5", name: "Profile 5", client: "Lucia" },
      { id: "5-6", name: "Profile 6", client: "Andres" },
    ],
  },
  {
    id: "6",
    platform: "Apple TV+",
    email: "appletv.shared@icloud.com",
    password: "apple2024tv",
    profiles: [
      { id: "6-1", name: "Profile 1", client: null },
      { id: "6-2", name: "Profile 2", client: null },
      { id: "6-3", name: "Profile 3", client: null },
      { id: "6-4", name: "Profile 4", client: null },
    ],
  },
]

const platforms = ["All", "Netflix", "Disney+", "HBO Max", "Amazon Prime", "Spotify", "Apple TV+"]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Filter accounts based on search and platform
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.platform.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform =
      platformFilter === "All" || account.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  // Handle add account
  const handleAddAccount = (formData) => {
    const newAccount = {
      id: Date.now().toString(),
      platform: formData.platform,
      email: formData.email,
      password: formData.password,
      profiles: Array.from({ length: formData.profileCount }, (_, i) => ({
        id: `${Date.now()}-${i + 1}`,
        name: `Profile ${i + 1}`,
        client: null,
      })),
    }
    setAccounts([...accounts, newAccount])
  }

  // Handle edit account
  const handleEditAccount = (account) => {
    // For now, just log - you could open an edit modal
    console.log("Edit account:", account)
  }

  // Handle delete account
  const handleDeleteAccount = (account) => {
    setAccounts(accounts.filter((a) => a.id !== account.id))
  }

  // Handle assign client
  const handleAssign = (accountId, profileId) => {
    const account = accounts.find((a) => a.id === accountId)
    const profile = account?.profiles.find((p) => p.id === profileId)
    setSelectedProfile({ accountId, profileId, profileName: profile?.name })
    setIsAssignModalOpen(true)
  }

  const handleAssignSubmit = (clientName) => {
    if (!selectedProfile) return

    setAccounts(
      accounts.map((account) => {
        if (account.id === selectedProfile.accountId) {
          return {
            ...account,
            profiles: account.profiles.map((profile) => {
              if (profile.id === selectedProfile.profileId) {
                return { ...profile, client: clientName }
              }
              return profile
            }),
          }
        }
        return account
      })
    )
  }

  // Handle unassign client
  const handleUnassign = (accountId, profileId) => {
    setAccounts(
      accounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            profiles: account.profiles.map((profile) => {
              if (profile.id === profileId) {
                return { ...profile, client: null }
              }
              return profile
            }),
          }
        }
        return account
      })
    )
  }

  return (
    <div className="flex h-screen bg-background">

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Page header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search account or platform..."
                  className="w-full pl-9 sm:w-70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Platform filter */}
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <Filter className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add account button */}
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 size-4" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Accounts grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
                onAssign={handleAssign}
                onUnassign={handleUnassign}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredAccounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No accounts found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || platformFilter !== "All"
                  ? "Try adjusting your search or filter."
                  : "Add your first streaming account to get started."}
              </p>
              {!searchQuery && platformFilter === "All" && (
                <Button
                  className="mt-4"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="mr-2 size-4" />
                  Add Account
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddAccount}
      />

      {/* Assign Client Modal */}
      <AssignClientModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onSubmit={handleAssignSubmit}
        profileInfo={selectedProfile}
      />
    </div>
  )
}
