"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { FilterButtons } from "@/components/common/filter-buttons"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useArticles } from "@/hooks/use-articles"
import { StatusBadge } from "@/components/common/status-badge"

const tabs = ["All Articles", "Pending Approval", "Published Articles"]
const filters = ["Category", "Author", "Date Range"]

export default function ArticleManagementPage() {
  const [activeTab, setActiveTab] = useState("all articles")
  const { theme } = useTheme()
  const { articles, stats } = useArticles()

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Articles", value: stats.total },
    { title: "Pending Articles", value: stats.pending },
  ]

  return (
    <DashboardLayout title="Article & News Management" wave={true}>
      <MobileSearchBar />

      {/* Desktop Add Button */}
      <div className="hidden lg:flex justify-end mb-10 relative z-10">
        <Button
          className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
            theme === "dark" ? "bg-[#0F2A48] hover:bg-[#34495E] text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats Grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="flex items-center justify-center h-24 col-span-2">
                <Button
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-1">
                <h1
                  className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Article & News Management
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {statsItems.map((s) => (
                  <StatsCard key={s.title} title={s.title} value={s.value} />
                ))}
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Table Section */}
            <div
              className={`md:border rounded-xl overflow-hidden ${
                theme === "dark" ? "border-white/20" : "border-gray-200"
              }`}
            >
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme === "dark" ? "border-slate-800" : "border-gray-200"}`}>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Thumbnail
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Title
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Category
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Author
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-6 py-5 text-left text-base font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-700"
                          }`}
                        >
                          Date Created
                        </th>
                        <th className="px-6 py-5 text-left text-base font-medium"></th>
                      </tr>
                    </thead>

                    <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-100"}`}>
                      {articles.map((article) => (
                        <tr
                          key={article.id}
                          className={`group transition-colors ${
                            theme === "dark" ? "hover:bg-[#151E32]" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-5">
                            <div className="relative w-24 h-16 rounded-md overflow-hidden">
                              <Image
                                src={article.thumbnail || "/placeholder.svg"}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td
                            className={`px-6 py-5 text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {article.title}
                          </td>
                          <td
                            className={`px-6 py-5 text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {article.category}
                          </td>
                          <td
                            className={`px-6 py-5 text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {article.author}
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={article.status} />
                          </td>
                          <td
                            className={`px-6 py-5 text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {article.date}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              className={`hover:opacity-75 ${theme === "dark" ? "text-white" : "text-slate-600"}`}
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile ListView */}
                <div className="md:hidden space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className={`p-4 rounded-xl border shadow-sm flex gap-4 ${
                        theme === "dark" ? "bg-[#0F2A48] border-slate-800" : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={article.thumbnail || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Top Row: Title and Menu */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-base font-semibold truncate ${
                                theme === "dark" ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {article.title}
                            </h3>
                            <div
                              className={`flex items-center text-xs mt-1 gap-2 ${
                                theme === "dark" ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              <span>{article.category}</span>
                              <span>/</span>
                              <span>{article.date}</span>
                            </div>
                          </div>
                          <button
                            className={`ml-2 flex-shrink-0 ${
                              theme === "dark"
                                ? "text-slate-400 hover:text-white"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Bottom Row: Created By and Status */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm">
                            <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>Created by </span>
                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                              {article.author}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            <StatusBadge status={article.status} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
