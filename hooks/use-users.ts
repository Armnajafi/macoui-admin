// hooks/use-users.ts
"use client";

import useSWR, { mutate } from "swr";
import { swrFetcher, api } from "@/lib/api";

export interface User {
  id: string;
  name: string;           // first_name + last_name
  email: string;
  phone: string | null;
  role: string;           // Admin, Registered, Verified, Viewer
  status: string;         // Verified, Pending Profile Completion, Rejected, ...
  country: string | null;
  date: string;           // formatted date_joined
}

interface UserApiResponse {
  id: number;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  status: "PPC" | "V" | "R" | "PAR" | "INACTIVE";
  role: "AD" | "RE" | "VE" | "VI";
  country: string | null;
  date_joined: string;
  last_login: string | null;
}

interface UsersApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserApiResponse[];
}

const API_URL = "/api/management/core/users/";

// مپ نقش و وضعیت
const roleMap: Record<string, string> = {
  AD: "Admin",
  RE: "Registered",
  VE: "Verified",
  VI: "Viewer",
};

const statusMap: Record<string, string> = {
  PPC: "Pending Profile Completion",
  V: "Verified",
  R: "Rejected",
  PAR: "Pending Approval Request",
  INACTIVE: "Inactive",
};

export function useUsers() {
  const { data, error, isLoading } = useSWR<UsersApiResponse>(API_URL, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    // fallbackData حذف شد — فقط وقتی API در دسترس نیست mock نشون بده
  });

  // تبدیل API → فرانت‌اند
  const mapToUser = (item: UserApiResponse): User => ({
    id: String(item.id),
    name: `${item.first_name} ${item.last_name}`.trim(),
    email: item.email,
    phone: item.phone,
    role: roleMap[item.role] || item.role,
    status: statusMap[item.status] || item.status,
    country: item.country,
    date: new Date(item.date_joined).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });

  const rawResults = data?.results || [];
  const users: User[] = rawResults.map(mapToUser);

  const stats = {
    total: data?.count || 0,
    active: users.filter(u => u.status === "Verified").length,
    pending: users.filter(u => u.status.includes("Pending")).length,
    inactive: users.filter(u => ["Rejected", "Inactive"].some(s => u.status.includes(s))).length,
  };

  // Create User
  const createUser = async (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    country?: number | string;
    gender?: "M" | "F";
    role: "AD" | "RE" | "VE" | "VI";
    status?: "PPC" | "V" | "R" | "PAR";
    preferred_language?: string;
  }) => {
    try {
      const response = await api.post(API_URL, payload);
      await mutate(API_URL);
      // اگر response.error === null یعنی موفق بوده (status 200)
      return response.error === null;
    } catch (err: any) {
      console.error("Create user failed:", err);
      return false;
    }
  };

  // Update User
  const updateUser = async (
    id: string | number,
    payload: Partial<{
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      role: string;
      status: string;
      is_active?: boolean;
    }>
  ) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload);
      await mutate(API_URL);
      return { success: true };
    } catch (err: any) {
      console.error("Update user failed:", err);
      return { success: false, message: "Failed to update user" };
    }
  };

  // Delete User
  const deleteUser = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`${API_URL}${id}/`);
      await mutate(API_URL);
      return { success: true };
    } catch (err: any) {
      console.error("Delete user failed:", err);
      return { success: false, message: "Failed to delete user" };
    }
  };

  return {
    users,
    stats,
    count: data?.count || 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    error,

    // CRUD
    createUser,
    updateUser,
    deleteUser,

    mutate: () => mutate(API_URL),
  };
}