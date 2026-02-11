"use client"

import useSWR, { mutate } from "swr"
import { swrFetcher, api } from "@/lib/api"

export interface TradingProductCategory {
  id: number
  name: string
}

export interface TradingSeller {
  id: number
  email: string
  full_name: string
}

export interface TradingProduct {
  id: number
  name: string
  sku: string
  category: TradingProductCategory | null
  country_of_origin: {
    id?: number
    code: string
    name: string
  } | null
  price_estimate: number
  currency: string
  status: "available" | "unavailable" | "discontinued" | string
  is_featured: boolean
  seller: TradingSeller | null
  quotation_count: number
  created_at: string
  updated_at?: string
}

export interface TradingProductCreatePayload {
  name: string
  sku: string
  category: number
  country_of_origin: number
  price_estimate: number
  currency: string
  status: "available" | "unavailable" | "discontinued" | string
  description?: string
  is_featured?: boolean
  images?: string[]
  docs?: { title: string; url: string }[]
  specs?: Record<string, string>
}

export type TradingProductUpdatePayload = Partial<TradingProductCreatePayload>

interface TradingProductsResponse {
  count: number
  next: string | null
  previous: string | null
  results: TradingProduct[]
}

const API_URL = "/api/management/trading/products/"

export function useTradingProducts() {
  const { data, error, isLoading } = useSWR<TradingProductsResponse>(API_URL, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const products = data?.results || []

  const stats = {
    total: data?.count || 0,
    available: products.filter((p) => p.status === "available").length,
    unavailable: products.filter((p) => p.status === "unavailable").length,
    discontinued: products.filter((p) => p.status === "discontinued").length,
  }

  const createProduct = async (payload: TradingProductCreatePayload) => {
    try {
      const response = await api.post<TradingProduct>(API_URL, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, product: response.data }
    } catch (err: any) {
      console.error("Create trading product failed:", err)
      const message = err.message || "Failed to create product"
      return { success: false, message }
    }
  }

  const updateProduct = async (id: number, payload: TradingProductUpdatePayload) => {
    try {
      const response = await api.patch<TradingProduct>(`${API_URL}${id}/`, payload)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true, product: response.data }
    } catch (err: any) {
      console.error("Update trading product failed:", err)
      return { success: false, message: err.message || "Failed to update product" }
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return { success: false, cancelled: true }
    }
    try {
      const response = await api.delete(`${API_URL}${id}/`)
      if (response.error) throw new Error(response.error.message)
      await mutate(API_URL)
      return { success: true }
    } catch (err: any) {
      console.error("Delete trading product failed:", err)
      return { success: false, message: err.message || "Failed to delete product" }
    }
  }

  return {
    products,
    stats,
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh: () => mutate(API_URL),
  }
}
