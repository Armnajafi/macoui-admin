"use client"

import { Search } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useTheme } from "@/contexts/theme-context"
import { useLogs } from "@/hooks/use-logs"

export default function LogsPage() {
  const { theme } = useTheme()
  const { logs } = useLogs()

  return (
    <DashboardLayout title="Logs" wave={true}>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className={`w-full rounded-lg pl-11 pr-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
              theme === "dark"
                ? "bg-[#1a2744] border border-slate-700/50 text-white"
                : "bg-white border border-gray-300/50 text-slate-900"
            }`}
          />
        </div>

        {/* Log Groups */}
        <div className="space-y-6">
          {logs.map((group) => (
            <div key={group.date} className="space-y-3">
              {/* Date Header */}
              <h2 className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {group.date}
              </h2>

              {/* Log Entries */}
              <div
                className={`rounded-xl p-4 md:p-5 ${
                  theme === "dark" ? "bg-[#1a2744]" : "bg-white border border-gray-200"
                }`}
              >
                <div className="space-y-0">
                  {group.entries.map((entry, index) => (
                    <div key={entry.id} className="relative flex items-start gap-3 md:gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        {/* Dot */}
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1.5 md:mt-2 flex-shrink-0" />
                        {/* Line */}
                        {index < group.entries.length - 1 && (
                          <div
                            className={`w-px h-12 md:h-10 ${theme === "dark" ? "bg-slate-600/50" : "bg-gray-300"}`}
                          />
                        )}
                      </div>

                      {/* Content - Desktop Layout */}
                      <div className="hidden md:flex flex-1 items-center gap-4 pb-4">
                        <span
                          className={`text-sm w-20 flex-shrink-0 ${
                            theme === "dark" ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {entry.time}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                          {entry.action}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>•</span>
                        <span className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                          log id: {entry.logId}
                        </span>
                      </div>

                      {/* Content - Mobile Layout */}
                      <div className="flex md:hidden flex-1 justify-between items-start pb-6">
                        <div className="space-y-1">
                          <p className={`text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                            {entry.action}
                          </p>
                          <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                            log id: {entry.logId}
                          </p>
                        </div>
                        <span
                          className={`text-xs flex-shrink-0 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {entry.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
