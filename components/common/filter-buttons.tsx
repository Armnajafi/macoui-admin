"use client"

import { ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface FilterButtonsProps {
  filters: string[]
  onFilterClick?: (filter: string) => void
}

export function FilterButtons({ filters, onFilterClick }: FilterButtonsProps) {
  const { theme } = useTheme()

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterClick?.(filter)}
          className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${
            theme === "dark"
              ? "bg-[#1A365D] text-slate-300 hover:text-white"
              : "bg-gray-100 text-slate-600 hover:text-slate-900 hover:bg-gray-200"
          }`}
        >
          {filter}
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
        </button>
      ))}
    </div>
  )
}
