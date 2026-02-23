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

export type FinanceStatus = "P" | "D" | "C" | "R" | "Published" | "Draft" | "Closed" | "Rejected";

export interface FinanceProject {
  id: number;
  title: string;
  summary: string;
  description_rich?: string;
  country: Country | null;
  ship_type?: string | null;
  vessel_age_years?: number | null;
  financing_product_type?: string | null;
  project_financed_type?: string | null;
  amortization_profile?: string | null;
  required_service?: string | null;
  ltv_ratio_bucket?: string | null;
  transaction_amount_musd?: string | null;
  financing_rate_type?: string | null;
  derivative_hedging_type?: string | null;
  transaction_stage?: string | null;
  collateral_type?: string | null;
  tenor_bucket?: string | null;
  status: FinanceStatus;
  created_by: string;
  created_at: string;
  updated_at?: string;
  cover_image?: string | null;
}

interface FinanceProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinanceProject[];
}

interface FinanceStatsResponse {
  total_projects: number;
  pending_projects: number;
  approved_projects: number;
  closed_projects: number;
}

export interface FinanceProjectPayload {
  title: string;
  summary: string;
  description_rich?: string;
  country: number;
  ship_type?: string;
  vessel_age_years?: number | null;
  financing_product_type?: string;
  project_financed_type?: string;
  amortization_profile?: string;
  required_service?: string;
  ltv_ratio_bucket?: string;
  transaction_amount_musd?: string;
  financing_rate_type?: string;
  derivative_hedging_type?: string;
  transaction_stage?: string;
  collateral_type?: string;
  tenor_bucket?: string | null;
  status?: "P" | "D" | "C";
}

const API_URL = "/api/management/finance/projects/";

const normalizeStatus = (status: FinanceStatus): "P" | "D" | "C" => {
  if (status === "Published") return "P";
  if (status === "Draft") return "D";
  if (status === "Closed" || status === "Rejected" || status === "R") return "C";
  return status;
};

export function useFinanceProjects() {
  const [endpoint, setEndpoint] = useState(API_URL);
  const { data, error, isLoading } = useSWR<FinanceProjectsApiResponse>(endpoint, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const { data: statsData } = useSWR<FinanceStatsResponse>(
    "/api/management/finance/projects/statistics/",
    swrFetcher,
    { revalidateOnFocus: false }
  );

  const projects: FinanceProject[] = data?.results || [];

  const stats = {
    total: statsData?.total_projects ?? data?.count ?? 0,
    published: statsData?.approved_projects ?? projects.filter((p) => normalizeStatus(p.status) === "P").length,
    draft: statsData?.pending_projects ?? projects.filter((p) => normalizeStatus(p.status) === "D").length,
    rejected: 0,
    closed: statsData?.closed_projects ?? 0,
  };

  const createProject = async (payload: FinanceProjectPayload) => {
    try {
      await api.post("/api/management/finance/projects/create/", payload);
      await Promise.all([
        mutate(API_URL),
        mutate("/api/management/finance/projects/statistics/"),
      ]);
      return { success: true, message: "Project created successfully" };
    } catch (err: any) {
      console.error("Create finance project failed:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.title?.[0] ||
        err.response?.data?.summary?.[0] ||
        "Failed to create finance project";
      return { success: false, message: msg };
    }
  };

  const updateProject = async (id: number, payload: Partial<FinanceProjectPayload>) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload);
      await Promise.all([
        mutate(API_URL),
        mutate("/api/management/finance/projects/statistics/"),
      ]);
      return { success: true };
    } catch (err: any) {
      console.error("Update finance project failed:", err);
      const msg = err.response?.data?.detail || "Failed to update finance project";
      return { success: false, message: msg };
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this finance project? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`${API_URL}${id}/`);
      await Promise.all([
        mutate(API_URL),
        mutate("/api/management/finance/projects/statistics/"),
      ]);
      return { success: true };
    } catch (err: any) {
      console.error("Delete finance project failed:", err);
      return { success: false, message: "Failed to delete finance project" };
    }
  };

  return {
    projects,
    stats,
    normalizeStatus,
    count: data?.count || 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    isLoading,
    isError: !!error,
    error,
    createProject,
    updateProject,
    deleteProject,
    mutate: () => mutate(API_URL),
  };
}
