"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"
import type { Article } from "@/lib/types"

// درستش اینه (مطمئن شو این آدرس با بک‌اندت یکیه)
const API_URL = "/api/management/finance/news/"   // ← اینو درست کن

interface ArticlesResponse {
  count: number
  results: Article[]
  // اگه بک‌اند stats جدا میفرسته، بعداً اضافه میکنیم
}

const mockArticles: Article[] = [
  {
    id: 1,
    thumbnail: "/castle-by-lake.jpg",
    title: "New Maritime Regulations in 2025",
    category: "Regulations",
    author: "H. Smith",
    status: "Published",
    date: "Jan 19, 2024",
  },
  {
    id: 2,
    thumbnail: "/beach-resort-aerial-view.jpg",
    title: "Interview with Captain Johnson",
    category: "Interviews",
    author: "H. Smith",
    status: "Pending",
    date: "Jan 18, 2024",
  },
  {
    id: 3,
    thumbnail: "/people-gathering-in-plaza.jpg",
    title: "Top 10 Shipping Routes",
    category: "Analysis",
    author: "H. Smith",
    status: "Published",
    date: "Jan 17, 2024",
  },
]

const mockResponse: ArticlesResponse = {
  count: 58,
  results: mockArticles,
}

export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>(
    API_URL,
    swrFetcher,
    {
      fallbackData: mockResponse,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // تابع حذف مقاله (ساده و تمیز)
  const deleteArticle = async (id: number) => {
    if (!confirm("مطمئنی می‌خوای این مقاله رو حذف کنی؟")) return

    try {
      await api.delete(`${API_URL}${id}/`)  // درست: API_URL + id + /
      await mutate() // لیست رو دوباره بگیر
      alert("مقاله با موفقیت حذف شد ✅")
    } catch (err: any) {
      console.error("Delete failed:", err)
      alert("حذف نشد! " + (err?.response?.data?.detail || "خطای سرور"))
    }
  }

  // داده‌های واقعی یا mock
  const articles = data?.results ?? mockResponse.results
  const totalCount = data?.count ?? mockResponse.count

  // آمار ساده (برای StatsCard)
  const stats = {
    total: totalCount,
    pending: articles.filter(a => a.status === "Pending").length,
    published: articles.filter(a => a.status === "Published").length,
  }

  return {
    articles,
    stats,
    isLoading,
    isError: !!error,
    deleteArticle,   // ← اینو حتماً برگردون
    mutate,
  }
}