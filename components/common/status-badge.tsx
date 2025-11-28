"use client"

import { useTheme } from "@/contexts/theme-context"

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, { dark: string; light: string }> = {
  Published: { dark: "text-white", light: "text-slate-900" },
  Pending: { dark: "text-amber-500", light: "text-amber-600" },
  Approved: { dark: "text-green-500", light: "text-green-600" },
  "In Progress": { dark: "text-blue-400", light: "text-blue-600" },
  Rejected: { dark: "text-red-500", light: "text-red-600" },
  Done: { dark: "text-slate-400", light: "text-slate-500" },
  Draft: { dark: "text-slate-500", light: "text-slate-600" },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme()
  const colors = statusStyles[status] || { dark: "text-gray-300", light: "text-gray-600" }

  return <span className={`font-medium ${theme === "dark" ? colors.dark : colors.light}`}>{status}</span>
}
