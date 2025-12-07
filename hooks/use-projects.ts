"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"

export interface Country {
  id: number
  code: string
  name: string
}

export interface Project {
  id: number
  title: string
  summary: string
  country: Country | null
  status: "Published" | "Draft" | "Pending" | string 
  cover_image: string | null
  created_by: string
  created_at: string // ISO string
}

interface ProjectsApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Project[]
}

// Mock data
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Order of 50 Ships",
    summary: "Large maritime procurement project",
    country: { id: 44, code: "GB", name: "United Kingdom" },
    status: "Published",
    cover_image: null,
    created_by: "h.smith@broker.com",
    created_at: "2024-01-19T10:00:00Z",
  },
  {
    id: 2,
    title: "Tanker for sale",
    summary: "VLCC tanker available",
    country: { id: 23, code: "AU", name: "Australia" },
    status: "Draft",
    cover_image: null,
    created_by: "h.smith@broker.com",
    created_at: "2024-01-17T10:00:00Z",
  },
]

const mockResponse: ProjectsApiResponse = {
  count: 43,
  next: null,
  previous: null,
  results: mockProjects.slice(0, 10),
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<ProjectsApiResponse>(
    "/api/management/finance/projects/",
    swrFetcher,
    {
      fallbackData: mockResponse,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // read stats
  const projects = data?.results ?? mockResponse.results
  const total = data?.count ?? mockResponse.count

  const stats = {
    total,
    published: projects.filter(p => p.status === "Published").length,
    draft: projects.filter(p => p.status === "Draft").length,
    pending: projects.filter(p => p.status === "Pending").length,
  }

  return {
    projects,
    stats,
    count: total,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}