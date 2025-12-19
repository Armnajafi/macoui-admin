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
  date: string // یا created_at که فرمت می‌شه
  email?: string
  phone?: string
  notes?: string
  admin_note?: string
}

interface BrokersResponse {
  count: number
  next: string | null
  previous: string | null
  results: Broker[]
}

const API_URL = "/api/brokerage/admin/ships/"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

// فقط برای fallback در توسعه
const mockBrokers: Broker[] = [
  { id: 1, name: "جان اسمیت", company: "ماریتایم کورپ", location: "لندن", status: "Approved", date: "2024-01-19", notes: "" },
  { id: 2, name: "سارا جانسون", company: "اوشن ترید", location: "سیدنی", status: "Pending", date: "2024-01-17" },
  { id: 3, name: "مایکل چن", company: "پاسیفیک شیپینگ", location: "نیویورک", status: "Approved", date: "2024-01-12" },
  { id: 4, name: "اما ویلسون", company: "آتلانتیک بروکرز", location: "سنگاپور", status: "Rejected", date: "2024-01-11", admin_note: "مدارک ناقص" },
]

const mockResponse: BrokersResponse = {
  count: 123,
  next: null,
  previous: null,
  results: mockBrokers,
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
    if (!confirm("آیا از حذف این بروکر مطمئن هستید؟")) return
    try {
      await api.delete(`${API_URL}${id}/`)
      mutate()
    } catch (err) {
      alert("حذف با خطا مواجه شد")
    }
  }

  const updateBrokerStatus = async (
    id: number | string,
    status: Broker["status"],
    admin_note?: string
  ) => {
    try {
      await api.patch(`${API_URL}${id}/`, { status, admin_note })
      mutate()
    } catch (err) {
      alert("تغییر وضعیت با خطا مواجه شد")
      throw err
    }
  }

  return {
    brokers,
    stats,
    total,
    isLoading,
    isError: !!error,
    deleteBroker,
    updateBrokerStatus,
    mutate,
  }
}