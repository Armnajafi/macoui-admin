"use client"

import useSWR from "swr"
import { swrFetcher, api } from "@/lib/api"

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

const API_URL = "/api/management/finance/projects/"

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<ProjectsApiResponse>(
    API_URL,
    swrFetcher,
    {
      fallbackData: mockResponse,
      revalidateOnFocus: false, 
      revalidateOnReconnect: true,
    }
  )

  // تابع ایجاد پروژه جدید
  const createProject = async (payload: Omit<Project, 'id' | 'created_by' | 'created_at'>) => {
    try {
          // 🚨 تبدیل برای API: فقط country.id را بفرست
    const apiPayload = {
      ...payload,
      country: payload.country ? payload.country.id : null  // فقط ID
    };
    
    console.log("📤 Sending to API:", apiPayload);
    
      const response = await api.post(`${API_URL}create/`, payload);
      
      // پس از ایجاد موفقیت‌آمیز، لیست را refresh کنید
      await mutate();
      
      return {
        success: true,
        data: response.data,
        message: "پروژه با موفقیت ایجاد شد ✅"
      };
    } catch (err: any) {
      console.error("Error creating project:", err);
      
      let errorMessage = "ایجاد پروژه ناموفق بود! 😔";
      if (err.response?.data) {
        // پردازش خطاهای دریافتی از API
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            errorMessage += `\n${key}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
          });
        }
      }
      
      return {
        success: false,
        error: err,
        message: errorMessage
      };
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("مطمئنی می‌خوای این پروژه رو حذف کنی؟")) return;

    try {
      await api.delete(`${API_URL}${id}/`);
      mutate();
      alert("پروژه با موفقیت حذف شد ✅");
    } catch (err) {
      console.error(err);
      alert("حذف نشد! یه مشکلی پیش اومد 😔");
    }
  };

  const editProject = async (id: number, payload: Partial<Project>) => {
    if (!confirm("مطمئنی می‌خوای این پروژه رو ویرایش کنی؟")) return;

    try {
      await api.patch(`${API_URL}${id}/`, payload);
      mutate();
      alert("پروژه با موفقیت ویرایش شد ✅");
    } catch (err) {
      console.error(err);
      alert("ویرایش نشد! یه مشکلی پیش اومد 😔");
    }
  };

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
    createProject, // اضافه شد
    deleteProject,
    editProject,
    error,
    mutate,
  }
}