"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { Broker } from "@/lib/types"

interface BrokersResponse {
  brokers: Broker[]
  stats: {
    total: number
    pending: number
  }
}

// Fallback mock data using proper Broker type
const mockBrokers: Broker[] = [
  {
    id: "BRK-4532",
    name: "John Smith",
    company: "Maritime Corp",
    location: "London",
    status: "Approved",
    date: "Jan 19, 2024",
  },
  {
    id: "BRK-5283",
    name: "Sarah Johnson",
    company: "Ocean Trade Ltd",
    location: "Sydney",
    status: "Pending",
    date: "Jan 17, 2024",
  },
  {
    id: "BRK-8523",
    name: "Michael Chen",
    company: "Pacific Shipping",
    location: "New York",
    status: "Approved",
    date: "Jan 12, 2024",
  },
  {
    id: "BRK-2142",
    name: "Emma Wilson",
    company: "Atlantic Brokers",
    location: "Singapore",
    status: "Rejected",
    date: "Jan 11, 2024",
  },
  {
    id: "BRK-5640",
    name: "David Kim",
    company: "Asia Maritime",
    location: "Hong Kong",
    status: "Approved",
    date: "Jan 08, 2024",
  },
]

const mockStats = {
  total: 123,
  pending: 10,
}

export function useBrokers() {
  const { data, error, isLoading, mutate } = useSWR<BrokersResponse>("/brokers", swrFetcher, {
    fallbackData: {
      brokers: mockBrokers,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    brokers: data?.brokers ?? mockBrokers,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
