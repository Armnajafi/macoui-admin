"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { Article } from "@/lib/types"

interface ArticlesResponse {
  articles: Article[]
  stats: {
    total: number
    pending: number
  }
}

// Fallback mock data for development
const mockArticles: Article[] = [
  {
    id: 1,
    thumbnail: "/castle-by-lake.jpg",
    title: "Lorem Ipsum Lorem",
    category: "Activity 1",
    author: "H.Smith",
    status: "Published",
    date: "Jan 19, 2024",
  },
  {
    id: 2,
    thumbnail: "/beach-resort-aerial-view.jpg",
    title: "Lorem Ipsum Lorem",
    category: "Activity 3",
    author: "H.Smith",
    status: "Pending",
    date: "Jan 19, 2024",
  },
  {
    id: 3,
    thumbnail: "/people-gathering-in-plaza.jpg",
    title: "Lorem Ipsum Lorem",
    category: "Activity 2",
    author: "H.Smith",
    status: "Approved",
    date: "Jan 19, 2024",
  },
  {
    id: 4,
    thumbnail: "/sunset-landscape-path.jpg",
    title: "Lorem Ipsum Lorem",
    category: "Activity 2",
    author: "H.Smith",
    status: "Draft",
    date: "Jan 19, 2024",
  },
]

const mockStats = {
  total: 123,
  pending: 10,
}

export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>("/articles", swrFetcher, {
    fallbackData: {
      articles: mockArticles,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    articles: data?.articles ?? mockArticles,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
