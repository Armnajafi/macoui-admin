"use client"

import { Search } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface MobileSearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function MobileSearchBar({ placeholder = "", value, onChange }: MobileSearchBarProps) {
  const { theme } = useTheme()

  return (
    <div className="lg:hidden">
      <div className="relative mx-4 lg:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full pl-12 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
            theme === "dark"
              ? "text-white placeholder:text-gray-400 border-white/60 focus:border-blue-500 bg-transparent"
              : "text-slate-900 placeholder:text-gray-500 border-gray-300 focus:border-blue-500 bg-white"
          }`}
        />
      </div>
    </div>
  )
}
