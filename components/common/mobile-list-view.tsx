"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
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
  onEdit?: (item: MobileListItem) => void
  onDelete?: (item: MobileListItem) => void
  editRoute?: string
}

export function MobileListView({ items, onEdit, onDelete, editRoute = "/brokers/edit" }: MobileListViewProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null)

  const handleEdit = (item: MobileListItem) => {
    setOpenMenuId(null)
    if (onEdit) {
      onEdit(item)
    } else {
      router.push(`${editRoute}/${item.id}`)
    }
  }

  const handleDelete = (item: MobileListItem) => {
    setOpenMenuId(null)
    if (onDelete) {
      onDelete(item)
    }
  }

  // بستن منو هنگام کلیک در هر جای صفحه
  const handleCloseMenu = () => {
    setOpenMenuId(null)
  }

  return (
    <div className="md:hidden space-y-3" onClick={handleCloseMenu}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded-sm shadow-md relative ${
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
            
            {/* منوی اکشن */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenMenuId(openMenuId === item.id ? null : item.id)
                }}
                className={`p-1 rounded ${
                  theme === "dark" 
                    ? "text-slate-400 hover:text-white hover:bg-gray-700" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-gray-100"
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* منوی کشویی */}
              {openMenuId === item.id && (
                <div 
                  className={`absolute right-0 top-full mt-1 z-50 w-48 rounded-md shadow-lg border ${
                    theme === "dark" 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-white border-gray-200"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className={`flex items-center w-full px-4 py-3 text-left ${
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
                      className={`flex items-center w-full px-4 py-3 text-left ${
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
              )}
            </div>
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