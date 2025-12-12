"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { FilterButtons } from "@/components/common/filter-buttons"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useUsers } from "@/hooks/use-users"
import type { User } from "@/lib/types"

const tabs = ["All Users", "Active Users", "Inactive Users"]
const filters = ["Status", "Role", "Date Range"]


export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("all users")
  const { theme } = useTheme()
  const { users, stats, isLoading, isError, deleteUser } = useUsers()
  
  const columns: TableColumn<User>[] = [
    { key: "id", header: "User ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    { key: "date", header: "Date Created" },
    {
      key: "actions" as const,
      header: "Actions",
      render: (user: User) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => deleteUser(user.id)}
        >
          Delete
        </Button>
      ),
    },
  ]

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Users", value: stats.total },
    { title: "Active Users", value: stats.active },
    { title: "Inactive Users", value: stats.inactive },
    { title: "Pending Users", value: stats.pending },
  ]

  // فقط اینو اضافه کردم: action برای موبایل
  const mobileListItems = users.map((u) => ({
    id: u.id,
    title: u.name,
    subtitle: u.email,
    meta: [u.role, u.date],
    createdBy: u.role,
    status: u.status,
    action: () => (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteUser(u.id)}
      >
        Delete
      </Button>
    ),
  }))

  return (
    <DashboardLayout title="Users Management" wave={true}>
      <MobileSearchBar />

      <div className="hidden lg:grid mb-8 mx-20 grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {statsItems.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="flex items-center justify-center h-24">
                <Button
                  className={`text-md rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Users Management
                </h1>
                <Button
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap flex-shrink-0 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            <div className="hidden md:block">
              <DataTable data={users} columns={columns} />
            </div>

            <MobileListView items={mobileListItems} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}