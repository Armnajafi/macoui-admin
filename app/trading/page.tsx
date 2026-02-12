"use client"

import Link from "next/link"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

const sections = [
  {
    title: "Products",
    description: "Manage trading products, create new listings, update pricing and upload files.",
    href: "/trading/products",
  },
  {
    title: "Quotation Requests",
    description: "Review all quotation requests and update quote status, price, and admin notes.",
    href: "/trading/quotations",
  },
  {
    title: "Custom Orders",
    description: "Track custom orders, match products, and manage order workflow.",
    href: "/trading/custom-orders",
  },
]

export default function TradingHomePage() {
  const { theme } = useTheme()

  return (
    <DashboardLayout title="Trading Management" wave>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {sections.map((section) => (
          <Card
            key={section.href}
            className={`p-6 shadow-md border-0 ${theme === "dark" ? "bg-[#0F2A48]" : "bg-white"}`}
          >
            <h2 className={`text-2xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {section.title}
            </h2>
            <p className={`mb-6 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>{section.description}</p>
            <Button asChild className={theme === "dark" ? "bg-[#1A365D] hover:bg-[#25466f]" : "bg-blue-600 hover:bg-blue-700"}>
              <Link href={section.href}>Open section</Link>
            </Button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
