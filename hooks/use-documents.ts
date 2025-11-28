"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { Document } from "@/lib/types"

interface DocumentsResponse {
  documents: Document[]
  stats: {
    total: number
    pending: number
    approved: number
  }
}

// Fallback mock data using proper Document type
const mockDocuments: Document[] = [
  {
    id: "DOC-4532",
    title: "Ship Inspection Report",
    category: "Reports",
    author: "H.Smith",
    status: "Approved",
    date: "Jan 19, 2024",
  },
  {
    id: "DOC-5283",
    title: "Tanker Safety Guidelines",
    category: "Guidelines",
    author: "J.Doe",
    status: "Pending",
    date: "Jan 17, 2024",
  },
  {
    id: "DOC-8523",
    title: "Maritime Regulations 2024",
    category: "Regulations",
    author: "M.Chen",
    status: "Approved",
    date: "Jan 12, 2024",
  },
  {
    id: "DOC-2142",
    title: "Cargo Manifest Template",
    category: "Templates",
    author: "E.Wilson",
    status: "Draft",
    date: "Jan 11, 2024",
  },
  {
    id: "DOC-5640",
    title: "Port Authority Agreement",
    category: "Contracts",
    author: "D.Kim",
    status: "Approved",
    date: "Jan 08, 2024",
  },
]

const mockStats = {
  total: 123,
  pending: 10,
  approved: 100,
}

export function useDocuments() {
  const { data, error, isLoading, mutate } = useSWR<DocumentsResponse>("/documents", swrFetcher, {
    fallbackData: {
      documents: mockDocuments,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    documents: data?.documents ?? mockDocuments,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
