// hooks/use-visit-requests.ts
"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { swrFetcher, api } from "@/lib/api";
import { toApiEndpoint } from "@/lib/pagination";

export interface VisitRequest {
  id: number;
  ship: number;
  user: number;
  visit_type: "onsite" | "virtual";
  status: "new" | "approved" | "rejected" | "completed";
  preferred_datetime: string;
  notes: string;
  created_at: string;
  // Optional extended fields
  ship_name?: string;
  user_name?: string;
  admin_notes?: string;
  final_datetime?: string;
}

interface VisitRequestsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VisitRequest[];
}

const API_URL = "/api/brokerage/admin/visit-requests/";

export function useVisitRequests() {
  const [endpoint, setEndpoint] = useState(API_URL);
  const { data, error, isLoading, mutate: swrMutate } = useSWR<VisitRequestsResponse>(endpoint, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const visitRequests = data?.results || [];

  const stats = {
    total: data?.count || 0,
    new: visitRequests.filter(v => v.status === "new").length,
    approved: visitRequests.filter(v => v.status === "approved").length,
    completed: visitRequests.filter(v => v.status === "completed").length,
    rejected: visitRequests.filter(v => v.status === "rejected").length,
  };

  const updateVisitRequest = async (
    id: number,
    payload: Partial<{
      status: VisitRequest["status"];
      admin_notes: string;
      final_datetime: string;
    }>
  ) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload);
      swrMutate();
      return { success: true };
    } catch (err: any) {
      console.error("Update visit request failed:", err);
      return { success: false, message: "Failed to update visit request" };
    }
  };

  return {
    visitRequests,
    stats,
    count: data?.count || 0,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    isLoading,
    isError: !!error,
    error,
    updateVisitRequest,
    mutate: swrMutate,
  };
}
