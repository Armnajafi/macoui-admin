"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"

// Activity type for activity configuration
interface Activity {
  id: string
  name: string
  type: string
  status: string
  date: string
}

interface ActivitiesResponse {
  activities: Activity[]
  stats: {
    total: number
    active: number
    inactive: number
  }
}

// Fallback mock data with proper Activity type
const mockActivities: Activity[] = [
  {
    id: "ACT-001",
    name: "Ship Trading",
    type: "Trading",
    status: "Active",
    date: "Jan 19, 2024",
  },
  {
    id: "ACT-002",
    name: "Ship Financing",
    type: "Finance",
    status: "Active",
    date: "Jan 17, 2024",
  },
  {
    id: "ACT-003",
    name: "Ship Management",
    type: "Management",
    status: "Active",
    date: "Jan 12, 2024",
  },
  {
    id: "ACT-004",
    name: "Ship Brokerage",
    type: "Brokerage",
    status: "Inactive",
    date: "Jan 11, 2024",
  },
  {
    id: "ACT-005",
    name: "Crew Management",
    type: "HR",
    status: "Active",
    date: "Jan 08, 2024",
  },
]

const mockStats = {
  total: 15,
  active: 12,
  inactive: 3,
}

export function useActivities() {
  const { data, error, isLoading, mutate } = useSWR<ActivitiesResponse>("/activities", swrFetcher, {
    fallbackData: {
      activities: mockActivities,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    activities: data?.activities ?? mockActivities,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
