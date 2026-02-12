"use client"

import useSWR, { mutate } from "swr"
import { api, swrFetcher } from "@/lib/api"

export interface TradingCategory {
  id: number
  name: string
  slug: string
  parent: { id: number; name: string } | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface TradingCategoryCreatePayload {
  name: string
  slug: string
  parent?: number | null
  description?: string
}

export interface TradingCategoryUpdatePayload extends Partial<TradingCategoryCreatePayload> {}

const API_URL = "/api/trading/categories/"
const API_URL_MANAGEMENT = "/api/management/trading/categories/"

export function useTradingCategories() {
  const { data, error, isLoading } = useSWR<TradingCategory[]>(API_URL, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
  // console.log(data)
  const categories = data?.results || []
  
  const createCategory = async (payload: TradingCategoryCreatePayload) => {
    try {
      const response = await api.post<TradingCategory>(API_URL_MANAGEMENT, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, category: response.data }
    } catch (err: any) {
      console.error("Create category failed:", err)
      return { success: false, message: err.message || "Failed to create category" }
    }
  }

  const updateCategory = async (id: number, payload: TradingCategoryUpdatePayload) => {
    try {
      const response = await api.patch<TradingCategory>(`${API_URL_MANAGEMENT}${id}/`, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, category: response.data }
    } catch (err: any) {
      console.error("Update category failed:", err)
      return { success: false, message: err.message || "Failed to update category" }
    }
  }

  return {
    categories,
    isLoading,
    isError: !!error,
    error,
    createCategory,
    updateCategory,
    refresh: () => mutate(API_URL),
  }
}
