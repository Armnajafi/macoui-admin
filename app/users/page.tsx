// app/dashboard/users/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { FilterButtons } from "@/components/common/filter-buttons"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useUsers, type User } from "@/hooks/use-users"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const tabs = ["All Users", "Active", "Inactive", "Pending"]
const filters = ["Status", "Role", "Date Range"]

// تعریف تایپ TableColumn
interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export default function UserManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("All Users")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const { theme } = useTheme()
  const { 
    users, 
    stats, 
    isLoading, 
    deleteUser, 
    updateUserStatus,
    updateUserRole 
  } = useUsers()
  
  // فیلتر کردن کاربران بر اساس تب فعال
  const filteredUsers = users.filter(user => {
    if (activeTab === "All Users") return true
    if (activeTab === "Active") return user.status === "Active"
    if (activeTab === "Inactive") return user.status === "Inactive"
    if (activeTab === "Pending") return user.status === "Pending"
    return true
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-green-100 text-green-800 border-green-200",
      Inactive: "bg-red-100 text-red-800 border-red-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      Admin: "bg-purple-100 text-purple-800 border-purple-200",
      Editor: "bg-blue-100 text-blue-800 border-blue-200",
      Viewer: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return (
      <Badge variant="outline" className={variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {role}
      </Badge>
    )
  }

  const columns: TableColumn<User>[] = [
    { 
      key: "id", 
      header: "User ID",
      render: (user: User) => (
        <span className="font-mono text-sm">{user.id}</span>
      )
    },
    { 
      key: "name", 
      header: "Name",
      render: (user: User) => user.name
    },
    { 
      key: "email", 
      header: "Email",
      render: (user: User) => user.email
    },
    { 
      key: "role", 
      header: "Role",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {getRoleBadge(user.role)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <span className="sr-only">Change role</span>
                <Pencil className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateUserRole(user.id, "Admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateUserRole(user.id, "Editor")}>
                Editor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateUserRole(user.id, "Viewer")}>
                Viewer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Status",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {getStatusBadge(user.status)}
          <Select
            value={user.status}
            onValueChange={(value) => updateUserStatus(user.id, value)}
          >
            <SelectTrigger className="h-6 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    { 
      key: "date", 
      header: "Date Created",
      render: (user: User) => user.date
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/users/${user.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/users/edit/${user.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteUser(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Users", value: stats.total },
    { title: "Active", value: stats.active },
    { title: "Inactive", value: stats.inactive },
    { title: "Pending", value: stats.pending },
    { title: "Admins", value: stats.admin },
    { title: "Editors", value: stats.editor },
    { title: "Viewers", value: stats.viewer },
  ]

  const mobileListItems = filteredUsers.map((user) => ({
    id: user.id,
    title: user.name,
    subtitle: user.email,
    meta: [user.role, user.date],
    createdBy: user.role,
    status: user.status,
    action: () => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/dashboard/users/${user.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => deleteUser(user.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }))

  return (
    <DashboardLayout title="Users Management" wave={true}>
      <MobileSearchBar />

      <div className="hidden lg:grid mb-8 mx-20 grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {statsItems.slice(0, 4).map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="hidden lg:grid mb-8 mx-20 grid-cols-3 gap-4">
        {statsItems.slice(4).map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.slice(0, 4).map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="col-span-2 flex items-center justify-center h-24">
                <Button
                  className={`text-md rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => router.push("/dashboard/users/add")}
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
                  onClick={() => router.push("/dashboard/users/add")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            <div className="hidden md:block">
              <DataTable 
                data={filteredUsers} 
                columns={columns} 
                loading={isLoading}
                emptyMessage="No users found"
              />
            </div>

            <MobileListView items={mobileListItems} loading={isLoading} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}