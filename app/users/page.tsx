"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MobileSearchBar } from "@/components/common/mobile-search-bar";
import { StatsCard } from "@/components/common/stats-card";
import { TabNavigation } from "@/components/common/tab-navigation";
import { FilterButtons } from "@/components/common/filter-buttons";
import { DataTable } from "@/components/common/data-table";
import { MobileListView } from "@/components/common/mobile-list-view";
import { useTheme } from "@/contexts/theme-context";
import { useUsers } from "@/hooks/use-users";
import Link from "next/link"

const tabs = ["All Users", "Active Users", "Pending Users", "Inactive Users"];
const filters = ["Status", "Role", "Date Range"];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("All Users");
  const { theme } = useTheme();
  const {
    users,
    stats,
    count,
    isLoading,
    isError,
    deleteUser,
  } = useUsers();

  // فیلتر کاربران بر اساس تب فعال
  const filteredUsers = useMemo(() => {
    switch (activeTab) {
      case "Active Users":
        return users.filter((u) => u.status === "Verified");
      case "Pending Users":
        return users.filter((u) => u.status.includes("Pending"));
      case "Inactive Users":
        return users.filter((u) => ["Rejected", "Inactive"].some(s => u.status.includes(s)));
      default:
        return users;
    }
  }, [users, activeTab]);

  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white";

  const statsItems = [
    { title: "Total Users", value: stats.total },
    { title: "Active Users", value: stats.active },
    { title: "Pending Users", value: stats.pending },
    { title: "Inactive Users", value: stats.inactive },
  ];

  const columns = [
    {
      key: "id",
      header: "User ID",
      render: (u: any) => `#${u.id}`,
    },
    {
      key: "name",
      header: "Name",
      render: (u: any) => <div className="font-medium">{u.name}</div>,
    },
    {
      key: "email",
      header: "Email",
      render: (u: any) => u.email,
    },
    {
      key: "role",
      header: "Role",
      render: (u: any) => (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full">
          {u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u: any) => {
        let badgeClass = "px-3 py-1 rounded-full text-xs font-medium";
        if (u.status === "Verified") {
          badgeClass += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        } else if (u.status.includes("Pending")) {
          badgeClass += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        } else {
          badgeClass += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        }
        return <span className={badgeClass}>{u.status}</span>;
      },
    },
    {
      key: "date",
      header: "Date Created",
      render: (u: any) => u.date,
    },
  ];

  const mobileListItems = filteredUsers.map((u) => ({
    id: u.id,
    title: u.name,
    subtitle: u.email,
    meta: [u.role, u.date],
    createdBy: u.role,
    status: u.status,
  }));

  if (isLoading) {
    return (
      <DashboardLayout title="Users Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-xl">
          Loading users...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Users Management" wave={true}>
        <div className="flex items-center justify-center h-96 text-red-500">
          Failed to load users
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <DashboardLayout title="Users Management" wave={true}>
      <MobileSearchBar />

       {/* Desktop Add Button */}
       <div className="hidden lg:flex justify-end relative z-10 mb-5">
          <Button asChild
            className={`text-lg rounded-lg font-medium shadow-md px-8 py-6 ${
              theme === "dark"
                ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Link href="/users/add" className="flex items-center">
              <Plus className="h-6 w-6 mr-2" />
              Add User
            </Link>
          </Button>
        </div>

        <div className="hidden lg:grid mb-8 mx-20 grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {statsItems.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="md:mx-10 mx-4 md:space-y-8 space-y-6 py-6 md:py-0">
            {/* Mobile Stats + Add Button */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
              {statsItems.map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} variant="compact" />
              ))}
              <div className="flex items-center justify-center h-24">
              <Button asChild
                  className={`text-md rounded-lg font-medium shadow-md px-6 py-5 ${
                    theme === "dark"
                      ? "bg-[#0F2A48] hover:bg-[#34495E] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Link href="/users/add" className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add User
                  </Link>
                </Button>
              </div>
            </div>

            {/* Desktop Header Section */}
            <div className="hidden lg:grid grid-cols-3 gap-6 items-center">

              <div className="flex items-center justify-between w-full">
                <h1
                  className={`text-4xl font-normal tracking-wide ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Users Management
                </h1>
              
              </div>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <FilterButtons filters={filters} />

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable
                data={filteredUsers}
                columns={columns as any}
                editRoute="/users/edit"
                // Actions ستون (Edit + Delete)
              />
            </div>

            {/* Mobile List View */}
            <MobileListView
              items={mobileListItems}
         
              editRoute="/users/edit"
         
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}