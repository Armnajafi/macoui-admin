"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { FilterButtons } from "@/components/common/filter-buttons"
import { DataTable, type TableColumn } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useVisitRequests, type VisitRequest } from "@/hooks/use-visit-requests"
import Link from "next/link"

const tabs = ["All Requests", "New", "Approved", "Completed"]
const filterOptions = ["Status", "Visit Type", "Ship", "User"]

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const columns: TableColumn<VisitRequest>[] = [
  {
    key: "id",
    header: "Request ID",
    render: (v: VisitRequest) => `#${v.id}`
  },
  {
    key: "ship",
    header: "Ship",
    render: (v: VisitRequest) => v.ship_name || `Ship #${v.ship}`
  },
  {
    key: "user",
    header: "User",
    render: (v: VisitRequest) => v.user_name || `User #${v.user}`
  },
  {
    key: "visit_type",
    header: "Visit Type",
    render: (v: VisitRequest) => (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        v.visit_type === "onsite" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
      }`}>
        {v.visit_type === "onsite" ? "On-site" : "Virtual"}
      </span>
    )
  },
  {
    key: "preferred_datetime",
    header: "Preferred Date",
    render: (v: VisitRequest) => formatDate(v.preferred_datetime)
  },
  {
    key: "status",
    header: "Status",
    render: (v: VisitRequest) => {
      const statusColors = {
        new: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        completed: "bg-blue-100 text-blue-800"
      }
      const statusText = {
        new: "New",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed"
      }
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
          {statusText[v.status]}
        </span>
      )
    }
  },
  {
    key: "created_at",
    header: "Created",
    render: (v: VisitRequest) => formatDate(v.created_at)
  },
]

export default function VisitRequestsManagementPage() {
  const [activeTab, setActiveTab] = useState("All Requests")
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: "",
    visit_type: "",
    ship: "",
    user: "",
  })
  const { theme } = useTheme()
  const { visitRequests, stats, updateVisitRequest } = useVisitRequests()

  // فیلترینگ بر اساس تب فعال و فیلترهای انتخاب شده
  const filteredRequests = visitRequests.filter((v) => {
    // فیلترینگ بر اساس تب
    if (activeTab === "New" && v.status !== "new") return false
    if (activeTab === "Approved" && v.status !== "approved") return false
    if (activeTab === "Completed" && v.status !== "completed") return false

    // فیلترینگ بر اساس فیلترهای انتخاب شده
    if (filters.status && v.status !== filters.status) return false
    if (filters.visit_type && v.visit_type !== filters.visit_type) return false
    if (filters.ship && !v.ship_name?.toLowerCase().includes(filters.ship.toLowerCase())) return false
    if (filters.user && !v.user_name?.toLowerCase().includes(filters.user.toLowerCase())) return false

    return true
  })

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter)
    setFilterDialogOpen(true)
  }

  const handleFilterApply = () => {
    setFilterDialogOpen(false)
    setActiveFilter(null)
  }

  const handleFilterClear = (filterType: string) => {
    setFilters(prev => ({ ...prev, [filterType]: "" }))
  }

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Requests", value: stats.total },
    { title: "New", value: stats.new },
    { title: "Approved", value: stats.approved },
    { title: "Completed", value: stats.completed },
  ]

  const mobileListItems = filteredRequests.map((v) => ({
    id: v.id,
    title: `${v.ship_name || `Ship #${v.ship}`}`,
    subtitle: `${v.user_name || `User #${v.user}`} • ${v.visit_type === "onsite" ? "On-site" : "Virtual"}`,
    meta: [formatDate(v.preferred_datetime), v.status],
    createdBy: v.user_name || `User #${v.user}`,
    status: v.status,
  }))

  return (
    <DashboardLayout title="Visit Requests Management" wave={true}>
      <MobileSearchBar />

      {/* Desktop Stats Cards */}
      <div className="hidden lg:grid mb-8 mx-20 grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {statsItems.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats Grid */}
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
                  Add Request
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1 className={`text-4xl font-normal tracking-wide ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Visit Requests Management
                </h1>
                <Button
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap flex-shrink-0 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Request
                </Button>
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filterOptions} onFilterClick={handleFilterClick} />

            {/* Active Filters Display */}
            {(filters.status || filters.visit_type || filters.ship || filters.user) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterClear("status")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.visit_type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Visit Type: {filters.visit_type}
                    <button
                      onClick={() => handleFilterClear("visit_type")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.ship && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Ship: {filters.ship}
                    <button
                      onClick={() => handleFilterClear("ship")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.user && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    User: {filters.user}
                    <button
                      onClick={() => handleFilterClear("user")}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable
                data={filteredRequests}
                columns={columns}
                editRoute="/visit-requests/edit"
              />
            </div>

            {/* Mobile List View */}
            <MobileListView items={mobileListItems} editRoute="/visit-requests/edit" />
          </div>
        </Card>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Filter by {activeFilter}
              {(filters.status || filters.visit_type || filters.ship || filters.user) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    if (activeFilter === "Status") handleFilterClear("status")
                    if (activeFilter === "Visit Type") handleFilterClear("visit_type")
                    if (activeFilter === "Ship") handleFilterClear("ship")
                    if (activeFilter === "User") handleFilterClear("user")
                  }}
                >
                  Clear
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {activeFilter === "Status" && (
              <div className="space-y-2">
                <Label htmlFor="status-select">Select Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Visit Type" && (
              <div className="space-y-2">
                <Label htmlFor="visit-type-select">Select Visit Type</Label>
                <Select
                  value={filters.visit_type}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, visit_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Ship" && (
              <div className="space-y-2">
                <Label htmlFor="ship-input">Enter Ship Name</Label>
                <Input
                  id="ship-input"
                  placeholder="e.g., Bulk Carrier ABC..."
                  value={filters.ship}
                  onChange={(e) => setFilters(prev => ({ ...prev, ship: e.target.value }))}
                />
              </div>
            )}

            {activeFilter === "User" && (
              <div className="space-y-2">
                <Label htmlFor="user-input">Enter User Name</Label>
                <Input
                  id="user-input"
                  placeholder="e.g., John Smith..."
                  value={filters.user}
                  onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFilterApply}>
              Apply Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
