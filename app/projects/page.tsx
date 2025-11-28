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
import { useProjects } from "@/hooks/use-projects"
import type { Project } from "@/lib/types"

const tabs = ["All Projects", "Pending Approval", "Verified Projects"]
const filters = ["Status", "Activity", "Date Range"]

const columns: TableColumn<Project>[] = [
  { key: "id", header: "Project ID" },
  { key: "title", header: "Project Title" },
  { key: "activity", header: "Activity" },
  { key: "broker", header: "Created by (Broker)" },
  { key: "location", header: "Location" },
  { key: "status", header: "Status" },
  { key: "date", header: "Date Created" },
]

export default function ProjectManagementPage() {
  const [activeTab, setActiveTab] = useState("all projects")
  const { theme } = useTheme()
  const { projects, stats } = useProjects()

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Projects", value: stats.total },
    { title: "Pending Projects", value: stats.pending },
    { title: "Approved Projects", value: stats.approved },
  ]

  const mobileListItems = projects.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.id,
    meta: [p.activity, p.location, p.date],
    createdBy: p.broker,
    status: p.status,
  }))

  return (
    <DashboardLayout title="Project Management" wave={true}>
      <MobileSearchBar />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {/* Desktop Add Button */}
        <div className="hidden lg:flex justify-end mb-2 relative z-10">
          <Button
            className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

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
                  Add Project
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-1">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Project Management
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsItems.map((s) => (
                  <StatsCard key={s.title} title={s.title} value={s.value} />
                ))}
              </div>
            </div>

            {/* <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> */}
            {/* <FilterButtons filters={filters} /> */}

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable data={projects} columns={columns} />
            </div>

            {/* Mobile List View */}
            <MobileListView items={mobileListItems} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
