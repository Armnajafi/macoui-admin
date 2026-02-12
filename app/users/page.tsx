"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
const filterOptions = ["Status", "Role", "Date Range"];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    dateFrom: "",
    dateTo: "",
  });
  const { theme } = useTheme();
  const {
    users,
    stats,
    nextPage,
    previousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    deleteUser,
  } = useUsers();

  // فیلتر کاربران بر اساس تب فعال و فیلترهای انتخاب شده
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // فیلترینگ بر اساس تب
    switch (activeTab) {
      case "Active Users":
        filtered = filtered.filter((u) => u.status === "Verified");
        break;
      case "Pending Users":
        filtered = filtered.filter((u) => u.status.includes("Pending"));
        break;
      case "Inactive Users":
        filtered = filtered.filter((u) => ["Rejected", "Inactive"].some(s => u.status.includes(s)));
        break;
      default:
        break;
    }

    // فیلترینگ بر اساس فیلترهای انتخاب شده
    if (filters.status) {
      filtered = filtered.filter((u) => u.status === filters.status);
    }

    if (filters.role) {
      filtered = filtered.filter((u) => u.role === filters.role);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((u) => {
        const userDate = new Date(u.date);
        const fromDate = new Date(filters.dateFrom);
        return userDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((u) => {
        const userDate = new Date(u.date);
        const toDate = new Date(filters.dateTo);
        return userDate <= toDate;
      });
    }

    return filtered;
  }, [users, activeTab, filters]);

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
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 
        text-black rounded-full">
          {u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u: any) => {
        let badgeClass = "w-100 px-3 py-1 rounded-full text-xs font-medium";
        if (u.status === "Verified") {
          badgeClass += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        } else if (u.status.includes("Pending")) {
          u.status = "Pending"
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

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setFilterDialogOpen(true);
  };

  const handleFilterApply = () => {
    setFilterDialogOpen(false);
    setActiveFilter(null);
  };

  const handleFilterClear = (filterType: string) => {
    setFilters(prev => ({ ...prev, [filterType]: "" }));
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
            <FilterButtons filters={filterOptions} onFilterClick={handleFilterClick} />

            {/* Active Filters Display */}
            {(filters.status || filters.role || filters.dateFrom || filters.dateTo) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterClear("status")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.role && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Role: {filters.role}
                    <button
                      onClick={() => handleFilterClear("role")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.dateFrom || filters.dateTo) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Date: {filters.dateFrom || "..."} to {filters.dateTo || "..."}
                    <button
                      onClick={() => {
                        handleFilterClear("dateFrom");
                        handleFilterClear("dateTo");
                      }}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden md:block">
              <DataTable
                data={filteredUsers}
                columns={columns as any}
                editRoute="/users/edit"
                pagination={{
                  totalCount: stats.total,
                  nextPage,
                  previousPage,
                  onNextPage: goToNextPage,
                  onPreviousPage: goToPreviousPage,
                  isLoading,
                }}
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Filter by {activeFilter}
              {(filters.status || filters.role || filters.dateFrom || filters.dateTo) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    if (activeFilter === "Status") handleFilterClear("status");
                    if (activeFilter === "Role") handleFilterClear("role");
                    if (activeFilter === "Date Range") {
                      handleFilterClear("dateFrom");
                      handleFilterClear("dateTo");
                    }
                  }}
                >
                  Clear
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {activeFilter === "Status" && (
              <div className="space-y-2">
                <Label htmlFor="status-select">Select Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending Profile Completion">Pending to Complete</SelectItem>
                    <SelectItem value="Pending Approval Request">Pending to Approve</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Role" && (
              <div className="space-y-2">
                <Label htmlFor="role-select">Select Role</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Registered User">Registered User</SelectItem>
                    <SelectItem value="Verified User">Verified User</SelectItem>
                    <SelectItem value="Viewer Only">Viewer Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeFilter === "Date Range" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-from">From Date</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to">To Date</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFilterApply}>
              Apply Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
