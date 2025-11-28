"use client"

import type React from "react"

import { MoreVertical } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { StatusBadge } from "./status-badge"

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onAction?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({ data, columns, onAction }: DataTableProps<T>) {
  const { theme } = useTheme()

  const getValue = (item: T, key: string): unknown => {
    return (item as Record<string, unknown>)[key]
  }

  return (
    <div className={`md:border rounded-sm overflow-hidden ${theme === "dark" ? "border-white/20" : "border-gray-200"}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${theme === "dark" ? "border-slate-800" : "border-gray-200"}`}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-5 text-left text-base font-medium ${
                    theme === "dark" ? "text-white" : "text-slate-700"
                  }`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-5 text-left text-base font-medium"></th>
            </tr>
          </thead>

          <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-100"}`}>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`group transition-colors ${theme === "dark" ? "hover:bg-[#151E32]" : "hover:bg-gray-50"}`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-6 py-5 text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {col.render ? (
                      col.render(item)
                    ) : col.key === "status" ? (
                      <StatusBadge status={String(getValue(item, col.key as string))} />
                    ) : (
                      String(getValue(item, col.key as string) ?? "")
                    )}
                  </td>
                ))}
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onAction?.(item)}
                    className={`hover:opacity-75 ${theme === "dark" ? "text-white" : "text-slate-600"}`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
