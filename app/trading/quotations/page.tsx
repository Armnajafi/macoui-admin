"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { StatsCard } from "@/components/common/stats-card"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { useTradingQuotations, type TradingQuotation } from "@/hooks/use-trading-quotations"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function TradingQuotationsPage() {
  const { theme } = useTheme()
  const { quotations, stats, count, isLoading, isError } = useTradingQuotations()

  const columns = [
    { key: "id" as const, header: "ID", render: (q: TradingQuotation) => `#${q.id}` },
    { key: "product" as const, header: "Product", render: (q: TradingQuotation) => q.product.name },
    { key: "user" as const, header: "User", render: (q: TradingQuotation) => q.user.full_name },
    { key: "desired_qty" as const, header: "Qty" },
    { key: "quoted_price" as const, header: "Quoted price", render: (q: TradingQuotation) => (q.quoted_price ? `${q.currency} ${q.quoted_price}` : "-") },
    { key: "status" as const, header: "Status" },
    { key: "created_at" as const, header: "Created", render: (q: TradingQuotation) => formatDate(q.created_at) },
  ]

  if (isLoading) return <DashboardLayout title="Quotation Requests" wave><div className="h-96 flex items-center justify-center">Loading quotation requests...</div></DashboardLayout>
  if (isError) return <DashboardLayout title="Quotation Requests" wave><div className="h-96 flex items-center justify-center text-red-500">Failed to load quotation requests</div></DashboardLayout>

  return (
    <DashboardLayout title="Quotation Requests" wave>
      <Card className={`border-0 shadow-md ${theme === "dark" ? "bg-[#0F2A48]" : "bg-white"}`}>
        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatsCard title="Total" value={count} variant="compact" />
            <StatsCard title="New" value={stats.new} variant="compact" />
            <StatsCard title="In review" value={stats.in_review} variant="compact" />
            <StatsCard title="Quoted" value={stats.quoted} variant="compact" />
            <StatsCard title="Closed" value={stats.closed} variant="compact" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <DataTable data={quotations} columns={columns} editRoute="/trading/quotations/edit" />
          </div>

          <div className="md:hidden">
            <MobileListView
              items={quotations.map((q) => ({
                id: q.id,
                title: q.product.name,
                subtitle: q.user.full_name,
                meta: [`Qty ${q.desired_qty}`, q.quoted_price ? `${q.currency} ${q.quoted_price}` : "No quote"],
                status: q.status,
              }))}
              editRoute="/trading/quotations/edit"
            />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
