// hooks/use-brokers.ts
"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"

export interface Broker {
  id: number | string
  name: string
  company: string
  location: string
  status: "Approved" | "Pending" | "Rejected"
  date: string
  email?: string
  phone?: string
  notes?: string
}

interface BrokersResponse {
  count: number
  next: string | null
  previous: string | null
  results: Broker[]
}

const API_URL = "/api/brokerage/admin/ships/"

const mockBrokers: Broker[] = [
  { id: "BRK-4532", name: "John Smith", company: "Maritime Corp", location: "London", status: "Approved", date: "Jan 19, 2024" },
  { id: "BRK-5283", name: "Sarah Johnson", company: "Ocean Trade Ltd", location: "Sydney", status: "Pending", date: "Jan 17, 2024" },
  { id: "BRK-8523", name: "Michael Chen", company: "Pacific Shipping", location: "New York", status: "Approved", date: "Jan 12, 2024" },
  { id: "BRK-2142", name: "Emma Wilson", company: "Atlantic Brokers", location: "Singapore", status: "Rejected", date: "Jan 11, 2024", notes: "مدارک ناقص" },
]

const mockResponse: BrokersResponse = {
  count: 123,
  next: null,
  previous: null,
  results: mockBrokers
}

export function useBrokers() {
  const { data, error, isLoading, mutate } = useSWR<BrokersResponse>(API_URL, swrFetcher, {
    fallbackData: mockResponse,
  })

  const brokers = data?.results ?? []
  const total = data?.count ?? brokers.length

  const stats = {
    total,
    pending: brokers.filter(b => b.status === "Pending").length,
    approved: brokers.filter(b => b.status === "Approved").length,
    rejected: brokers.filter(b => b.status === "Rejected").length,
  }

  const deleteBroker = async (id: number | string) => {
    if (!confirm("مطمئنی می‌خوای حذف کنی؟")) return
    try {
      await api.delete(`${API_URL}${id}/`)
      mutate()
    } catch (err) {
      alert("حذف ناموفق بود")
    }
  }

  const updateBrokerStatus = async (id: number | string, status: Broker["status"], admin_note?: string) => {
    try {
      await api.patch(`${API_URL}${id}/`, { status, admin_note })
      mutate()
    } catch (err) {
      alert("تغییر وضعیت ناموفق بود")
      throw err
    }
  }

  return {
    brokers,
    stats,
    total,
    isLoading,
    isError: !!error,
    mutate,
    deleteBroker,
    updateBrokerStatus,
  }
}