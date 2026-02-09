// app/dashboard/brokers/edit/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

export default function EditShipPage() {
  const router = useRouter();
  const { id } = useParams(); // broker id from URL
  const { brokers, updateBrokerStatus, isLoading: hookLoading } = useBrokers();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [broker, setBroker] = useState<Broker | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const initializedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    ship_type: "",
    location_country: "",
    location_port: "",
    status: "for_sale" as "for_sale" | "sold",
    description: "",
  });

  const steps = [
    { id: 1, name: "Ship Details" },
    { id: 2, name: "Location & Status" },
    { id: 3, name: "Additional Info" },
  ];

  // Load broker data when component mounts
  useEffect(() => {
    if (!initializedRef.current && !hookLoading && id && brokers.length > 0) {
      initializedRef.current = true;
      const foundBroker = brokers.find((b) => b.id.toString() === id.toString());
      if (foundBroker) {
        setBroker(foundBroker);
        setFormData({
          name: foundBroker.name || "",
          ship_type: foundBroker.ship_type || "",
          location_country: foundBroker.location_country_name || "",
          location_port: foundBroker.location_port || "",
          status: foundBroker.status,
          description: foundBroker.description || "",
        });
        setIsInitializing(false);
      } else {
        alert("Ship not found");
        router.push("/brokers");
      }
    } else if (!hookLoading) {
      setIsInitializing(false);
    }
  }, [hookLoading, id, brokers, router]);

  const nextStep = useCallback(() => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleInputChange = useCallback((field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);


  const validateStep1 = useCallback(() => {
    if (!formData.name.trim()) {
      alert("Please enter the ship name");
      return false;
    }
    return true;
  }, [formData.name]);
  const handleSubmit = useCallback(async () => {
    if (!validateStep1()) return;

    setIsLoading(true);

    try {
      await updateBrokerStatus(id as string, formData.status);

      alert("Ship updated successfully.");
      router.push("/brokers");
    } catch (error) {
      console.error("Error updating ship:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id, formData.status, updateBrokerStatus, router]);
  
  const handleSaveDraft = useCallback(async () => {
    if (currentStep === 1 && !validateStep1()) return;

    if (currentStep === 3) {
      await handleSubmit();
    } else {
      nextStep();
    }
  }, [currentStep, validateStep1, handleSubmit, nextStep]);



  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  if (hookLoading || isInitializing || !broker) {
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
            Edit Ship Details
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Update ship information and status
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
          {/* Step 1: Ship Details */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Ship Information</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">
                      Ship Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Bulk Carrier ABC"
                      className="mt-2 h-12"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ship_type" className="text-base font-medium">
                      Ship Type
                    </Label>
                    <Select
                      value={formData.ship_type}
                      onValueChange={(value) => handleInputChange("ship_type", value)}
                    >
                      <SelectTrigger id="ship_type" className="mt-2 h-12">
                        <SelectValue placeholder="Select ship type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cargo">Cargo</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                        <SelectItem value="bulk">Bulk Carrier</SelectItem>
                        <SelectItem value="container">Container Ship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-7">
                  <div>
                    <Label htmlFor="location_country" className="text-base font-medium">
                      Country
                    </Label>
                    <Input
                      id="location_country"
                      placeholder="Iran, Singapore, etc."
                      className="mt-2 h-12"
                      value={formData.location_country}
                      onChange={(e) => handleInputChange("location_country", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location_port" className="text-base font-medium">
                      Port Location
                    </Label>
                    <Input
                      id="location_port"
                      placeholder="Bandar Abbas, Singapore, Rotterdam"
                      className="mt-2 h-12"
                      value={formData.location_port}
                      onChange={(e) => handleInputChange("location_port", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Status */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Location & Status</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="status" className="text-base font-medium">
                      Ship Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value as any)}
                    >
                      <SelectTrigger id="status" className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for_sale">For Sale</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-7">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Current Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Country: {formData.location_country || "Not set"}</p>
                      <p>Port: {formData.location_port || "Not set"}</p>
                      <p>Type: {formData.ship_type || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Additional Information</h3>

              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Ship Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the ship, specifications, condition, etc."
                    rows={10}
                    className="mt-4 resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                {/* Summary Preview */}
                <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Updated Ship Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type:</p>
                      <p className="font-medium">{formData.ship_type || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Country:</p>
                      <p className="font-medium">{formData.location_country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Port:</p>
                      <p className="font-medium">{formData.location_port || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <p className="font-medium">{formData.status === "for_sale" ? "For Sale" : "Sold"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Description:</p>
                      <p className="font-medium">{formData.description ? "Set" : "Not set"}</p>
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