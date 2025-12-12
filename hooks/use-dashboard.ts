"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { DashboardStats, ActivityItem } from "@/lib/types"

// این نوع‌ها رو هم اگر هنوز نداری، حتماً توی types بساز
// یا اینجا مستقیم استفاده کن

interface ApiResponse {
  summary: {
    active_projects: number
    pending_projects: number
    brokers: number
    new_users: number
  }
  latest_activities: Array<{
    type: "project" | "article" | "broker" | string
    title: string
    date: string
    user?: string
    author?: string
  }>
  pending_items: {
    projects_to_verify: number
    brokers_to_verify: number
  }
}

// داده‌های موک قبلی (برای وقتی که API در دسترس نیست)
const mockData = {
  stats: {
    activeProjects: 0,
    pendingProjects: 0,
    brokers: 0,
    newUsers: 0,
  },
  activities: [

  ],
  traffic: [
    { day: "Mon", visits: 0 },
    { day: "Tue", visits: 0 },
    { day: "Wed", visits: 0 },
    { day: "Thu", visits: 0 },
    { day: "Fri", visits: 0 },
    { day: "Sat", visits: 0 },
    { day: "Sun", visits: 0 },
  ],
  pendingItems: {
    projectsToVerify: 0,
    brokersToVerify: 0,
  },
}

// تابع تبدیل نوع فعالیت به آیکون
const getIconFromType = (type: string) => {
  switch (type) {
    case "project":
      return "Ship"
    case "article":
      return "FileCheck"
    case "broker":
      return "UserPlus"
    default:
      return "Package"
  }
}

// تابع فرمت کردن تاریخ (مثلاً "Nov 14" → "Nov 14")
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return dateStr
  }
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    "/api/management/dashboard/statistics/",
    swrFetcher,
    {
      fallbackData: undefined, // ما خودمون mock می‌ذاریم
      revalidateOnFocus: false,
    }
  )

  // اگر داده واقعی اومد، تبدیلش کن به فرمتی که صفحه انتظار داره
  const transformedData = data
    ? {
        stats: {
          activeProjects: data.summary.active_projects,
          pendingProjects: data.summary.pending_projects,
          brokers: data.summary.brokers,
          newUsers: data.summary.new_users,
        },
        activities: data.latest_activities.slice(0, 4).map((act) => ({
          icon: getIconFromType(act.type),
          text:
            act.type === "project"
              ? `New Project: ${act.title}`
              : act.type === "article"
              ? `New Article: ${act.title}`
              : act.type === "broker"
              ? `New Broker: ${act.title}`
              : `${act.title}`,
          date: act.date,
        })),
        traffic: mockData.traffic, // فعلاً از mock استفاده می‌کنیم چون API ترافیک نداره
        pendingItems: {
          projectsToVerify: data.pending_items.projects_to_verify,
          brokersToVerify: data.pending_items.brokers_to_verify,
        },
      }
    : null

  return {
    stats: transformedData?.stats ?? mockData.stats,
    activities: transformedData?.activities ?? mockData.activities,
    traffic: transformedData?.traffic ?? mockData.traffic,
    pendingItems: transformedData?.pendingItems ?? mockData.pendingItems,
    isLoading,
    isError: error,
    mutate,
  }
}