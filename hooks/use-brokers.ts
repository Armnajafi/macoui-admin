// hooks/use-brokers.ts
"use client"

import useSWR from "swr"
import { useState } from "react"
import { swrFetcher, api } from "@/lib/api"
import { toApiEndpoint } from "@/lib/pagination"

export interface Broker {
  id: number
  name: string
  slug: string
  ship_type: string
  ship_type_display: string
  description: string
  capacity_dwt: number
  capacity_gt: number
  length: string
  width: string
  draft: string
  year_built: number
  price: string
  currency: string
  location_country: number
  location_country_name: string
  location_port: string
  status: string
  status_display: string
  is_featured: boolean
  is_active: boolean
  cover_image: string | null
  cover_image_url: string | null
  seller: number
  seller_name: string
  visit_requests_count: number
  created_at: string
  updated_at: string
  // فیلدهای محاسبه شده برای سازگاری با UI قدیمی
  company: string
  location: string
  date: string
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
  const [endpoint, setEndpoint] = useState(API_URL)
  const { data, error, isLoading, mutate } = useSWR<BrokersResponse>(endpoint, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  // تبدیل داده‌های API به فرمت مورد انتظار UI
  const brokers = data?.results.map(ship => ({
    ...ship,
    // فیلدهای محاسبه شده برای سازگاری با UI قدیمی
    company: ship.seller_name,
    location: ship.location_port,
    date: formatDate(ship.created_at),
  })) ?? []

  const total = data?.count ?? 0

  const stats = {
    total,
    pending: brokers.filter(b => b.status === "for_sale").length,
    approved: brokers.filter(b => b.status === "sold").length,
    rejected: brokers.filter(b => !b.is_active).length,
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
      await api.put(`${API_URL}${id}/`, { status, admin_note })
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
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    isLoading,
    isError: !!error,
    deleteBroker,
    updateBrokerStatus,
    mutate,
  }
}
