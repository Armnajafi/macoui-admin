"use client"

import useSWR, { mutate } from "swr"
import { api, swrFetcher } from "@/lib/api"

export type QuotationStatus = "new" | "in_review" | "quoted" | "closed"

export interface TradingQuotation {
  id: number
  product: {
    id: number
    name: string
    sku: string
  }
  user: {
    id: number
    email: string
    full_name: string
    phone?: string
  }
  desired_qty: number
  notes?: string
  status: QuotationStatus
  quoted_price: number | null
  currency: string
  admin_notes?: string
  created_at: string
  updated_at?: string
}

interface TradingQuotationsResponse {
  count: number
  next: string | null
  previous: string | null
  results: TradingQuotation[]
}

const API_URL = "/api/management/trading/quotations/"

export interface TradingQuotationUpdatePayload {
  status?: QuotationStatus
  quoted_price?: number
  admin_notes?: string
}

export function useTradingQuotations() {
  const { data, error, isLoading } = useSWR<TradingQuotationsResponse>(API_URL, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const quotations = data?.results || []

  const statusStats: Record<QuotationStatus, number> = {
    new: 0,
    in_review: 0,
    quoted: 0,
    closed: 0,
  }

  quotations.forEach((quotation) => {
    if (statusStats[quotation.status] !== undefined) {
      statusStats[quotation.status] += 1
    }
  })

  const updateQuotation = async (id: number, payload: TradingQuotationUpdatePayload) => {
    try {
      const response = await api.patch<TradingQuotation>(`${API_URL}${id}/`, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, quotation: response.data }
    } catch (err: any) {
      console.error("Update quotation failed:", err)
      return { success: false, message: err.message || "Failed to update quotation" }
    }
  }

  return {
    quotations,
    count: data?.count || 0,
    stats: statusStats,
    isLoading,
    isError: !!error,
    error,
    updateQuotation,
    refresh: () => mutate(API_URL),
  }
}
