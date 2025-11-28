"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Ship, FileCheck, UserPlus, Package, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { useTheme } from "@/contexts/theme-context"
import { useDashboard } from "@/hooks/use-dashboard"

const iconMap = {
  Ship,
  FileCheck,
  UserPlus,
  Package,
}

export default function DashboardPage() {
  const [latestOpen, setLatestOpen] = useState(true)
  const [pendingOpen, setPendingOpen] = useState(true)
  const [trafficOpen, setTrafficOpen] = useState(true)
  const [systemOpen, setSystemOpen] = useState(true)
  const [quickOpen, setQuickOpen] = useState(true)

  const { theme } = useTheme()
  const { stats, activities, traffic, pendingItems } = useDashboard()

  const cardBg = theme === "dark" ? "bg-[#0F2A48]" : "bg-white"
  const textColor = theme === "dark" ? "text-white" : "text-slate-900"
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-slate-600"

  return (
    <DashboardLayout title="Dashboard" wave={true}>
      <div className="mx-4">
        <div className="space-y-6">
          {/* Search Bar test*/}
          <MobileSearchBar />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className={`${cardBg} border-0 shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm lg:text-base ${textSecondary}`}>Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl lg:text-4xl font-bold text-[#F2E7C3]">{stats.activeProjects}</p>
              </CardContent>
            </Card>

            <Card className={`${cardBg} border-0 shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm lg:text-base ${textSecondary}`}>Pending Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl lg:text-4xl font-bold text-[#F2E7C3]">{stats.pendingProjects}</p>
              </CardContent>
            </Card>

            <Card className={`${cardBg} border-0 shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm lg:text-base ${textSecondary}`}>Brokers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl lg:text-4xl font-bold text-[#F2E7C3]">{stats.brokers}</p>
              </CardContent>
            </Card>

            <Card className={`${cardBg} border-0 shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm lg:text-base ${textSecondary}`}>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl lg:text-4xl font-bold text-[#F2E7C3]">{stats.newUsers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-6">
            {/* Latest Activities & Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Activities */}
              <Card className={`${cardBg} border-0 shadow-lg`}>
                <CardHeader>
                  <CardTitle className={textColor}>Latest Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {activities.map((item, idx) => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Ship
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="bg-[#306ABC] p-2.5 rounded-full flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${textColor}`}>{item.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Traffic Chart */}
              <Card className={`${cardBg} border-0 shadow-md`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className={textColor}>Traffic</CardTitle>
                  <span className="text-3xl text-[#F2E7C3] font-bold">2,350</span>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={traffic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                      <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row: Pending + System + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Items */}
              <Card className={`${cardBg} border-0 shadow-lg`}>
                <CardHeader className="pb-4">
                  <CardTitle className={textColor}>Pending Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className={textSecondary}>Projects to Verify</span>
                    <span className={`text-2xl font-bold ${textColor}`}>{pendingItems.projectsToVerify}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textSecondary}>Brokers to Verify</span>
                    <span className={`text-2xl font-bold ${textColor}`}>{pendingItems.brokersToVerify}</span>
                  </div>
                </CardContent>
              </Card>

              {/* System Health + Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* System Health */}
                <Card className={`${cardBg} border-0 shadow-lg`}>
                  <CardHeader>
                    <CardTitle className={textColor}>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className={textColor}>Errors</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className={textColor}>Maintenance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className={textColor}>Notifications</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className={`${cardBg} border-0 shadow-lg`}>
                  <CardHeader>
                    <CardTitle className={textColor}>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {["+ Add Broker", "+ Add Broker", "+ Add Broker", "+ Add Product"].map((txt, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        className={`w-full justify-start ${
                          theme === "dark"
                            ? "bg-[#1A365D] hover:bg-[#475569] text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                        }`}
                      >
                        {txt}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Collapsible Sections */}
          <div className="lg:hidden space-y-4">
            {/* Latest Activities - Collapsible */}
            <Collapsible open={latestOpen} onOpenChange={setLatestOpen}>
              <Card className={`${cardBg} border-0 shadow-lg py-1`}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <CardTitle className={textColor}>Latest Activities</CardTitle>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${latestOpen ? "rotate-180" : ""} ${textColor}`}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-5">
                  <CardContent className="space-y-5 pt-0">
                    {activities.map((item, idx) => {
                      const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Ship
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="bg-[#306ABC] p-2.5 rounded-full flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${textColor}`}>{item.text}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                        </div>
                      )
                    })}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Pending Items - Collapsible */}
            <Collapsible open={pendingOpen} onOpenChange={setPendingOpen}>
              <Card className={`${cardBg} border-0 shadow-lg py-1`}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <CardTitle className={textColor}>Pending Items</CardTitle>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${pendingOpen ? "rotate-180" : ""} ${textColor}`}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-5">
                  <CardContent className="space-y-5 pt-0">
                    <div className="flex justify-between items-center">
                      <span className={textSecondary}>Projects to Verify</span>
                      <span className={`text-2xl font-bold ${textColor}`}>{pendingItems.projectsToVerify}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={textSecondary}>Brokers to Verify</span>
                      <span className={`text-2xl font-bold ${textColor}`}>{pendingItems.brokersToVerify}</span>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Traffic - Collapsible */}
            <Collapsible open={trafficOpen} onOpenChange={setTrafficOpen}>
              <Card className={`${cardBg} border-0 shadow-md py-1`}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <CardTitle className={textColor}>Traffic</CardTitle>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${trafficOpen ? "rotate-180" : ""} ${textColor}`}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="text-3xl text-[#F2E7C3] font-bold mb-4">2,350</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={traffic}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                        <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <div className="grid grid-cols-2 gap-4">
              {/* System Health - Collapsible */}
              <Collapsible open={systemOpen} onOpenChange={setSystemOpen}>
                <Card className={`${cardBg} border-0 shadow-lg py-1`}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <CardTitle className={textColor}>System Health</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${systemOpen ? "rotate-180" : ""} ${textColor}`}
                      />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-5">
                    <CardContent className="space-y-6 pt-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className={textColor}>Errors</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className={textColor}>Maintenance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className={textColor}>Notifications</span>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Quick Actions - Collapsible */}
              <Collapsible open={quickOpen} onOpenChange={setQuickOpen}>
                <Card className={`${cardBg} border-0 shadow-lg py-1`}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <CardTitle className={textColor}>Quick Actions</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${quickOpen ? "rotate-180" : ""} ${textColor}`}
                      />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pb-5">
                    <CardContent className="space-y-2 pt-0">
                      {["+ Add Broker", "+ Add Broker", "+ Add Broker", "+ Add Product"].map((txt, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          className={`w-full justify-start ${
                            theme === "dark"
                              ? "bg-[#1A365D] hover:bg-[#475569] text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                          }`}
                        >
                          {txt}
                        </Button>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
