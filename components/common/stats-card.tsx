"use client"

import { useTheme } from "@/contexts/theme-context"

interface StatsCardProps {
  title: string
  value: string | number
  variant?: "default" | "compact"
}

export function StatsCard({ title, value, variant = "default" }: StatsCardProps) {
  const { theme } = useTheme()

  if (variant === "compact") {
    // Mobile compact variant
    return (
      <div
        className={`p-4 rounded-xl shadow-md border flex flex-col justify-center h-24 ${
          theme === "dark" ? "bg-[#0F2A48] border-gray-800/50" : "bg-white border-gray-200"
        }`}
      >
        <span className={`text-xs font-medium mb-3 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          {title}
        </span>
        <span className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{value}</span>
      </div>
    )
  }

  // Desktop default variant
  return (
    <div
      className={`p-5 rounded-lg shadow-md border flex flex-col justify-between group transition-colors ${
        theme === "dark"
          ? "bg-[#1A365D] border-gray-800/50 hover:border-blue-500/30"
          : "bg-white border-gray-200 hover:border-blue-400/50"
      }`}
    >
      <span className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
        {title}
      </span>
      <span
        className={`text-4xl font-bold transition-colors ${
          theme === "dark" ? "text-white group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
