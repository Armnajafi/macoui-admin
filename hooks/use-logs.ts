"use client"

import useSWR from "swr"
import { swrFetcher } from "@/lib/api"
import type { LogGroup } from "@/lib/types"

interface LogsResponse {
  logs: LogGroup[]
}

// Fallback mock data
const mockLogs: LogGroup[] = [
  {
    date: "Today",
    entries: [
      { id: "1", time: "09:53 am", action: "Replied to user message", logId: "M-0955-721E-9174-840" },
      { id: "2", time: "09:50 am", action: "Generated workflow diagram", logId: "M-2399-2617-6628" },
    ],
  },
  {
    date: "Yesterday",
    entries: [
      { id: "3", time: "10:26 pm", action: "Replied to user message", logId: "M-0955-721E-9174-840" },
      { id: "4", time: "10:22 pm", action: "Generated workflow diagram", logId: "M-2399-2617-6628" },
      { id: "5", time: "07:26 pm", action: "Replied to user message", logId: "M-0955-721E-9174-840" },
      { id: "6", time: "02:15 pm", action: "Generated workflow diagram", logId: "M-2399-2617-6628" },
    ],
  },
]

export function useLogs() {
  const { data, error, isLoading, mutate } = useSWR<LogsResponse>("/logs", swrFetcher, {
    fallbackData: {
      logs: mockLogs,
    },
    revalidateOnFocus: false,
  })

  return {
    logs: data?.logs ?? mockLogs,
    isLoading,
    isError: error,
    mutate,
  }
}
