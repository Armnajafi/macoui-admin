
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
import { useBrokers, Broker } from "@/hooks/use-brokers"
import Link from "next/link"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export default function BrokerManagementPage() {
  const { theme } = useTheme()
  const { brokers, stats, total, isLoading, isError, deleteBroker } = useBrokers()

  const handleDelete = (broker: Broker) => {
    if (confirm(`آیا از حذف بروکر "${broker.name}" مطمئن هستید؟`)) {
      deleteBroker(broker.id)
    }
  }

  const columns = [
    {
      key: "id" as const,
      header: "شناسه",
      render: (b: Broker) => `#${b.id}`,
    },
    {
      key: "name" as const,
      header: "نام بروکر",
      render: (b: Broker) => <div className="font-medium">{b.name}</div>,
    },
    {
      key: "company" as const,
      header: "شرکت",
      render: (b: Broker) => b.company || "-",
    },
    {
      key: "location" as const,
      header: "مکان",
      render: (b: Broker) => b.location || "-",
    },
    {
      key: "status" as const,
      header: "وضعیت",
      render: (b: Broker) => {
        const map: Record<string, string> = {
          Approved: "bg-green-100 text-green-800",
          Pending: "bg-orange-100 text-orange-800",
          Rejected: "bg-red-100 text-red-800",
        }
        const style = map[b.status] ?? "bg-gray-100 text-gray-800"
        const label = b.status === "Approved" ? "تایید شده" :
                      b.status === "Pending" ? "در انتظار" :
                      "رد شده"

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
            {label}
          </span>
        )
      },
    },
    {
      key: "date" as const,
      header: "تاریخ ثبت",
      render: (b: Broker) => formatDate(b.date),
    },
    // هیچ ستون actions دستی نداریم — DataTable خودش اضافه می‌کنه
  ]

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const mobileListItems = brokers.map((b) => ({
    id: b.id,
    title: b.name,
    subtitle: b.company || "بدون شرکت",
    meta: [b.location, formatDate(b.date)],
    status: b.status,
    // اگر عکس داشتید اضافه کنید، فعلاً null
    coverImage: null,
  }))

  if (isLoading) {
    return (
      <DashboardLayout title="مدیریت بروکرها" wave={true}>
        <div className="flex items-center justify-center h-96 text-xl">
          در حال بارگذاری بروکرها...
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout title="مدیریت بروکرها" wave={true}>
        <div className="flex items-center justify-center h-96 text-red-500">
          بارگذاری بروکرها با خطا مواجه شد
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="مدیریت بروکرها" wave={true}>
      <MobileSearchBar />

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* دکمه افزودن - دسکتاپ */}
        <div className="hidden lg:flex justify-end relative z-10">
          <Button asChild
            className={`text-lg rounded-lg font-medium shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Link href="/dashboard/brokers/add" className="flex items-center">
              <Plus className="h-6 w-6 ml-2" />
              افزودن بروکر
            </Link>
          </Button>
        </div>

        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* موبایل: Stats + دکمه افزودن */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              <StatsCard title="کل بروکرها" value={total} variant="compact" />
              <StatsCard title="در انتظار" value={stats.pending} variant="compact" />
              <StatsCard title="تایید شده" value={stats.approved} variant="compact" />
              <StatsCard title="رد شده" value={stats.rejected} variant="compact" />
              <div className="col-span-2 flex items-center justify-center h-24 mt-4">
                <Button asChild
                  className={`text-md rounded-lg font-medium shadow-md px-6 py-5 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Link href="/dashboard/brokers/add" className="flex items-center">
                    <Plus className="h-5 w-5 ml-2" />
                    افزودن بروکر
                  </Link>
                </Button>
              </div>
            </div>

            {/* دسکتاپ: هدر + Stats */}
            <div className="hidden lg:grid grid-cols-3 gap-6 items-center">
              <div>
                <h1 className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  مدیریت بروکرها
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-4 gap-4">
                <StatsCard title="کل بروکرها" value={total} />
                <StatsCard title="در انتظار" value={stats.pending} />
                <StatsCard title="تایید شده" value={stats.approved} />
                <StatsCard title="رد شده" value={stats.rejected} />
              </div>
            </div>

            {/* جدول دسکتاپ */}
            <div className="hidden md:block overflow-x-auto">
              <DataTable
                data={brokers}
                columns={columns}
                editRoute="/dashboard/brokers/edit" // → /dashboard/brokers/edit/[id]
                onDelete={handleDelete}
              />
            </div>

            {/* لیست موبایل */}
            <div className="md:hidden">
              <MobileListView
                items={mobileListItems}
                onDelete={(item) => {
                  const broker = brokers.find(b => b.id === item.id)
                  if (broker) {
                    if (confirm(`آیا از حذف بروکر "${broker.name}" مطمئن هستید؟`)) {
                      deleteBroker(broker.id)
                    }
                  }
                }}
                editRoute="/dashboard/brokers/edit" // → همین رو می‌فهمه و id رو اضافه می‌کنه
              />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}