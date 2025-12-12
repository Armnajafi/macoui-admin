// app/dashboard/users/add/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Save, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useUsers } from "@/hooks/use-users"

export default function AddUserPage() {
  const router = useRouter()
  const { createUser } = useUsers()
  
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    department: "",
    role: "Viewer" as "Admin" | "Editor" | "Viewer" | string,
    status: "Active" as "Active" | "Inactive" | "Pending" | string,
    permissions: [] as string[],
    notes: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // اعتبارسنجی
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in required fields: Name and Email")
      return
    }

    setIsLoading(true)
    
    try {
      const result = await createUser(formData)
      
      if (result.success) {
        alert(result.message)
        router.push("/dashboard/users")
      } else {
        alert(result.message)
      }
    } catch (error: any) {
      console.error("Error creating user:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Add New User" wave={false}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="hidden sm:flex"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New User
            </h1>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="mt-2 h-12"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="mt-2 h-12"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+1 234 567 8900"
                  className="mt-2 h-12"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-base font-medium">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Company Name"
                  className="mt-2 h-12"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-base font-medium">
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Department"
                  className="mt-2 h-12"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-base font-medium">
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger id="role" className="mt-2 h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-base font-medium">
                  Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status" className="mt-2 h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <Label className="text-base font-medium block mb-3">
                Permissions
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["read", "write", "delete", "manage_users"].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`permission-${permission}`}
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label
                      htmlFor={`permission-${permission}`}
                      className="text-sm font-normal capitalize"
                    >
                      {permission.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this user..."
                rows={4}
                className="mt-2"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}