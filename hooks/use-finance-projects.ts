// hooks/use-finance-projects.ts
"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { swrFetcher, api } from "@/lib/api";
import { toApiEndpoint } from "@/lib/pagination";

export interface Country {
  id: number;
  code: string;
  name: string;
}

export interface FinanceProject {
  id: number;
  title: string;
  summary: string;
  description_rich?: string;
  country: Country | null;
  status: "P" | "D" | "R"; // Published, Draft, Rejected
  created_by: string;
  created_at: string;
  cover_image?: string;
}

interface FinanceProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinanceProject[];
}

const API_URL = "/api/management/finance/projects/";

export function useFinanceProjects() {
  const [endpoint, setEndpoint] = useState(API_URL);
  const { data, error, isLoading } = useSWR<FinanceProjectsApiResponse>(endpoint, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Transform API data to frontend format
  const projects: FinanceProject[] = data?.results || [];

  const stats = {
    total: data?.count || 0,
    published: projects.filter(p => p.status === "P").length,
    draft: projects.filter(p => p.status === "D").length,
    rejected: projects.filter(p => p.status === "R").length,
  };

  // Create Project
  const createProject = async (payload: {
    title: string;
    summary: string;
    description_rich?: string;
    country: object;
  }) => {
    try {
      const response = await api.post("/api/management/finance/projects/create/", payload);
      await mutate(API_URL);
      return { success: true, message: "Project created successfully" };
    } catch (err: any) {
      console.error("Create finance project failed:", err);
      const msg = err.response?.data?.detail ||
                  err.response?.data?.title?.[0] ||
                  err.response?.data?.summary?.[0] ||
                  "Failed to create finance project";
      return { success: false, message: msg };
    }
  };

  // Update Project
  const updateProject = async (
    id: number,
    payload: Partial<{
      title: string;
      summary: string;
      description_rich: string;
      status: "P" | "D" | "R";
      country: number;
    }>
  ) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload);
      await mutate(API_URL);
      return { success: true };
    } catch (err: any) {
      console.error("Update finance project failed:", err);
      return { success: false, message: "Failed to update finance project" };
    }
  };

  // Delete Project
  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this finance project? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`${API_URL}${id}/`);
      await mutate(API_URL);
      return { success: true };
    } catch (err: any) {
      console.error("Delete finance project failed:", err);
      return { success: false, message: "Failed to delete finance project" };
    }
  };

  return {
    projects,
    stats,
    count: data?.count || 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    isLoading,
    isError: !!error,
    error,

    // CRUD operations
    createProject,
    updateProject,
    deleteProject,

    mutate: () => mutate(API_URL),
  };
}
