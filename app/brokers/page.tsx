"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
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
import { useBrokers, type Broker } from "@/hooks/use-brokers"

const tabs = ["All Ships", "For Sale", "Sold Ships"]
const filterOptions = ["Status", "Ship Type", "Location", "Seller"]

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const columns: TableColumn<Broker>[] = [
  {
    key: "id",
    header: "Ship ID",
    render: (b: Broker) => `#${b.id}`
  },
  {
    key: "name",
    header: "Ship Name",
    render: (b: Broker) => <div className="font-medium">{b.name}</div>
  },
  {
    key: "ship_type_display",
    header: "Ship Type",
    render: (b: Broker) => b.ship_type_display
  },
  {
    key: "seller_name",
    header: "Seller",
    render: (b: Broker) => b.seller_name
  },
  {
    key: "location_country_name",
    header: "Country",
    render: (b: Broker) => b.location_country_name
  },
  {
    key: "price",
    header: "Price",
    render: (b: Broker) => `${b.price} ${b.currency}`
  },
  {
    key: "status",
    header: "Status",
    render: (b: Broker) => {
      const style = b.status === "for_sale"
        ? "bg-green-100 text-green-800"
        : b.status === "sold"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800"
      return <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>{b.status}</span>
    }
  },
  {
    key: "created_at",
    header: "Date Created",
    render: (b: Broker) => formatDate(b.created_at)
  },
]

export default function BrokerManagementPage() {
  const [activeTab, setActiveTab] = useState("All Ships")
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: "",
    ship_type: "",
    location: "",
    seller: "",
  })
  const { theme } = useTheme()
  const { brokers, stats, total, nextPage, previousPage, goToNextPage, goToPreviousPage, isLoading } = useBrokers()

  // فیلترینگ بر اساس تب فعال و فیلترهای انتخاب شده
  const filteredBrokers = brokers.filter((b) => {
    // فیلترینگ بر اساس تب
    if (activeTab === "For Sale" && b.status !== "for_sale") return false
    if (activeTab === "Sold Ships" && b.status !== "sold") return false

    // فیلترینگ بر اساس فیلترهای انتخاب شده
    if (filters.status && b.status !== filters.status) return false
    if (filters.ship_type && b.ship_type !== filters.ship_type) return false
    if (filters.location && !b.location_country_name.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.seller && !b.seller_name.toLowerCase().includes(filters.seller.toLowerCase())) return false

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
    { title: "Total Ships", value: stats.total },
    { title: "For Sale", value: stats.pending },
    { title: "Sold Ships", value: stats.approved },
  ]

  const mobileListItems = filteredBrokers.map((b) => ({
    id: b.id,
    title: b.name,
    subtitle: `${b.ship_type_display} - ${b.location_country_name}`,
    meta: [b.seller_name, formatDate(b.created_at)],
    createdBy: b.seller_name,
    status: b.status_display,
  }))

  return (
    <DashboardLayout title="Ship Management" wave={true}>
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
                  Add Ship
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Ship Management
                </h1>
                <Button
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap shrink-0 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ship
                </Button>
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filterOptions} onFilterClick={handleFilterClick} />

            {/* Active Filters Display */}
            {(filters.status || filters.ship_type || filters.location || filters.seller) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Status: {filters.status === "for_sale" ? "For Sale" : filters.status === "sold" ? "Sold" : filters.status}
                    <button
                      onClick={() => handleFilterClear("status")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.ship_type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Ship Type: {filters.ship_type}
                    <button
                      onClick={() => handleFilterClear("ship_type")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Location: {filters.location}
                    <button
                      onClick={() => handleFilterClear("location")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.seller && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Seller: {filters.seller}
                    <button
                      onClick={() => handleFilterClear("seller")}
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
                data={filteredBrokers}
                columns={columns}
                pagination={{
                  totalCount: total,
                  nextPage,
                  previousPage,
                  onNextPage: goToNextPage,
                  onPreviousPage: goToPreviousPage,
                  isLoading,
                }}
              />
            </div>

            {/* Mobile List View */}
            <MobileListView items={mobileListItems} />
          </div>
        </Card>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Filter by {activeFilter}
              {(filters.status || filters.ship_type || filters.location || filters.seller) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    if (activeFilter === "Status") handleFilterClear("status")
                    if (activeFilter === "Ship Type") handleFilterClear("ship_type")
                    if (activeFilter === "Location") handleFilterClear("location")
                    if (activeFilter === "Seller") handleFilterClear("seller")
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
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Ship Type" && (
              <div className="space-y-2">
                <Label htmlFor="ship-type-select">Select Ship Type</Label>
                <Select
                  value={filters.ship_type}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ship_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cargo">Cargo</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="bulk">Bulk Carrier</SelectItem>
                    <SelectItem value="container">Container Ship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Location" && (
              <div className="space-y-2">
                <Label htmlFor="location-input">Enter Location/Country</Label>
                <Input
                  id="location-input"
                  placeholder="e.g., Iran, Singapore..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            )}

            {activeFilter === "Seller" && (
              <div className="space-y-2">
                <Label htmlFor="seller-input">Enter Seller Name</Label>
                <Input
                  id="seller-input"
                  placeholder="e.g., Amir Najafi..."
                  value={filters.seller}
                  onChange={(e) => setFilters(prev => ({ ...prev, seller: e.target.value }))}
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
