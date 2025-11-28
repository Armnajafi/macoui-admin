"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { CustomSwitch } from "@/components/ui/custom-switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useTheme } from "@/contexts/theme-context"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const { theme, setTheme } = useTheme()

  return (
    <DashboardLayout title="Settings" wave={false}>
      <div className="mx-4 lg:mx-0">
        {/* Search Bar - Mobile Only */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              className={`w-full pl-12 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                theme === "dark"
                  ? "bg-transparent text-white placeholder:text-gray-400 border-white/60 focus:border-blue-500"
                  : "bg-white text-slate-900 placeholder:text-gray-500 border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Main Settings Card */}
        <div
          className={`rounded-2xl p-6 lg:p-8 shadow-lg ${
            theme === "dark" ? "bg-[#0F2A48]/80" : "bg-white border border-gray-200"
          }`}
        >
          {/* General Settings */}
          <div className="mb-8">
            <h2 className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              General Settings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language */}
              <div>
                <Label className={`mb-2 block ${theme === "dark" ? "text-gray-300" : "text-slate-600"}`}>
                  Language
                </Label>
                <Select defaultValue="english">
                  <SelectTrigger
                    className={`w-full lg:w-80 border-0 ${
                      theme === "dark" ? "bg-[#002340] text-white" : "bg-gray-100 text-slate-900"
                    }`}
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className={`border-0 ${theme === "dark" ? "bg-[#002340]" : "bg-white"}`}>
                    <SelectItem value="english" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      English
                    </SelectItem>
                    <SelectItem value="persian" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      فارسی
                    </SelectItem>
                    <SelectItem value="arabic" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      العربية
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timezone */}
              <div>
                <Label className={`mb-2 block ${theme === "dark" ? "text-gray-300" : "text-slate-600"}`}>
                  Timezone
                </Label>
                <Select defaultValue="tehran">
                  <SelectTrigger
                    className={`w-full lg:w-80 border-0 ${
                      theme === "dark" ? "bg-[#002340] text-white" : "bg-gray-100 text-slate-900"
                    }`}
                  >
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className={`border-0 ${theme === "dark" ? "bg-[#002340]" : "bg-white"}`}>
                    <SelectItem value="utc" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      (GMT +00:00) UTC
                    </SelectItem>
                    <SelectItem value="tehran" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      (GMT +03:30) Tehran
                    </SelectItem>
                    <SelectItem value="dubai" className={theme === "dark" ? "text-white hover:bg-[#2A4A6D]" : "text-slate-900 hover:bg-gray-100"}>
                      (GMT +04:00) Dubai
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className={`my-8 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} />

          {/* Notification Settings */}
          <div className="mb-8">
            <h2 className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Notification Settings
            </h2>

            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className={theme === "dark" ? "text-white" : "text-slate-900"}>Push Notifications</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                    Receive push notifications on your device
                  </p>
                </div>
                <CustomSwitch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={theme === "dark" ? "text-white" : "text-slate-900"}>Email Alerts</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                    Receive email alerts for important updates
                  </p>
                </div>
                <CustomSwitch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={theme === "dark" ? "text-white" : "text-slate-900"}>Auto-Save</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                    Automatically save your work
                  </p>
                </div>
                <CustomSwitch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
          </div>

          <hr className={`my-8 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} />

          {/* Theme + Security Settings - Side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Selection */}
            <div>
              <h2 className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Theme
              </h2>
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as "light" | "dark")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="border-gray-400 text-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label
                    htmlFor="light"
                    className={`cursor-pointer ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
                  >
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="border-gray-400 text-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label
                    htmlFor="dark"
                    className={`cursor-pointer ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
                  >
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Account & Security Actions */}
            <div>
              <h2 className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Account Settings
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Change Password
                </button>

                <button
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                    theme === "dark"
                      ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                      : "bg-red-100 hover:bg-red-200 text-red-600"
                  }`}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}