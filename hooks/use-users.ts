// hooks/use-users.ts
"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer" | string
  status: "Active" | "Inactive" | "Pending" | string
  date: string
  phone?: string
  company?: string
  department?: string
  avatar?: string | null
  permissions?: string[]
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
}

interface UsersResponse {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

const API_URL = "/api/management/core/users/"

// Mock data
const mockUsers: User[] = [
  { 
    id: "USR-4532", 
    name: "John Doe", 
    email: "john.doe@example.com", 
    role: "Admin", 
    status: "Active", 
    date: "Jan 19, 2024",
    phone: "+1 234 567 8900",
    company: "Maritime Solutions Inc.",
    department: "IT",
    avatar: null,
    permissions: ["read", "write", "delete"],
    lastLogin: "2024-01-19T10:30:00Z"
  },
  { 
    id: "USR-5283", 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    role: "Editor", 
    status: "Active", 
    date: "Jan 17, 2024",
    phone: "+1 234 567 8901",
    company: "Ocean Logistics Ltd.",
    department: "Operations",
    avatar: null,
    permissions: ["read", "write"],
    lastLogin: "2024-01-17T14:20:00Z"
  },
  { 
    id: "USR-8523", 
    name: "Bob Johnson", 
    email: "bob.j@example.com", 
    role: "Viewer", 
    status: "Inactive", 
    date: "Jan 12, 2024",
    phone: "+1 234 567 8902",
    company: "Global Shipping Co.",
    department: "Finance",
    avatar: null,
    permissions: ["read"],
    lastLogin: "2024-01-10T09:15:00Z"
  },
  { 
    id: "USR-2142", 
    name: "Alice Brown", 
    email: "alice.b@example.com", 
    role: "Editor", 
    status: "Pending", 
    date: "Jan 11, 2024",
    phone: "+1 234 567 8903",
    company: "Port Authority",
    department: "Management",
    avatar: null,
    permissions: ["read", "write"],
    lastLogin: "2024-01-10T09:15:00Z"
  },
]

const mockResponse: UsersResponse = {
  count: 123,
  next: null,
  previous: null,
  results: mockUsers,
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    API_URL,
    swrFetcher,
    {
      fallbackData: mockResponse,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // تابع ایجاد کاربر جدید
  const createUser = async (payload: Omit<User, 'id' | 'date' | 'lastLogin' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log("📤 Creating user:", payload)
      
      const response = await api.post(API_URL, payload)
      
      await mutate()
      
      return {
        success: true,
        data: response.data,
        message: "User created successfully! ✅"
      }
    } catch (err: any) {
      console.error("Error creating user:", err)
      
      let errorMessage = "Failed to create user! 😔"
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

const deleteUser = async (id: string) => {
  if (!confirm("Are you sure you want to delete this user?")) return false

  try {
    await api.delete(`${API_URL}${id}/`)
    await mutate()
    
    const updatedUsers = users.filter(user => user.id !== id)
    
    alert("User deleted successfully ✅")
    return { success: true }
  } catch (err: any) {
    console.error("Delete failed:", err)
    
    let errorMessage = "Deletion failed!"
    if (err.response?.data?.detail) {
      errorMessage += ` ${err.response.data.detail}`
    } else if (err.response?.data) {
      const errorData = err.response.data
      if (typeof errorData === 'object') {
        Object.keys(errorData).forEach(key => {
          errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`
        })
      }
    }
    
    alert(errorMessage)
    return { success: false, error: err }
  }
}

  // تابع ویرایش کاربر
  const editUser = async (id: string, payload: Partial<User>) => {
    try {
      const response = await api.patch(`${API_URL}${id}/`, payload)
      await mutate()
      
      return {
        success: true,
        data: response.data,
        message: "User updated successfully! ✅"
      }
    } catch (err: any) {
      console.error("Edit failed:", err)
      
      let errorMessage = "Failed to update user! 😔"
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

  // تابع دریافت کاربر با ID
  const getUserById = async (id: string) => {
    try {
      const response = await api.get(`${API_URL}${id}/`)
      return {
        success: true,
        data: response.data as User
      }
    } catch (err: any) {
      console.error("Get user failed:", err)
      return {
        success: false,
        error: err,
        message: "Failed to fetch user details"
      }
    }
  }

  // تابع تغییر وضعیت کاربر
  const updateUserStatus = async (id: string, status: User['status']) => {
    return editUser(id, { status })
  }

  // تابع تغییر نقش کاربر
  const updateUserRole = async (id: string, role: User['role']) => {
    return editUser(id, { role })
  }

  // داده‌های واقعی یا mock
  const users = data?.results ?? mockResponse.results
  const totalCount = data?.count ?? mockResponse.count

  // آمار
  const stats = {
    total: totalCount,
    active: users.filter(u => u.status === "Active").length,
    inactive: users.filter(u => u.status === "Inactive").length,
    pending: users.filter(u => u.status === "Pending").length,
    admin: users.filter(u => u.role === "Admin").length,
    editor: users.filter(u => u.role === "Editor").length,
    viewer: users.filter(u => u.role === "Viewer").length,
  }

  return {
    users,
    stats,
    count: totalCount,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    createUser,
    deleteUser,
    editUser,
    getUserById,
    updateUserStatus,
    updateUserRole,
    error,
    mutate,
  }
}