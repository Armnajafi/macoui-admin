// hooks/use-users.ts
"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"
import type { User } from "@/lib/types"

const API_URL = "/api/management/core/users/"  // این آدرس درستشه طبق تیم بک‌اند

const mockUsers: User[] = [
  { id: "USR-4532", name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", date: "Jan 19, 2024" },
  { id: "USR-5283", name: "Jane Smith", email: "jane.smith@example.com", role: "Editor", status: "Active", date: "Jan 17, 2024" },
  { id: "USR-8523", name: "Bob Johnson", email: "bob.j@example.com", role: "Viewer", status: "Inactive", date: "Jan 12, 2024" },
  { id: "USR-2142", name: "Alice Brown", email: "alice.b@example.com", role: "Editor", status: "Pending", date: "Jan 11, 2024" },
]

const mockResponse = { count: 123, results: mockUsers }

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<any>(
    API_URL,
    swrFetcher,
    {
      fallbackData: mockResponse,
      revalidateOnFocus: false,
    }
  )

  const deleteUser = async (id: string) => {
    if (!confirm("مطمئنی می‌خوای این کاربر رو حذف کنی؟")) return
    try {
      await api.delete(`${API_URL}${id}/`)
      mutate()
      alert("کاربر حذف شد")
    } catch (err) {
      alert("حذف نشد!")
    }
  }

  const users = data?.results ?? mockResponse.results
  const stats = {
    total: data?.count ?? users.length,
    active: users.filter((u: User) => u.status === "Active").length,
    inactive: users.filter((u: User) => u.status === "Inactive").length,
    pending: users.filter((u: User) => u.status === "Pending").length,
  }

  return {
    users,
    stats,
    isLoading,
    isError: !!error,
    deleteUser,
    mutate,
  }
}