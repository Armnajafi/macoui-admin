"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
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
import type { Article } from "@/hooks/use-articles"

const tabs = ["All Articles", "Pending Approval", "Published Articles"]
const filters = ["Category", "Author", "Date Range"]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ArticleManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("All Articles")
  const { theme } = useTheme()
  const { articles, stats, deleteArticle } = useArticles()

  const handleDelete = (article: Article) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      deleteArticle(article.id)
    }
  }

  const columns = [
    {
      key: "thumbnail" as const,
      header: "Thumbnail",
      render: (a: Article) => (
        <div className="relative w-24 h-16 rounded-md overflow-hidden">
          <Image
            src={a.thumbnail || "/placeholder.svg"}
            alt={a.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title" as const,
      header: "Title",
      render: (a: Article) => <div className="font-medium">{a.title}</div>,
    },
    {
      key: "category" as const,
      header: "Category",
    },
    {
      key: "author" as const,
      header: "Author",
    },
    {
      key: "status" as const,
      header: "Status",
      render: (a: Article) => {
        const map: Record<string, string> = {
          Published: "bg-green-100 text-green-800",
          Draft: "bg-yellow-100 text-yellow-800",
          Pending: "bg-orange-100 text-orange-800",
        }
        const style = map[a.status] ?? "bg-gray-100 text-gray-800"
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
            {a.status}
          </span>
        )
      },
    },
    {
      key: "date" as const,
      header: "Date Created",
      render: (a: Article) => formatDate(a.date),
    },
  ]

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const statsItems = [
    { title: "Total Articles", value: stats.total },
    { title: "Pending Articles", value: stats.pending },
    { title: "Published Articles", value: stats.published },
  ]

  const mobileListItems = articles.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.category,
    meta: [formatDate(a.date), a.author],
    createdBy: a.author,
    status: a.status,
    thumbnail: a.thumbnail,
  }))

  return (
    <DashboardLayout title="Article & News Management" wave={true}>
      <MobileSearchBar />

      {/* Desktop Add Button */}
      <div className="hidden lg:flex justify-end mb-10 relative z-10">
        <Button asChild
          className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
            theme === "dark" ? "bg-[#0F2A48] hover:bg-[#34495E] text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Link href="/articles/add" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats Grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.slice(0, 2).map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="flex items-center justify-center h-24 col-span-2">
                <Button asChild
                  className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Link href="/articles/add" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Article
                  </Link>
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
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsItems.map((s) => (
                  <StatsCard key={s.title} title={s.title} value={s.value} />
                ))}
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <DataTable 
                data={articles} 
                columns={columns} 
                editRoute="/articles/edit"
                onDelete={handleDelete}
              />
            </div>

            {/* Mobile List */}
            <div className="md:hidden">
              <MobileListView 
                items={mobileListItems} 
                onDelete={(item) => {
                  const article = articles.find(a => a.id === item.id)
                  if (article) {
                    handleDelete(article)
                  }
                }}
                editRoute="/articles/edit"
              />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}