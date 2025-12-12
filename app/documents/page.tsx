"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MobileSearchBar } from "@/components/common/mobile-search-bar";
import { StatsCard } from "@/components/common/stats-card";
import { TabNavigation } from "@/components/common/tab-navigation";
import { FilterButtons } from "@/components/common/filter-buttons";
import { DataTable } from "@/components/common/data-table";
import { MobileListView } from "@/components/common/mobile-list-view";
import { useTheme } from "@/contexts/theme-context";
import { useDocuments } from "@/hooks/use-documents";
import Link from "next/link";

const tabs = ["All Documents", "Active", "Archive"];
const filters = ["Activity", "Type", "Date Range"];

export default function DocumentManagementPage() {
  const [activeTab, setActiveTab] = useState("All Documents");
  const { theme } = useTheme();
  const { documents, stats, count, isLoading, isError } = useDocuments();

  // Filter documents based on selected tab
  const filteredDocuments = useMemo(() => {
    if (activeTab === "Active") return documents.filter((d) => d.status === "Active");
    if (activeTab === "Archive") return documents.filter((d) => d.status === "Archive");
    return documents;
  }, [documents, activeTab]);

  const cardBg =
    theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white";

  const statsItems = [
    { title: "Total Documents", value: stats.total },
    { title: "Active", value: stats.active },
    { title: "Archive", value: stats.archive },
  ];

  const columns = [
    {
      key: "id",
      header: "Document ID",
      render: (d: any) => `#${d.id}`,
    },
    {
      key: "title",
      header: "Title",
      render: (d: any) => <div className="font-medium">{d.title}</div>,
    },
    {
      key: "activity",
      header: "Activity",
      render: (d: any) => d.activity,
    },
    {
      key: "type",
      header: "Type",
      render: (d: any) => (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded">
          {d.type}
        </span>
      ),
    },
    {
      key: "author",
      header: "Uploaded By",
      render: (d: any) => d.author,
    },
    {
      key: "status",
      header: "Status",
      render: (d: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            d.status === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {d.status}
        </span>
      ),
    },
    {
      key: "date",
      header: "Last Updated",
      render: (d: any) => d.date,
    },
  ];

  const mobileListItems = filteredDocuments.map((d) => ({
    id: d.id,
    title: d.title,
    subtitle: d.activity,
    meta: [d.type, d.date],
    createdBy: d.author,
    status: d.status,
    // Optional: show file/link icon based on type
    icon: d.type === "LINK" ? "Link" : "FileText",
  }));

  if (isLoading) {
    return (
      <DashboardLayout title="Document Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-xl">
          Loading documents...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Document Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-red-500">
          Failed to load documents
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Document Management" wave={true}>
      <MobileSearchBar />

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Desktop Add Button */}
        <div className="hidden lg:flex justify-end relative z-10">
          <Button
            asChild
            className={`text-lg rounded-lg font-medium shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Link href="/documents/add" className="flex items-center">
              <Plus className="h-6 w-6 mr-2" />
              Add Document
            </Link>
          </Button>
        </div>

        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats + Add Button */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="flex items-center justify-center h-24">
                <Button
                  asChild
                  className={`text-md rounded-lg font-medium shadow-md px-6 py-5 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Link href="/documents/add" className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Document
                  </Link>
                </Button>
              </div>
            </div>

            {/* Desktop Header + Stats */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Document Management
                </h1>
  
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {statsItems.map((s) => (
                  <StatsCard key={s.title} title={s.title} value={s.value} />
                ))}
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable data={filteredDocuments} columns={columns as any} editRoute="/documents/edit/"/>
            </div>

            {/* Mobile List */}
            <MobileListView items={mobileListItems} editRoute="/documents/edit/"/>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}