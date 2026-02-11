"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { useTradingProducts, type TradingProduct } from "@/hooks/use-trading-products"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function TradingProductsPage() {
  const { theme } = useTheme()
  const { products, stats, count, isLoading, isError, deleteProduct } = useTradingProducts()

  const columns = [
    { key: "id" as const, header: "ID", render: (p: TradingProduct) => `#${p.id}` },
    { key: "name" as const, header: "Product", render: (p: TradingProduct) => <span className="font-medium">{p.name}</span> },
    { key: "sku" as const, header: "SKU" },
    { key: "category" as const, header: "Category", render: (p: TradingProduct) => p.category?.name ?? "-" },
    { key: "seller" as const, header: "Seller", render: (p: TradingProduct) => p.seller?.full_name ?? "-" },
    { key: "price_estimate" as const, header: "Price", render: (p: TradingProduct) => `${p.currency} ${p.price_estimate}` },
    { key: "status" as const, header: "Status" },
    { key: "quotation_count" as const, header: "Quotations" },
    { key: "created_at" as const, header: "Created", render: (p: TradingProduct) => formatDate(p.created_at) },
  ]

  if (isLoading) {
    return <DashboardLayout title="Trading Products" wave><div className="h-96 flex items-center justify-center">Loading products...</div></DashboardLayout>
  }

  if (isError) {
    return <DashboardLayout title="Trading Products" wave><div className="h-96 flex items-center justify-center text-red-500">Failed to load products</div></DashboardLayout>
  }

  return (
    <DashboardLayout title="Trading Products" wave>
      <MobileSearchBar />
      <div className="hidden lg:flex justify-end mb-6">
        <Button asChild className={theme === "dark" ? "bg-[#0F2A48] hover:bg-[#34495E]" : "bg-blue-600 hover:bg-blue-700"}>
          <Link href="/trading/products/add"><Plus className="w-5 h-5 mr-2" />Add Product</Link>
        </Button>
      </div>

      <Card className={`border-0 shadow-md ${theme === "dark" ? "bg-[#0F2A48]" : "bg-white"}`}>
        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatsCard title="Total" value={count} variant="compact" />
            <StatsCard title="Available" value={stats.available} variant="compact" />
            <StatsCard title="Unavailable" value={stats.unavailable} variant="compact" />
            <StatsCard title="Discontinued" value={stats.discontinued} variant="compact" />
          </div>

          <div className="md:hidden">
            <MobileListView
              items={products.map((p) => ({
                id: p.id,
                title: p.name,
                subtitle: p.sku,
                meta: [p.category?.name ?? "No category", `${p.currency} ${p.price_estimate}`],
                createdBy: p.seller?.full_name ?? "Admin",
                status: p.status,
              }))}
              onDelete={(item) => deleteProduct(Number(item.id))}
              editRoute="/trading/products/edit"
            />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <DataTable data={products} columns={columns} editRoute="/trading/products/edit" onDelete={(p) => deleteProduct(p.id)} />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
