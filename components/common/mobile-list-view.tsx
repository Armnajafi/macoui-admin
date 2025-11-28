"use client"

import { MoreVertical } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { StatusBadge } from "./status-badge"

interface MobileListItem {
  id: string | number
  title: string
  subtitle?: string
  meta?: string[]
  createdBy?: string
  status?: string
}

interface MobileListViewProps {
  items: MobileListItem[]
  onAction?: (item: MobileListItem) => void
}

export function MobileListView({ items, onAction }: MobileListViewProps) {
  const { theme } = useTheme()

  return (
    <div className="md:hidden space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded-sm shadow-md ${
            theme === "dark" ? "bg-[#0F2A48]" : "bg-white border border-gray-200"
          }`}
        >
          {/* Top Row: ID, Title, Menu */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-3">
                {item.subtitle && (
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {item.subtitle}
                  </span>
                )}
                <span className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {item.title}
                </span>
              </div>
            </div>
            <button
              onClick={() => onAction?.(item)}
              className={`-mr-2 ${
                theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Middle Row: Meta Info */}
          {item.meta && item.meta.length > 0 && (
            <div
              className={`flex items-center text-xs mb-4 gap-2 ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.meta.map((m, idx) => (
                <span key={idx}>
                  {m}
                  {idx < item.meta!.length - 1 && <span className="ml-2">/</span>}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Row: Created By and Status */}
          <div className="flex justify-between items-center">
            {item.createdBy && (
              <div className="text-sm">
                <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>Created by </span>
                <span className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {item.createdBy}
                </span>
              </div>
            )}
            {item.status && (
              <div className="text-sm font-medium">
                <StatusBadge status={item.status} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
