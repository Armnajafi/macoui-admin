"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { StatsCard } from "@/components/common/stats-card"
import { useTradingCustomOrders, type TradingCustomOrder } from "@/hooks/use-trading-custom-orders"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function TradingCustomOrdersPage() {
  const { theme } = useTheme()
  const { customOrders, stats, count, isLoading, isError } = useTradingCustomOrders()

  const columns = [
    { key: "id" as const, header: "ID", render: (item: TradingCustomOrder) => `#${item.id}` },
    { key: "user" as const, header: "User", render: (item: TradingCustomOrder) => item.user.full_name },
    { key: "category" as const, header: "Category", render: (item: TradingCustomOrder) => item.category.name },
    { key: "target_price" as const, header: "Target", render: (item: TradingCustomOrder) => `${item.currency} ${item.target_price}` },
    { key: "matched_product" as const, header: "Matched product", render: (item: TradingCustomOrder) => item.matched_product?.name ?? "-" },
    { key: "status" as const, header: "Status" },
    { key: "created_at" as const, header: "Created", render: (item: TradingCustomOrder) => formatDate(item.created_at) },
  ]

  if (isLoading) return <DashboardLayout title="Custom Orders" wave><div className="h-96 flex items-center justify-center">Loading custom orders...</div></DashboardLayout>
  if (isError) return <DashboardLayout title="Custom Orders" wave><div className="h-96 flex items-center justify-center text-red-500">Failed to load custom orders</div></DashboardLayout>

  return (
    <DashboardLayout title="Custom Orders" wave>
      <Card className={`border-0 shadow-md ${theme === "dark" ? "bg-[#0F2A48]" : "bg-white"}`}>
        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatsCard title="Total" value={count} variant="compact" />
            <StatsCard title="New" value={stats.new} variant="compact" />
            <StatsCard title="In review" value={stats.in_review} variant="compact" />
            <StatsCard title="Matched" value={stats.matched} variant="compact" />
            <StatsCard title="Closed" value={stats.closed} variant="compact" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <DataTable data={customOrders} columns={columns} editRoute="/trading/custom-orders/edit" />
          </div>

          <div className="md:hidden">
            <MobileListView
              items={customOrders.map((item) => ({
                id: item.id,
                title: item.category.name,
                subtitle: item.user.full_name,
                meta: [item.matched_product?.name ?? "No matched product", `${item.currency} ${item.target_price}`],
                status: item.status,
              }))}
              editRoute="/trading/custom-orders/edit"
            />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
