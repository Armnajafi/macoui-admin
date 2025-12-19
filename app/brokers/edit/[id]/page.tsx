// app/dashboard/brokers/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useBrokers, type Broker } from "@/hooks/use-brokers";

export default function EditBrokerPage() {
  const router = useRouter();
  const { id } = useParams(); // broker id from URL
  const { brokers, isLoading: hookLoading } = useBrokers();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [broker, setBroker] = useState<Broker | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    country: "",
    notes: "",
    status: "Pending" as "Approved" | "Pending" | "Rejected",
    profile_image: null as string | null,
  });

  const steps = [
    { id: 1, name: "Personal Info" },
    { id: 2, name: "Company & Contact" },
    { id: 3, name: "Additional Details" },
  ];

  // Load broker data when component mounts
  useEffect(() => {
    if (brokers.length > 0 && id) {
      const foundBroker = brokers.find((b) => b.id.toString() === id.toString());
      if (foundBroker) {
        setBroker(foundBroker);
        setFormData({
          name: foundBroker.name || "",
          company: foundBroker.company || "",
          email: foundBroker.email || "",
          phone: foundBroker.phone || "",
          location: foundBroker.location || "",
          country: foundBroker.location || "", // fallback to location if country not separate
          notes: foundBroker.notes || "",
          status: foundBroker.status,
          profile_image: null, // if you have image URL in future, add it here
        });
      } else {
        alert("Broker not found");
        router.push("/dashboard/brokers");
      }
    }
  }, [brokers, id, router]);

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountryChange = (value: string) => {
    handleInputChange("country", value);
    if (!formData.location) {
      handleInputChange("location", value);
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      alert("Please enter the broker's full name");
      return false;
    }
    if (!formData.country) {
      alert("Please select a country");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (currentStep === 1 && !validateStep1()) return;

    if (currentStep === 3) {
      await handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);

    try {
      const updatedData = {
        name: formData.name,
        company: formData.company || undefined,
        location: formData.location || formData.country,
        status: formData.status,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        notes: formData.notes || undefined,
      };

      // Assuming updateBroker exists in your hook (PATCH to /api/brokerage/admin/ships/<id>/)
      // @ts-ignore
      const result = await updateBroker(id, updatedData);

      if (result?.success !== false) {
        alert("Broker updated successfully.");
        router.push("/dashboard/brokers");
      } else {
        alert(result?.message || "Failed to update broker.");
      }
    } catch (error) {
      console.error("Error updating broker:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  if (hookLoading || !broker) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A365D]" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Edit Broker Profile
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Update broker information and approval status
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
              className="absolute top-12 left-0 h-px bg-[#1A365D] transition-all duration-500 ease-in-out -translate-y-1/2 origin-left rounded-r-full"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="relative flex justify-between items-center">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? "text-[#1A365D] font-semibold"
                      : "text-gray-400 font-medium"
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

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Personal Information</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      className="mt-2 h-12"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-base font-medium">
                      Country *
                    </Label>
                    <Select value={formData.country} onValueChange={handleCountryChange}>
                      <SelectTrigger id="country" className="mt-2 h-12">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Netherlands">Netherlands</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="South Korea">South Korea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base font-medium">
                      Approval Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value as any)}
                    >
                      <SelectTrigger id="status" className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending Approval</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-7">
                  <div>
                    <Label htmlFor="location" className="text-base font-medium">
                      City / Port Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="London, Singapore, Rotterdam"
                      className="mt-2 h-12"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company & Contact */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Company & Contact Details</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="company" className="text-base font-medium">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      placeholder="Maritime Brokers Ltd"
                      className="mt-2 h-12"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@maritimebrokers.com"
                      className="mt-2 h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-7">
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+44 20 1234 5678"
                      className="mt-2 h-12"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Additional Information</h3>

              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <Label htmlFor="notes" className="text-base font-medium">
                    Notes / Specializations
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g., Specializes in tanker chartering, S&P of dry bulk vessels, newbuilding supervision..."
                    rows={10}
                    className="mt-4 resize-none"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                {/* Summary Preview */}
                <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Updated Broker Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Company:</p>
                      <p className="font-medium">{formData.company || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Country:</p>
                      <p className="font-medium">{formData.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location:</p>
                      <p className="font-medium">{formData.location || formData.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <p className="font-medium">{formData.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{formData.email || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="px-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === 3 ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/dashboard/brokers")}
                  disabled={isLoading}
                  className="px-8"
                >
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="bg-[#1A365D] hover:bg-[#152a4a] px-10"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}