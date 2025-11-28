"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { DashboardStats, ActivityItem } from "@/lib/types"

interface DashboardResponse {
  stats: DashboardStats
  activities: ActivityItem[]
  traffic: { day: string; visits: number }[]
  pendingItems: {
    projectsToVerify: number
    brokersToVerify: number
  }
}

// Fallback mock data
const mockData: DashboardResponse = {
  stats: {
    activeProjects: 58,
    pendingProjects: 3,
    brokers: 34,
    newUsers: 14,
  },
  activities: [
    { icon: "Ship", text: "New Project: Ship Financing", date: "Dec 12" },
    { icon: "FileCheck", text: "New Article: Best Practice for Ship Management", date: "Dec 11" },
    { icon: "UserPlus", text: "New Broker: John Doe", date: "Dec 10" },
    { icon: "Package", text: "New Product: Suezmax Tunker", date: "Dec 9" },
  ],
  traffic: [
    { day: "Mon", visits: 80 },
    { day: "Tue", visits: 120 },
    { day: "Wed", visits: 95 },
    { day: "Thu", visits: 140 },
    { day: "Fri", visits: 160 },
    { day: "Sat", visits: 185 },
    { day: "Sun", visits: 210 },
  ],
  pendingItems: {
    projectsToVerify: 5,
    brokersToVerify: 2,
  },
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>("/dashboard", swrFetcher, {
    fallbackData: mockData,
    revalidateOnFocus: false,
  })

  return {
    stats: data?.stats ?? mockData.stats,
    activities: data?.activities ?? mockData.activities,
    traffic: data?.traffic ?? mockData.traffic,
    pendingItems: data?.pendingItems ?? mockData.pendingItems,
    isLoading,
    isError: error,
    mutate,
  }
}
