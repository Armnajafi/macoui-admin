"use client"

import { useTheme } from "@/contexts/theme-context"

interface TabNavigationProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const { theme } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab.toLowerCase())}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium transition-colors text-xs md:text-base whitespace-nowrap ${
            activeTab === tab.toLowerCase()
              ? theme === "dark"
                ? "bg-[#1A365D] text-white"
                : "bg-blue-100 text-blue-700"
              : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
