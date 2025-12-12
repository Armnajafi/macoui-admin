// app/users/edit/[id]/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ChevronLeft, ChevronRight, Save, Loader2, UserPlus } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useUsers } from "@/hooks/use-users";

const steps = [
  { id: 1, name: "Account Information" },
  { id: 2, name: "Personal Details" },
  { id: 3, name: "Access & Permissions" },
];

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const { users, updateUser, isLoading: isHookLoading } = useUsers();

  const user = users.find(u => u.id === id);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    country: "",
    gender: "" as "M" | "F" | "",
    role: "" as "AD" | "RE" | "VE" | "VI",
    status: "" as "PPC" | "V" | "R" | "PAR",
  });

  // پر کردن فرم وقتی کاربر لود شد
  useEffect(() => {
    if (!id || !users.length) return;
  
    const currentUser = users.find(u => u.id === id);
    if (!currentUser) return;
  
    setFormData({
      email: currentUser.email,
      first_name: currentUser.name.split(" ")[0] || "",
      last_name: currentUser.name.split(" ").slice(1).join(" ") || "",
      phone: currentUser.phone || "",
      country: currentUser.country || "",
      gender: "" as any,
      role: currentUser.role === "Admin" ? "AD" :
            currentUser.role === "Registered" ? "RE" :
            currentUser.role === "Verified" ? "VE" : "VI",
      status: currentUser.status.includes("Pending") ? "PPC" :
              currentUser.status === "Verified" ? "V" :
              currentUser.status === "Rejected" ? "R" :
              currentUser.status.includes("Approval") ? "PAR" : "PPC",
    });
  }, []); // فقط یک بار!
  const nextStep = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    const payload: any = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || null,
      country: formData.country ? Number(formData.country) : null,
      role: formData.role,
      status: formData.status,
    };

    const result = await updateUser(id as string, payload);

    setIsLoading(false);

    if (result.success) {
      alert("User updated successfully!");
      router.push("/users");
    } else {
      alert(result.message || "Failed to update user");
    }
  };

  if (isHookLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-600">
        User not found
      </div>
    );
  }

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Edit User
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Update user information and permissions
          </p>
        </div>
      </div>

      {/* Progress + Form */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-16">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-x-0 top-12 h-px bg-gray-300 -translate-y-1/2" />
            <div
              className="absolute top-12 left-0 h-px bg-[#1A365D] transition-all duration-500 -translate-y-1/2 origin-left rounded-r-full"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="relative flex justify-between items-center">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center transition-all duration-300 ${
                    currentStep >= step.id ? "text-[#1A365D] font-semibold" : "text-gray-400 font-medium"
                  }`}
                >
                  <span className="text-lg">
                    {step.id}/ {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* همون ۳ استپ مثل Add، فقط بدون پسورد */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Account Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      className="mt-2 h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      className="mt-2 h-12"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-2">Password cannot be changed from here</p>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <UserPlus className="w-24 h-24 text-[#1A365D] mx-auto mb-4" />
                    <p className="text-gray-600">Account details</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Personal Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      className="mt-2 h-12"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      className="mt-2 h-12"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+989123456789"
                      className="mt-2 h-12"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-7">
                  <div>
                    <Label>Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="104">Iran</SelectItem>
                        <SelectItem value="1">United States</SelectItem>
                        <SelectItem value="44">United Kingdom</SelectItem>
                        <SelectItem value="65">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Access & Permissions</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <Label>User Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AD">Admin</SelectItem>
                      <SelectItem value="RE">Registered User</SelectItem>
                      <SelectItem value="VE">Verified User</SelectItem>
                      <SelectItem value="VI">Viewer Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PPC">Pending Profile Completion</SelectItem>
                      <SelectItem value="V">Verified</SelectItem>
                      <SelectItem value="R">Rejected</SelectItem>
                      <SelectItem value="PAR">Pending Approval Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4">User Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Name:</span> {formData.first_name} {formData.last_name}</div>
                  <div><span className="text-gray-600">Email:</span> {formData.email}</div>
                  <div><span className="text-gray-600">Role:</span> {formData.role ? roleMap[formData.role] : "—"}</div>
                  <div><span className="text-gray-600">Status:</span> {formData.status ? statusMap[formData.status] : "—"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="outline" size="lg" onClick={prevStep} disabled={currentStep === 1 || isLoading}>
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === 3 ? (
              <>
                <Button variant="outline" size="lg" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 px-10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update User
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={nextStep}
                className="bg-[#1A365D] hover:bg-[#152a4a] px-10"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// مپ نقش و وضعیت برای نمایش
const roleMap: Record<string, string> = {
  AD: "Admin",
  RE: "Registered User",
  VE: "Verified User",
  VI: "Viewer Only",
};

const statusMap: Record<string, string> = {
  PPC: "Pending Profile Completion",
  V: "Verified",
  R: "Rejected",
  PAR: "Pending Approval Request",
};