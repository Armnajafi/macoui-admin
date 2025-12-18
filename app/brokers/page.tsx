"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useBrokers } from "@/hooks/use-brokers"
import type { Broker } from "@/lib/types"

const tabs = ["All Brokers", "Pending Approval", "Verified Brokers"]
const filters = ["Status", "Company", "Location"]

const columns: TableColumn<Broker>[] = [
  { key: "id", header: "Broker ID" },
  { key: "name", header: "Broker Name" },
  { key: "company", header: "Company" },
  { key: "location", header: "Location" },
  { key: "status", header: "Status" },
  { key: "date", header: "Date Created" },
]

export default function BrokerManagementPage() {
  const [activeTab, setActiveTab] = useState("all brokers")
  const { theme } = useTheme()
  const { brokers, stats } = useBrokers()

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Brokers", value: stats.total },
    { title: "Pending Brokers", value: stats.pending },
  ]

  const mobileListItems = brokers.map((b) => ({
    id: b.id,
    title: b.name,
    subtitle: b.id,
    meta: [b.company, b.location, b.date],
    createdBy: b.company,
    status: b.status,
    // اگر عکس داشتید اضافه کنید، فعلاً null
    coverImage: null,
  }))

  return (
    <DashboardLayout title="Broker Management" wave={true}>
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
                  Add Broker
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Broker Management
                </h1>
                <Button
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap flex-shrink-0 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Broker
                </Button>
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable data={brokers} columns={columns} />
            </div>

            {/* Mobile List View */}
            <MobileListView items={mobileListItems} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
