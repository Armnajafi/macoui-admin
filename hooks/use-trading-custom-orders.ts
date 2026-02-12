"use client"

import useSWR, { mutate } from "swr"
import { useState } from "react"
import { api, swrFetcher } from "@/lib/api"
import { toApiEndpoint } from "@/lib/pagination"

export type CustomOrderStatus = "new" | "in_review" | "matched" | "closed"

export interface TradingCustomOrder {
  id: number
  user: {
    id: number
    email: string
    full_name: string
    phone?: string
  }
  category: {
    id: number
    name: string
  }
  description_requirements: string
  target_price: number
  currency: string
  country_preference: {
    code: string
    name: string
  }
  status: CustomOrderStatus
  matched_product: {
    id: number
    name: string
    sku: string
  } | null
  admin_notes?: string
  created_at: string
  updated_at?: string
}

interface TradingCustomOrdersResponse {
  count: number
  next: string | null
  previous: string | null
  results: TradingCustomOrder[]
}

const API_URL = "/api/management/trading/custom-orders/"

export interface TradingCustomOrderUpdatePayload {
  status?: CustomOrderStatus
  matched_product?: number
  admin_notes?: string
}

export function useTradingCustomOrders() {
  const [endpoint, setEndpoint] = useState(API_URL)
  const { data, error, isLoading } = useSWR<TradingCustomOrdersResponse>(endpoint, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const customOrders = data?.results || []

  const statusStats: Record<CustomOrderStatus, number> = {
    new: 0,
    in_review: 0,
    matched: 0,
    closed: 0,
  }

  customOrders.forEach((order) => {
    if (statusStats[order.status] !== undefined) {
      statusStats[order.status] += 1
    }
  })

  const updateCustomOrder = async (id: number, payload: TradingCustomOrderUpdatePayload) => {
    try {
      const response = await api.patch<TradingCustomOrder>(`${API_URL}${id}/`, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, customOrder: response.data }
    } catch (err: any) {
      console.error("Update custom order failed:", err)
      return { success: false, message: err.message || "Failed to update custom order" }
    }
  }

  return {
    customOrders,
    count: data?.count || 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    stats: statusStats,
    isLoading,
    isError: !!error,
    error,
    updateCustomOrder,
    refresh: () => mutate(API_URL),
  }
}
