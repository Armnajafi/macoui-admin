"use client"

import { cn } from "@/lib/utils"

interface CustomSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function CustomSwitch({ checked, onCheckedChange, className }: CustomSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        checked ? "bg-[#1A365D] shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]" : "bg-[#00072E]",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full shadow-lg transition-all duration-300 my-1",
          checked ? "translate-x-9 bg-[#0078D4]" : "translate-x-1 bg-[#19355B]",
        )}
      />
    </button>
  )
}
