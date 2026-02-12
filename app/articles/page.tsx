"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useArticles, type Article } from "@/hooks/use-articles"

const tabs = ["all", "published", "draft"]

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ArticleManagementPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { theme } = useTheme()
  const { articles, stats, count, nextPage, previousPage, goToNextPage, goToPreviousPage, deleteArticle, isLoading } = useArticles()

  const filteredArticles = useMemo(() => {
    if (activeTab === "published") return articles.filter((a) => a.is_published)
    if (activeTab === "draft") return articles.filter((a) => !a.is_published)
    return articles
  }, [activeTab, articles])

  const handleDelete = async (article: Article) => {
    if (!confirm(`Are you sure you want to delete "${article.title}"?`)) return
    const result = await deleteArticle(article.id)
    if (!result.success) {
      alert(result.message)
    }
  }

  const columns = [
    {
      key: "title" as const,
      header: "Title",
      render: (a: Article) => <div className="font-medium">{a.title}</div>,
    },
    { key: "category" as const, header: "Category" },
    { key: "author" as const, header: "Author" },
    {
      key: "status" as const,
      header: "Status",
      render: (a: Article) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            a.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {a.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "published_at" as const,
      header: "Date",
      render: (a: Article) => formatDate(a.published_at || a.updated_at),
    },
  ]

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const mobileListItems = filteredArticles.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.category,
    meta: [formatDate(a.published_at || a.updated_at), a.lang],
    createdBy: a.author,
    status: a.is_published ? "Published" : "Draft",
  }))

  return (
    <DashboardLayout title="Article & News Management" wave={true}>
      <MobileSearchBar />

      <div className="hidden lg:flex justify-end mb-10 relative z-10">
        <Button asChild className="text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/articles/add" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-1">
                <h1 className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  Article & News Management
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="Total Articles" value={stats.total} />
                <StatsCard title="Published Articles" value={stats.published} />
                <StatsCard title="Draft Articles" value={stats.draft} />
              </div>
            </div>

            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {isLoading ? <p className="py-8 text-sm text-gray-500">Loading articles...</p> : null}

            <div className="hidden md:block overflow-x-auto">
              <DataTable
                data={filteredArticles}
                columns={columns}
                editRoute="/articles/edit"
                onDelete={handleDelete}
                pagination={{
                  totalCount: count,
                  nextPage,
                  previousPage,
                  onNextPage: goToNextPage,
                  onPreviousPage: goToPreviousPage,
                  isLoading,
                }}
              />
            </div>

            <div className="md:hidden">
              <MobileListView
                items={mobileListItems}
                onDelete={(item) => {
                  const article = filteredArticles.find((a) => a.id === item.id)
                  if (article) handleDelete(article)
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
