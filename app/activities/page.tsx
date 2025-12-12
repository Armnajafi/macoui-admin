"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MobileSearchBar } from "@/components/common/mobile-search-bar";
import { StatsCard } from "@/components/common/stats-card";
import { DataTable } from "@/components/common/data-table";
import { MobileListView } from "@/components/common/mobile-list-view";
import { useTheme } from "@/contexts/theme-context";
import { useActivities } from "@/hooks/use-activities";
import Link from "next/link";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function ActivityConfigurationPage() {
  const { theme } = useTheme();
  const { activities, stats, count, isLoading, isError } = useActivities();
  // const { activities, stats, count, isLoading, isError } = useActivities();

  // فقط برای دیباگ — اینو موقتاً بذار ببینیم چی میاد
  console.log("useActivities data:", { activities, stats, count, isLoading, isError });
  const cardBg =
    theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white";

  const columns = [
    {
      key: "id" as const,
      header: "Activity ID",
      render: (a: any) => `#${a.id}`,
    },
    {
      key: "name" as const,
      header: "Activity Name",
      render: (a: any) => <div className="font-medium">{a.name}</div>,
    },
    {
      key: "type" as const,
      header: "Type",
      render: (a: any) => a.type || "-",
    },
    {
      key: "status" as const,
      header: "Status",
      render: (a: any) => {
        const isActive = a.status === "Active";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {a.status}
          </span>
        );
      },
    },
    {
      key: "date" as const,
      header: "Last Updated",
      render: (a: any) => formatDate(a.date),
    },
  ];

  const mobileListItems = activities.map((a) => ({
    id: a.id,
    title: a.name,
    subtitle: a.id,
    meta: [a.type, a.date],
    status: a.status,
  }));

  if (isLoading) {
    return (
      <DashboardLayout title="Activity Configuration" wave={true}>
        <div className="flex items-center justify-center h-96 text-xl">
          Loading activities...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Activity Configuration" wave={true}>
        <div className="flex items-center justify-center h-96 text-red-500">
          Failed to load activities
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Activity Configuration" wave={true}>
      <MobileSearchBar />

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Desktop Add Button */}
        {/* <div className="hidden lg:flex justify-end relative z-10">
          <Button asChild
            className={`text-lg rounded-lg font-medium shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Link href="/activities/add" className="flex items-center">
              <Plus className="h-6 w-6 mr-2" />
              Add Activity
            </Link>
          </Button>
        </div> */}

        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats + Add Button */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              <StatsCard title="Total Activities" value={count} variant="compact" />
              <StatsCard title="Active" value={stats.active} variant="compact" />
              <StatsCard title="Inactive" value={stats.inactive} variant="compact" />
              <div className="flex items-center justify-center h-24">
                {/* <Button asChild
                  className={`text-md rounded-lg font-medium shadow-md px-6 py-5 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Link href="/activities/add" className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Activity
                  </Link>
                </Button> */}
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
                  Activity Configuration
                </h1>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="Total Activities" value={count} />
                <StatsCard title="Active" value={stats.active} />
                <StatsCard title="Inactive" value={stats.inactive} />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <DataTable
                data={activities}
                columns={columns}
                editRoute="/activities"
                
                // No edit/delete — فقط نمایش
              />
            </div>

            {/* Mobile List */}
            <div className="md:hidden">
              <MobileListView editRoute="#"
                items={mobileListItems}
                // فقط نمایش — بدون اکشن
              />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}