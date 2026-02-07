"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Users,
  Briefcase,
  Settings,
  Bell,
  Menu,
  X,
  Search,
  FolderOpen,
  Newspaper,
  Activity,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  wave?: boolean
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: Briefcase, label: "Brokers", href: "/brokers" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Newspaper, label: "Articles", href: "/articles" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: Activity, label: "Activities", href: "/activities" },
  { icon: Bell, label: "Logs", href: "/logs" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function DashboardLayout({ children, title = "Dashboard", wave = false }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-[#002340]" : "bg-[#FAFAFA]"}`}>
      {/* Header */}
      <header
        className={`relative text-white z-40 ${
          theme === "dark" ? "bg-transparent border-b border-gray-900" : "bg-transparent border-b border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 lg:pl-30">
          {/* Mobile: hamburger + centered title + avatar on right */}
          <div className="flex items-center justify-between w-full">
            {/* Hamburger menu - mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden hover:bg-white/10 ${theme === "dark" ? "text-white" : "text-slate-700"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-32 h-32" /> : <Menu className="size-7" />}
            </Button>

            {/* Title - centered on mobile, left aligned on desktop */}
            <h1
              className={`absolute left-1/2 -translate-x-1/2 text-lg font-bold lg:relative lg:left-0 lg:translate-x-0 lg:ml-10 ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h1>

            {/* Avatar - right aligned */}
            <div className="flex items-center gap-3 lg:gap-4">
              <Search
                className={`hidden lg:block w-5 h-5 cursor-pointer transition ${
                  theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              />

              <div
                className={`flex items-center px-3 py-2 lg:px-4 rounded-full ${
                  theme === "dark" ? "lg:bg-[#334F66]" : "lg:bg-gray-100"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-xs font-medium text-white">HM</AvatarFallback>
                </Avatar>
                <span
                  className={`hidden lg:block ml-3 text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-slate-700"
                  }`}
                >
                  Hani m.
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {wave && theme !== "dark" && (
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
<svg
  width="110%"
  height="240"
  viewBox="0 0 1440 140"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMin slice"
>
  <g filter="url(#filter_blur_top)">
    <path
      d="M127.94 144.4215C31.9471 119.4445 -203.239 93.501 -165.459 0.279L1493.79 -1.387L1427.79 101.7845C1394.77 78.3845 1273.34 49.181 1051.79 119.566C774.851 207.5475 644.216 57.642 271.265 41.24995C-101.685 24.85775 201.265 163.501 127.94 144.4215Z"
      fill="url(#paint0_linear_custom)"
    />
  </g>

  <defs>
    <filter
      id="filter_blur_top"
      x="-250"
      y="-120"
      width="2000"
      height="400"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" />
      <feGaussianBlur stdDeviation="12" />
    </filter>

    <linearGradient
      id="paint0_linear_custom"
      x1="765.735"
      y1="428.417"
      x2="766.748"
      y2="-245.651"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.45" stopColor="#AACEFF" stopOpacity="0.9" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>


        </div>
      )}
      {/* Wave decorations */}
      {wave && theme === "dark" && (
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
<svg
  width="110%"
  height="240"
  viewBox="0 0 1440 140"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMin slice"
>
  <g filter="url(#filter_blur_bottom)">
    <path
      d="M127.94 144.4215C31.9471 119.4445 -203.239 93.501 -165.459 0.279L1493.79 -1.387L1427.79 101.7845C1394.77 78.3845 1273.34 49.181 1051.79 119.566C774.851 207.5475 644.216 57.642 271.265 41.24995C-101.685 24.85775 201.265 163.501 127.94 144.4215Z"
      fill="url(#paint0_linear_1255_847)"
    />
  </g>

  <defs>
    <filter
      id="filter_blur_bottom"
      x="-250"
      y="-120"
      width="2000"
      height="400"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" />
      <feGaussianBlur stdDeviation="12" />
    </filter>

    <linearGradient
      id="paint0_linear_1255_847"
      x1="924.249"
      y1="258.552"
      x2="925.472"
      y2="-148.253"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#016BFF" stopOpacity="0.9" />
      <stop offset="1" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>

        </div>
      )}

      <div className="flex flex-1 relative overflow-auto">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex overflow-auto fixed left-0 top-0 bottom-0 w-30 flex-col items-center py-4 space-y-12 z-50 shadow-2xl rounded-tr-3xl ${
            theme === "dark" ? "bg-[#0F2A48]" : "bg-white border-r border-gray-200"
          }`}
        >
          <div className="mb-10">
            <svg width="56" height="45" viewBox="0 0 56 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32.7109 0.5H1.21094L23.2109 22.5L1.21094 44.5H32.7109L54.7109 22.5L32.7109 0.5Z"
                fill="#D4AF37"
                stroke="#302828"
              />
            </svg>
          </div>
          <nav className="flex flex-col space-y-10">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="relative group">
                <item.icon
                  className={`w-7 h-7 transition-all hover:scale-110 ${
                    isActive(item.href)
                      ? "text-yellow-500"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                  }`}
                />
                {isActive(item.href) && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-yellow-500 rounded-full" />
                )}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile slide-out menu */}
        <div
          className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${theme === "dark" ? "bg-[#0F2A48]" : "bg-white"}`}
        >
          <div className="flex flex-col h-full">
            <div className={`p-8 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <svg width="56" height="45" viewBox="0 0 56 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32.7109 0.5H1.21094L23.2109 22.5L1.21094 44.5H32.7109L54.7109 22.5L32.7109 0.5Z"
                  fill="#D4AF37"
                  stroke="#302828"
                />
              </svg>
            </div>
            <nav className="flex-1 px-8 py-10 overflow-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-4 px-2 rounded-lg transition ${
                    isActive(item.href) ? "bg-yellow-500/10" : ""
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      isActive(item.href) ? "text-yellow-500" : theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isActive(item.href) ? "text-yellow-500" : theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main content area */}
        <main className="flex-1 py-8 px-1 lg:px-12 lg:pl-40 overflow-auto transition-all z-10">{children}</main>
      </div>
      {wave && theme !== "dark" && (
        <div className="hidden lg:block fixed inset-x-0 pointer-events-none bottom-8">
<svg
  width="100%"
  height="750"
  viewBox="0 0 1440 398"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMax slice"
  className="bottom-0 left-0 w-full"
  style={{ transform: "translateY(50%)" }}
>
  <g filter="url(#filter_blur_custom)">
    <path
      d="M257.401 6.13501C159.217 -39.3612 20.8919 179.369 -35.9975 294.42L1623.25 297.752L1557.25 91.4097C1524.23 138.209 1402.8 196.616 1181.25 55.8463C904.312 -120.116 1103.63 197.678 730.676 230.463C357.726 263.247 380.132 63.0053 257.401 6.13501Z"
      fill="url(#paint0_linear_converted)"
    />
  </g>

  <defs>
    <filter
      id="filter_blur_custom"
      x="-56"
      y="-40"
      width="1699.25"
      height="357.752"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur" />
    </filter>

    <linearGradient
      id="paint0_linear_converted"
      x1="1053.71"
      y1="-202.125"
      x2="1054.93"
      y2="611.484"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.45" stopColor="#AACEFF" stopOpacity="0.9" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>


        </div>
      )}
      {/* Bottom wave decoration */}
      {wave && theme === "dark" && (
        <div className="hidden lg:block fixed inset-x-0 pointer-events-none bottom-48">
<svg
  width="100%"
  height="750"
  viewBox="0 0 1440 398"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMax slice"
  className="bottom-0 left-0 w-full"
  style={{ transform: "translateY(50%)" }}
>
  <g filter="url(#filter_blur_custom_bottom)">
    <path
      d="M257.401 6.13501C159.217 -39.3612 20.8919 179.369 -35.9975 294.42L1623.25 297.752L1557.25 91.4097C1524.23 138.209 1402.8 196.616 1181.25 55.8463C904.312 -120.116 1103.63 197.678 730.676 230.463C357.726 263.247 380.132 63.0053 257.401 6.13501Z"
      fill="url(#paint0_linear_bottom_converted)"
    />
  </g>

  <defs>

    <filter
      id="filter_blur_custom_bottom"
      x="-56"
      y="-40"
      width="1699.25"
      height="357.752"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur" />
    </filter>

    <linearGradient
      id="paint0_linear_bottom_converted"
      x1="1053.71"
      y1="-222.125"
      x2="1054.93"
      y2="591.484"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#016BFF" stopOpacity="0.8" />
      <stop offset="1" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>

        </div>
      )}
    </div>
  )
}
