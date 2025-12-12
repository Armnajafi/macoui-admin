"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"

export interface Article {
  id: number
  thumbnail: string | null
  title: string
  category: string
  author: string
  status: "Published" | "Draft" | "Pending" | string
  date: string // ISO string یا فرمت تاریخ
  content?: string // محتوای مقاله
  summary?: string // خلاصه مقاله
  tags?: string[] // تگ‌ها
  read_time?: number // زمان مطالعه به دقیقه
  views?: number // تعداد بازدید
}

interface ArticlesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Article[]
}

// Mock data
const mockArticles: Article[] = [
  {
    id: 1,
    thumbnail: "/castle-by-lake.jpg",
    title: "New Maritime Regulations in 2025",
    category: "Regulations",
    author: "H. Smith",
    status: "Published",
    date: "2024-01-19T10:00:00Z",
    summary: "Overview of new maritime regulations effective from 2025",
    read_time: 5,
    views: 1250,
  },
  {
    id: 2,
    thumbnail: "/beach-resort-aerial-view.jpg",
    title: "Interview with Captain Johnson",
    category: "Interviews",
    author: "H. Smith",
    status: "Pending",
    date: "2024-01-18T10:00:00Z",
    summary: "Exclusive interview with veteran captain",
    read_time: 8,
    views: 890,
  },
  {
    id: 3,
    thumbnail: "/people-gathering-in-plaza.jpg",
    title: "Top 10 Shipping Routes",
    category: "Analysis",
    author: "H. Smith",
    status: "Published",
    date: "2024-01-17T10:00:00Z",
    summary: "Analysis of the busiest shipping routes worldwide",
    read_time: 6,
    views: 2150,
  },
]

const mockResponse: ArticlesResponse = {
  count: 58,
  next: null,
  previous: null,
  results: mockArticles,
}

const API_URL = "/api/management/finance/news/"

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

  // تابع ایجاد مقاله جدید
  const createArticle = async (payload: Omit<Article, 'id' | 'date' | 'views'>) => {
    try {
      console.log("📤 Creating article:", payload)
      
      const response = await api.post(`${API_URL}`, payload)
      
      await mutate()
      
      return {
        success: true,
        data: response.data,
        message: "مقاله با موفقیت ایجاد شد ✅"
      }
    } catch (err: any) {
      console.error("Error creating article:", err)
      
      let errorMessage = "ایجاد مقاله ناموفق بود! 😔"
      if (err.response?.data) {
        const errorData = err.response.data
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`
          })
        }
      }
      
      return {
        success: false,
        error: err,
        message: errorMessage
      }
    }
  }

  // تابع حذف مقاله
  const deleteArticle = async (id: number) => {
    if (!confirm("مطمئنی می‌خوای این مقاله رو حذف کنی؟")) return

    try {
      await api.delete(`${API_URL}${id}/`)
      await mutate()
      alert("مقاله با موفقیت حذف شد ✅")
    } catch (err: any) {
      console.error("Delete failed:", err)
      alert("حذف نشد! " + (err?.response?.data?.detail || "خطای سرور"))
    }
  }

  // تابع ویرایش مقاله
  const editArticle = async (id: number, payload: Partial<Article>) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload)
      await mutate()
      alert("مقاله با موفقیت ویرایش شد ✅")
    } catch (err: any) {
      console.error("Edit failed:", err)
      alert("ویرایش نشد! " + (err?.response?.data?.detail || "خطای سرور"))
    }
  }

  // داده‌های واقعی یا mock
  const articles = data?.results ?? mockResponse.results
  const totalCount = data?.count ?? mockResponse.count

  // آمار
  const stats = {
    total: totalCount,
    pending: articles.filter(a => a.status === "Pending").length,
    published: articles.filter(a => a.status === "Published").length,
    draft: articles.filter(a => a.status === "Draft").length,
  }

  return {
    articles,
    stats,
    count: totalCount,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    createArticle,
    deleteArticle,
    editArticle,
    error,
    mutate,
  }
}