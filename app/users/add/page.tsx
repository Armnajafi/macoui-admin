// app/users/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useCountries } from "@/hooks/use-countries";

const steps = [
  { id: 1, name: "Account Information" },
  { id: 2, name: "Personal Details" },
  { id: 3, name: "Access & Permissions" },
];

export default function AddUserPage() {
  const router = useRouter();
  const { createUser } = useUsers();
  const { countries, isLoading: countriesLoading } = useCountries();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    country: "",
    gender: "" as "M" | "F" | "",
    role: "" as "AD" | "RE" | "VE" | "VI",
    status: "PPC" as "PPC" | "V" | "R" | "PAR",
    preferred_language: "en",
  });

  const nextStep = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.email.trim()) return alert("Email is required");
    if (!formData.password) return alert("Password is required");
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
    if (formData.password.length < 8) return alert("Password must be at least 8 characters");
    return true;
  };

  const validateStep2 = () => {
    if (!formData.first_name.trim()) return alert("First name is required");
    if (!formData.last_name.trim()) return alert("Last name is required");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) return;

    setIsLoading(true);

    const result = await createUser({
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
      country: formData.country ? Number(formData.country) : undefined,
      gender: formData.gender || undefined,
      role: formData.role,
      status: formData.status,
      preferred_language: formData.preferred_language,
    });

    setIsLoading(false);

    if (result) {
      alert("User created successfully!");
      router.push("/users");
    } else {
      alert("Failed to create user");
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Add New User
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Create a new account for the maritime management platform
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
          {/* Step 1: Account Info */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Account Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      className="mt-2 h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="mt-2 h-12"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      className="mt-2 h-12"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <UserPlus className="w-24 h-24 text-[#1A365D] mx-auto mb-4" />
                    <p className="text-gray-600">Enter login credentials</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Personal Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      className="mt-2 h-12"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      className="mt-2 h-12"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+989123456789"
                      className="mt-2 h-12"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                      disabled={countriesLoading}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select country"} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={String(country.id)}>
                            {country.name} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: "M" | "F") => handleInputChange("gender", value)}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Role & Status */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Access & Permissions</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "AD" | "RE" | "VE" | "VI") => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select role" />
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
                  <Label htmlFor="status">Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "PPC" | "V" | "R" | "PAR") => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select status" />
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
                  <div><span className="text-gray-600">Role:</span> {formData.role ? roleMap[formData.role] : "Not set"}</div>
                  <div><span className="text-gray-600">Status:</span> {formData.status ? statusMap[formData.status] : "Not set"}</div>
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
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 px-10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  if (currentStep === 1 && !validateStep1()) return;
                  if (currentStep === 2 && !validateStep2()) return;
                  nextStep();
                }}
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