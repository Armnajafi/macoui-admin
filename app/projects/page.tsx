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
import { useProjects } from "@/hooks/use-projects"
import type { Project } from "@/hooks/use-projects"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const columns = [
  {
    key: "id" as const,
    header: "Project ID",
    render: (p: Project) => `#${p.id}`,
  },
  {
    key: "title" as const,
    header: "Project Title",
    render: (p: Project) => <div className="font-medium">{p.title}</div>,
  },
  {
    key: "country" as const,
    header: "Country",
    render: (p: Project) => p.country?.name ?? "-",
  },
  {
    key: "created_by" as const,
    header: "Created By",
    render: (p: Project) => p.created_by.split("@")[0],
  },
  {
    key: "status" as const,
    header: "Status",
    render: (p: Project) => {
      const map: Record<string, string> = {
        Published: "bg-green-100 text-green-800",
        Draft: "bg-yellow-100 text-yellow-800",
        Pending: "bg-orange-100 text-orange-800",
      }
      const style = map[p.status] ?? "bg-gray-100 text-gray-800"
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
          {p.status}
        </span>
      )
    },
  },
  {
    key: "created_at" as const,
    header: "Date Created",
    render: (p: Project) => formatDate(p.created_at),
  },
]

export default function ProjectManagementPage() {
  const { theme } = useTheme()
  const { projects, stats, count, isLoading, isError } = useProjects()

  const cardBg =
    theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const mobileListItems = projects.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.country?.name ?? "No country",
    meta: [formatDate(p.created_at), p.status],
    createdBy: p.created_by.split("@")[0],
    status: p.status,
    coverImage: p.cover_image
      ? `http://admin.tailwindrose.com${p.cover_image}`
      : null,
  }))

  if (isLoading) {
    return (
      <DashboardLayout title="Project Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-xl">
          Loading projects...
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout title="Project Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-red-500">
          Failed to load projects
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Project Management" wave={true}>
      <MobileSearchBar />

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Desktop Add Button */}
        <div className="hidden lg:flex justify-end relative z-10">
          <Button
            className={`text-lg rounded-lg font-medium shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-6 w-6 mr-2" />
            Add Project
          </Button>
        </div>

        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats + Add Button */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              <StatsCard title="Total Projects" value={count} variant="compact" />
              <StatsCard title="Published" value={stats.published} variant="compact" />
              <StatsCard title="Draft" value={stats.draft} variant="compact" />
              <div className="flex items-center justify-center h-24">
                <Button
                  className={`text-md rounded-lg font-medium shadow-md px-6 py-5 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Project
                </Button>
              </div>
            </div>

            {/* Desktop Header + Stats */}
            <div className="hidden lg:grid grid-cols-3 gap-6 items-center">
              <div>
                <h1
                  className={`text-4xl font-normal tracking-wide ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Project Management
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="Total Projects" value={count} />
                <StatsCard title="Published" value={stats.published} />
                <StatsCard title="Draft" value={stats.draft} />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <DataTable data={projects} columns={columns} />
            </div>

            {/* Mobile List */}
            <div className="md:hidden">
              <MobileListView items={mobileListItems} />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}