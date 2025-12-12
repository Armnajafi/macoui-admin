// app/dashboard/brokers/page.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { StatsCard } from "@/components/common/stats-card"
import { TabNavigation } from "@/components/common/tab-navigation"
import { FilterButtons } from "@/components/common/filter-buttons"
import { DataTable } from "@/components/common/data-table"
import { MobileListView } from "@/components/common/mobile-list-view"
import { useTheme } from "@/contexts/theme-context"
import { useBrokers, Broker } from "@/hooks/use-brokers"
import { BrokerDetailModal } from "@/components/ui/broker-detail-modal" // درست!

const isAdmin = true
const authLoading = false

const tabs = ["All Brokers", "Pending Approval", "Verified Brokers"]
const filters = ["Status", "Company", "Location"]

export default function BrokerManagementPage() {
  const [activeTab, setActiveTab] = useState("All Brokers")
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const { theme } = useTheme()
  const { brokers, stats, total, isLoading, deleteBroker, updateBrokerStatus } = useBrokers()

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const handleAction = (broker: any) => {  // any یا Broker — مهم نیست، کار می‌کنه
    setSelectedBroker(broker)
    setModalOpen(true)
  }

  const columns = [
    { key: "id", header: "شناسه" },
    { key: "name", header: "نام" },
    { key: "company", header: "شرکت" },
    { key: "location", header: "مکان" },
    { key: "status", header: "وضعیت" },
    { key: "date", header: "تاریخ" },
  ]

  const mobileItems = brokers.map(b => ({
    id: b.id,
    title: b.name,
    subtitle: b.company,
    meta: [b.location, b.date],
    status: b.status,
  }))

  if (authLoading) return <div>در حال بارگذاری...</div>
  if (!isAdmin) return <div className="text-center text-red-500 text-2xl mt-20">دسترسی ممنوع</div>

  return (
    <DashboardLayout title="مدیریت بروکرها" wave={true}>
      <MobileSearchBar />

      {/* Stats */}
      <div className="hidden lg:grid grid-cols-4 gap-4 mt-6 mb-8 mx-20">
        <StatsCard title="کل بروکرها" value={stats.total} />
        <StatsCard title="در انتظار" value={stats.pending} />
        <StatsCard title="تایید شده" value={stats.approved} />
        <StatsCard title="رد شده" value={stats.rejected} />
      </div>

      <Card className={`${cardBg} border-0 shadow-md`}>
        <div className="md:mx-10 mx-4 py-6">

          {/* موبایل stats */}
          <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
            <StatsCard title="کل" value={stats.total} variant="compact" />
            <StatsCard title="در انتظار" value={stats.pending} variant="compact" />
            <StatsCard title="تایید شده" value={stats.approved} variant="compact" />
            <StatsCard title="رد شده" value={stats.rejected} variant="compact" />
          </div>

          <div className="hidden lg:flex justify-between items-center px-6 pt-6">
            <h1 className="text-4xl font-normal">مدیریت بروکرها</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 ml-2" /> افزودن بروکر
            </Button>
          </div>

          <div className="px-6 mt-8">
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />
          </div>

          <div className=" md:block mt-6">
            <DataTable data={brokers} columns={columns} onAction={handleAction} />
          </div>

          {/* موبایل */}
          <div className="md:hidden mt-6">
            <MobileListView items={mobileItems} onAction={handleAction} />
          </div>

          {/* Pagination */}
          {total > brokers.length && (
            <div className="flex justify-center items-center gap-4 mt-8 pb-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronRight className="h-4 w-4" />
                قبلی
              </Button>
              <span className="text-sm">
                صفحه {page} از {Math.ceil(total / 10)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={brokers.length < 10}
                onClick={() => setPage(p => p + 1)}
              >
                بعدی
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}

        </div>
      </Card>

      <BrokerDetailModal
        broker={selectedBroker}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdateStatus={updateBrokerStatus}
        onDelete={deleteBroker}
      />
    </DashboardLayout>
  )
}