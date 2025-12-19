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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Save, Loader2, Upload } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
// اگر هوک مخصوص activities دارید جایگزین کنید
// import { useActivities } from "@/hooks/use-activities";

export default function AddActivityPage() {
  const router = useRouter();
  // const { createActivity } = useActivities();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- فرم ----------
  const [formData, setFormData] = useState({
    brokerName: "",
    email: "",
    mobile: "",
    locationPort: "",
    companyName: "",
    experienceLevel: "",
    // step2
    areasOfExpertise: [] as string[],
    activeProjects: "",
    chartering: false,
    salePurchase: false,
    shipManagement: false,
    commissionRate: "",
    // step3
    profileImage: null as string | null,
    certificateFile: null as string | null,
  });

  const steps = [
    { id: 1, name: "General Info" },
    { id: 2, name: "Brokerage Details" },
    { id: 3, name: "Attachment & Media" },
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // آپلود تصویر پروفایل
  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange("profileImage", reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // آپلود فایل PDF/FOC
  const handleCertificateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange("certificateFile", reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // اعتبارسنجی ساده استپ۱
  const validateStep1 = () => {
    if (!formData.brokerName.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      alert("Please fill required fields.");
      return false;
    }
    return true;
  };

  // ذخیره نهایی
  const handleSubmit = async () => {
    if (!validateStep1()) return;
    setIsLoading(true);
    try {
      // const res = await createActivity(formData);
      // if (res.success) router.push("/activities");
      alert("Activity Created! (mock)");
      router.push("/activities");
    } catch (err) {
      console.error(err);
      alert("Error creating activity.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Add New Broker Activity
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Create a new broker profile for the maritime marketplace
          </p>
        </div>
      </div>

      {/* Progress + Form */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* نوار پیشرفت */}
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

        {/* فرم */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Step 1 – General Info */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">General Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div>
                  <Label>Broker Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    className="mt-2 h-12"
                    value={formData.brokerName}
                    onChange={(e) => handleInputChange("brokerName", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="example@domain.com"
                    className="mt-2 h-12"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Mobile Number *</Label>
                  <Input
                    placeholder="+1234567890"
                    className="mt-2 h-12"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Location / Port</Label>
                  <Input
                    placeholder="e.g. Dubai, UAE"
                    className="mt-2 h-12"
                    value={formData.locationPort}
                    onChange={(e) => handleInputChange("locationPort", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    placeholder="Your company"
                    className="mt-2 h-12"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(v) => handleInputChange("experienceLevel", v)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="Mid-Level">Mid-Level (4-7 years)</SelectItem>
                      <SelectItem value="Senior">Senior (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}


          {/* Step 2 – Brokerage Details */}
{currentStep === 2 && (
  <div className="space-y-10">
    <h3 className="text-2xl font-bold text-gray-800">Brokerage Details</h3>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

      {/* سمت چپ: Areas of Expertise - عرض دقیقاً برابر با ستون راست */}
      <div className="flex flex-col">
        <Label className="text-lg font-semibold text-gray-900 mb-5">
          Areas of Expertise
        </Label>

        <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm h-fit">
          <div className="space-y-3">
            {[
              { key: "chartering", label: "Chartering" },
              { key: "salePurchase", label: "Sale & Purchase" },
              { key: "shipManagement", label: "Ship Management" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer text-sm font-medium
                  ${formData[key as keyof typeof formData]
                    ? "border-[#1A365D] bg-[#1A365D]/5"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded text-[#1A365D] focus:ring-[#1A365D]"
                  checked={formData[key as keyof typeof formData] as boolean}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* سمت راست: Active Projects + Commission Rate */}
      <div className="space-y-10">
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-5">
            Active Projects
          </Label>
          <Input
            type="number"
            min="0"
            placeholder="3"
            className="h-14 text-base rounded-2xl border-gray-300 focus:border-[#1A365D] focus:ring-2 focus:ring-[#1A365D]/20 w-full"
            value={formData.activeProjects}
            onChange={(e) => handleInputChange("activeProjects", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-5">
            Commission Rate (%)
          </Label>
          <Input
            type="text"
            placeholder=""
            className="h-14 text-base rounded-2xl border-gray-300 focus:border-[#1A365D] focus:ring-2 focus:ring-[#1A365D]/20 w-full"
            value={formData.commissionRate}
            onChange={(e) => handleInputChange("commissionRate", e.target.value)}
          />
        </div>
      </div>

    </div>
  </div>
)}

          {/* Step 3 – Attachment & Media */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Attachment & Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Profile Image */}
                <div className="border border-gray-200 rounded-2xl p-6">
                  <Label>Upload Profile Image</Label>
                  <label
                    htmlFor="profile-img"
                    className="mt-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition"
                  >
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">Click or drag image here</span>
                    <input
                      id="profile-img"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImage}
                    />
                  </label>
                </div>

                {/* Certificate / License */}
                <div className="border border-gray-200 rounded-2xl p-6">
                  <Label>Upload Certificate or License file (PDF, FOC)</Label>
                  <label
                    htmlFor="cert-file"
                    className="mt-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition"
                  >
                    {formData.certificateFile ? (
                      <span className="text-sm text-green-600">✅ File uploaded</span>
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">Click or drag file here</span>
                    <input
                      id="cert-file"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleCertificateFile}
                    />
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl max-w-4xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Broker Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{formData.brokerName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{formData.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium">{formData.companyName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Experience</p>
                    <p className="font-medium">{formData.experienceLevel || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Commission</p>
                    <p className="font-medium">{formData.commissionRate || "—"} %</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{formData.locationPort || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* دکمه‌ها */}
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
                  onClick={() => router.back()}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create Broker
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  if (currentStep === 1 && !validateStep1()) return;
                  nextStep();
                }}
                disabled={isLoading}
                className="bg-[#1A365D] hover:bg-[#152a4a] px-10"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Next & Save draft
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