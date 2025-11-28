"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { Project } from "@/lib/types"

interface ProjectsResponse {
  projects: Project[]
  stats: {
    total: number
    pending: number
    approved: number
  }
}

// Fallback mock data for development
const mockProjects: Project[] = [
  {
    id: "PRJ-4532",
    title: "Order of 50 Ships",
    activity: "Activity 1",
    broker: "H.Smith",
    location: "London",
    status: "Approved",
    date: "Jan 19, 2024",
  },
  {
    id: "PRJ-5283",
    title: "Tanker for sale",
    activity: "Activity 3",
    broker: "H.Smith",
    location: "Sydney",
    status: "Pending",
    date: "Jan 17, 2024",
  },
  {
    id: "PRJ-8523",
    title: "Bulk Carrier",
    activity: "Activity 2",
    broker: "J.Doe",
    location: "New York",
    status: "In Progress",
    date: "Jan 12, 2024",
  },
  {
    id: "PRJ-2142",
    title: "Ship Building",
    activity: "Activity 4",
    broker: "J.Doe",
    location: "New York",
    status: "Rejected",
    date: "Jan 11, 2024",
  },
  {
    id: "PRJ-5640",
    title: "Broker Methods",
    activity: "Activity 5",
    broker: "H.Nyu",
    location: "Singapore",
    status: "Done",
    date: "Jan 08, 2024",
  },
]

const mockStats = {
  total: 43,
  pending: 5,
  approved: 38,
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<ProjectsResponse>("/projects", swrFetcher, {
    // Use fallback data when API is not available
    fallbackData: {
      projects: mockProjects,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    projects: data?.projects ?? mockProjects,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
