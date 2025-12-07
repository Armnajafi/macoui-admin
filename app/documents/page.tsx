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
import { useDocuments } from "@/hooks/use-documents"
import type { Document } from "@/lib/types"
import Link from "next/link"


const tabs = ["All Documents", "Pending Approval", "Approved Documents"]
const filters = ["Category", "Author", "Date Range"]

const columns: TableColumn<Document>[] = [
  { key: "id", header: "Document ID" },
  { key: "title", header: "Title" },
  { key: "category", header: "Category" },
  { key: "author", header: "Author" },
  { key: "status", header: "Status" },
  { key: "date", header: "Date Created" },
]

export default function DocumentManagementPage() {
  const [activeTab, setActiveTab] = useState("all documents")
  const { theme } = useTheme()
  const { documents, stats } = useDocuments()

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Documents", value: stats.total },
    { title: "Pending Documents", value: stats.pending },
    { title: "Approved Documents", value: stats.approved },
  ]

  const mobileListItems = documents.map((d) => ({
    id: d.id,
    title: d.title,
    subtitle: d.id,
    meta: [d.category, d.date],
    createdBy: d.author,
    status: d.status,
  }))

  return (
    <DashboardLayout title="Document Management" wave={true}>
      <MobileSearchBar />

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
                asChild
                className={`text-md rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
                  theme === "dark"
                    ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Link href="/documents/add" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Link>
              </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Document Management
                </h1>
                <Button
                asChild
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap flex-shrink-0 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                <Link href="/documents/add" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Link>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {statsItems.map((s) => (
                  <StatsCard key={s.title} title={s.title} value={s.value} />
                ))}
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable data={documents} columns={columns} />
            </div>

            {/* Mobile List View */}
            <MobileListView items={mobileListItems} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
