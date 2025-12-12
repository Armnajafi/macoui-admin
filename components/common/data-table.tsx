"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
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
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  editRoute?: string // مسیر صفحه ویرایش، مثلاً "/admin/projects/edit"
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  editRoute = "/admin/projects/edit" 
}: DataTableProps<T>) {
  const { theme } = useTheme()
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null)

  const getValue = (item: T, key: string): unknown => {
    return (item as Record<string, unknown>)[key]
  }

  const handleEdit = (item: T) => {
    if (onEdit) {
      onEdit(item)
    } else if (editRoute) {
      // هدایت به صفحه ویرایش با ID
      router.push(`${editRoute}/${item.id}`)
    }
    setOpenMenuId(null)
  }

  const handleDelete = (item: T) => {
    if (onDelete) {
      onDelete(item)
    }
    setOpenMenuId(null)
  }

  const toggleMenu = (itemId: string | number) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId)
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
              <th className="px-6 py-5 text-left text-base font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-100"}`}>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`group transition-colors relative ${theme === "dark" ? "hover:bg-[#151E32]" : "hover:bg-gray-50"}`}
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
                <td className="px-6 py-5 text-right relative">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`hover:opacity-75 ${theme === "dark" ? "text-white" : "text-slate-600"}`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* منوی اکشن */}
                  {openMenuId === item.id && (
                    <>
                      {/* Backdrop برای بستن منو با کلیک خارج */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      
                      <div className={`absolute right-0 mt-2 z-50 w-48 rounded-md shadow-lg ${
                        theme === "dark" 
                          ? "bg-gray-800 border border-gray-700" 
                          : "bg-white border border-gray-200"
                      }`}>
                        <div className="py-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className={`flex items-center w-full px-4 py-3 text-left hover:opacity-90 ${
                              theme === "dark" 
                                ? "text-white hover:bg-gray-700" 
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <Edit className="w-4 h-4 mr-3" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item)}
                            className={`flex items-center w-full px-4 py-3 text-left hover:opacity-90 ${
                              theme === "dark" 
                                ? "text-red-400 hover:bg-gray-700" 
                                : "text-red-600 hover:bg-gray-100"
                            }`}
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}