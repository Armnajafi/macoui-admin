"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { swrFetcher, api } from "@/lib/api";
import { toApiEndpoint } from "@/lib/pagination";

// Frontend display model
export interface Activity {
  id: string;           // We'll use the backend PK as string
  name: string;         // Maps to "activity_display" or "activity"
  type: string;         // You can extend this later if needed
  status: "Active" | "Inactive";
  date: string;         // Formatted date from created_at / updated_at
}

// API response shape (single item)
interface ActivityConfigResponse {
  id: number;
  activity: string;
  activity_display?: string;
  heading: string;
  subheading: string;
  short_description: string;
  created_at: string;
  updated_at: string;
}

interface ActivitiesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ActivityConfigResponse[];
}

// Mock / fallback data
const mockActivities: Activity[] = [
  {
    id: "1",
    name: "Ship Finance",
    type: "Finance",
    status: "Active",
    date: "2025-01-15",
  },
  {
    id: "2",
    name: "Maritime Trading",
    type: "Trading",
    status: "Active",
    date: "2025-01-14",
  },
];

const mockStats = {
  total: 8,
  active: 7,
  inactive: 1,
};

const API_URL = "/api/management/core/activity-config/";

export function useActivities() {
  const [endpoint, setEndpoint] = useState(API_URL);
  const {
    data,
    error,
    isLoading,
  } = useSWR<ActivitiesApiResponse>(endpoint, swrFetcher, {
    fallbackData: {
      count: mockStats.total,
      next: null,
      previous: null,
      results: mockActivities.map((a, i) => ({
        id: Number(a.id),
        activity: a.name.toLowerCase().replace(/\s+/g, "_"),
        activity_display: a.name,
        heading: `${a.name} Projects`,
        subheading: `Manage ${a.name.toLowerCase()} configurations`,
        short_description: `Configuration for ${a.name}`,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-15T00:00:00Z",
      })),
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Helper: transform backend item → frontend Activity
  const mapToActivity = (item: ActivityConfigResponse): Activity => ({
    id: String(item.id),
    name: item.activity_display || item.activity.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    type: item.activity.includes("finance") ? "Finance" :
          item.activity.includes("trading") ? "Trading" :
          item.activity.includes("brokerage") ? "Brokerage" : "Other",
    status: "Active", // You can add a real status field later if needed
    date: new Date(item.updated_at || item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Create new activity config
  const createActivity = async (payload: {
    activity: string;
    heading: string;
    subheading: string;
    short_description: string;
  }) => {
    try {
      const response = await api.post(API_URL, payload);
      await mutate(API_URL); // Refresh list
      return {
        success: true,
        data: response.data,
        message: "Activity created successfully",
      };
    } catch (err: any) {
      console.error("Create activity failed:", err);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.activity?.[0] ||
        "Failed to create activity";
      return {
        success: false,
        error: err,
        message,
      };
    }
  };

  // Update existing activity config
  const updateActivity = async (
    id: string | number,
    payload: Partial<{
      heading: string;
      subheading: string;
      short_description: string;
    }>
  ) => {
    try {
      await api.patch(`${API_URL}${id}/`, payload);
      await mutate(API_URL);
      return { success: true, message: "Activity updated successfully" };
    } catch (err: any) {
      console.error("Update failed:", err);
      return {
        success: false,
        message: "Failed to update activity",
        error: err,
      };
    }
  };

  // Delete activity config
  const deleteActivity = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this activity configuration?")) {
      return;
    }

    try {
      await api.delete(`${API_URL}${id}/`);
      await mutate(API_URL);
      alert("Activity deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete activity");
    }
  };

  // Processed data
  const rawResults = data?.results ?? [];
  
  const activities: Activity[] = rawResults.map(mapToActivity);

  const stats = {
    total: data?.count ?? mockStats.total,
    active: activities.filter(a => a.status === "Active").length,
    inactive: activities.filter(a => a.status === "Inactive").length,
  };

  console.log("Final activities array:", activities);
  return {
    activities,
    stats,
    count: data?.count ?? mockStats.total,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    goToNextPage: () => data?.next && setEndpoint(toApiEndpoint(data.next)),
    goToPreviousPage: () => data?.previous && setEndpoint(toApiEndpoint(data.previous)),
    isLoading,
    isError: !!error,
    error,

    // CRUD actions
    createActivity,
    updateActivity,
    deleteActivity,

    // For advanced cache control
    mutate: () => mutate(API_URL),
  };
}
