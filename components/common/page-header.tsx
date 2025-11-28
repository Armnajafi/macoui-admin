"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

interface PageHeaderProps {
  title: string
  buttonLabel?: string
  onButtonClick?: () => void
  showButton?: boolean
}

export function PageHeader({ title, buttonLabel = "Add New", onButtonClick, showButton = true }: PageHeaderProps) {
  const { theme } = useTheme()

  return (
    <div className="hidden lg:block">
      <div className="flex items-center justify-between w-full">
        <h1 className={`text-4xl font-normal tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          {title}
        </h1>
        {showButton && (
          <Button
            onClick={onButtonClick}
            className={`text-lg rounded-lg font-medium transition-colors shadow-md px-8 py-6 whitespace-nowrap flex-shrink-0 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
