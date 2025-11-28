"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { User } from "@/lib/types"

interface UsersResponse {
  users: User[]
  stats: {
    total: number
    pending: number
    active: number
    inactive: number
  }
}

// Fallback mock data using proper User type
const mockUsers: User[] = [
  {
    id: "USR-4532",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    date: "Jan 19, 2024",
  },
  {
    id: "USR-5283",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "Active",
    date: "Jan 17, 2024",
  },
  {
    id: "USR-8523",
    name: "Bob Johnson",
    email: "bob.j@example.com",
    role: "Viewer",
    status: "Inactive",
    date: "Jan 12, 2024",
  },
  {
    id: "USR-2142",
    name: "Alice Brown",
    email: "alice.b@example.com",
    role: "Editor",
    status: "Pending",
    date: "Jan 11, 2024",
  },
  {
    id: "USR-5640",
    name: "Charlie Wilson",
    email: "charlie.w@example.com",
    role: "Admin",
    status: "Active",
    date: "Jan 08, 2024",
  },
]

const mockStats = {
  total: 123,
  pending: 10,
  active: 100,
  inactive: 13,
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<UsersResponse>("/users", swrFetcher, {
    fallbackData: {
      users: mockUsers,
      stats: mockStats,
    },
    revalidateOnFocus: false,
  })

  return {
    users: data?.users ?? mockUsers,
    stats: data?.stats ?? mockStats,
    isLoading,
    isError: error,
    mutate,
  }
}
