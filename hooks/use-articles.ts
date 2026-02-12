"use client"

import useSWR from "swr"
import { api, swrFetcher } from "@/lib/api"

export type ArticleCategory = "finance" | "trading" | "consultancy" | "general"

export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  body: string
  category: ArticleCategory | string
  cover_image: string | null
  lang: string
  author: string
  project: number | null
  published_at: string | null
  updated_at: string
  is_published: boolean
}

interface ArticlesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Article[]
}

export interface CreateArticlePayload {
  title: string
  summary: string
  body: string
  category: ArticleCategory
  cover_image: File | null
  lang: string
  project: number | null
  is_published: boolean
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {}

const API_URL = "/api/management/finance/news/"

const toQueryString = (page?: number, pageSize?: number) => {
  const params = new URLSearchParams()
  if (page) params.set("page", String(page))
  if (pageSize) params.set("page_size", String(pageSize))
  const query = params.toString()
  return query ? `?${query}` : ""
}

export function useArticles(page = 1, pageSize = 10) {
  const endpoint = `${API_URL}${toQueryString(page, pageSize)}`

  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>(endpoint, swrFetcher)

  const toArticleFormData = (payload: CreateArticlePayload | UpdateArticlePayload) => {
    const formData = new FormData()

    if (payload.title !== undefined) formData.append("title", payload.title)
    if (payload.summary !== undefined) formData.append("summary", payload.summary)
    if (payload.body !== undefined) formData.append("body", payload.body)
    if (payload.category !== undefined) formData.append("category", payload.category)
    if (payload.lang !== undefined) formData.append("lang", payload.lang)
    if (payload.project !== undefined && payload.project !== null) formData.append("project", String(payload.project))
    if (payload.is_published !== undefined) formData.append("is_published", String(payload.is_published))
    if (payload.cover_image) formData.append("cover_image", payload.cover_image)

    return formData
  }

  const createArticle = async (payload: CreateArticlePayload) => {
    const response = await api.post<Article>(API_URL, toArticleFormData(payload))
    if (response.error) return { success: false, message: response.error.message }
    await mutate()
    return { success: true, data: response.data, message: "مقاله با موفقیت ایجاد شد." }
  }

  const deleteArticle = async (id: number) => {
    const response = await api.delete<null>(`${API_URL}${id}/`)
    if (response.error) return { success: false, message: response.error.message }
    await mutate()
    return { success: true, message: "مقاله با موفقیت حذف شد." }
  }

  const updateArticle = async (id: number, payload: UpdateArticlePayload) => {
    const response = await api.patch<Article>(`${API_URL}${id}/`, toArticleFormData(payload))
    if (response.error) return { success: false, message: response.error.message, data: null }
    await mutate()
    return { success: true, data: response.data, message: "مقاله با موفقیت بروزرسانی شد." }
  }

  const articles = data?.results ?? []

  const stats = {
    total: data?.count ?? 0,
    published: articles.filter((a) => a.is_published).length,
    draft: articles.filter((a) => !a.is_published).length,
  }

  return {
    articles,
    stats,
    count: data?.count ?? 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    createArticle,
    deleteArticle,
    updateArticle,
    mutate,
  }
}

export function useArticleDetail(id?: string | number) {
  const endpoint = id ? `${API_URL}${id}/` : null
  const { data, error, isLoading, mutate } = useSWR<Article>(endpoint, swrFetcher)

  return {
    article: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
