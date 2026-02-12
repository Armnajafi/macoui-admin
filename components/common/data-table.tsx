"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { StatusBadge } from "./status-badge"

const ITEMS_PER_PAGE = 8

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
  editRoute?: string
  pagination?: {
    totalCount: number
    nextPage: string | null
    previousPage: string | null
    onNextPage: () => void
    onPreviousPage: () => void
    isLoading?: boolean
  }
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  editRoute = "/brokers/edit",
  pagination,
}: DataTableProps<T>) {
  const { theme } = useTheme()
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const hasServerPagination = Boolean(pagination)
  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE))

  const paginatedData = useMemo(() => {
    if (hasServerPagination) return data
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage, data, hasServerPagination])

  useEffect(() => {
    if (hasServerPagination) return
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages))
  }, [totalPages, hasServerPagination])

  useEffect(() => {
    setOpenMenuId(null)
  }, [currentPage])

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
            
            </tr>
          </thead>

          <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-100"}`}>
            {paginatedData.map((item) => (
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

      {(hasServerPagination || data.length > ITEMS_PER_PAGE) && (
        <div className={`flex items-center justify-between px-4 py-3 border-t ${theme === "dark" ? "border-slate-800" : "border-gray-200"}`}>
          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            {hasServerPagination
              ? `Showing ${data.length} of ${pagination?.totalCount ?? data.length} records`
              : `Page ${currentPage} of ${totalPages}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (hasServerPagination) {
                  pagination?.onPreviousPage()
                  return
                }
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
              }}
              disabled={hasServerPagination ? !pagination?.previousPage || pagination?.isLoading : currentPage === 1}
              className={`px-3 py-1.5 text-sm rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => {
                if (hasServerPagination) {
                  pagination?.onNextPage()
                  return
                }
                setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }}
              disabled={hasServerPagination ? !pagination?.nextPage || pagination?.isLoading : currentPage === totalPages}
              className={`px-3 py-1.5 text-sm rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                  : "border-gray-200 text-slate-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
