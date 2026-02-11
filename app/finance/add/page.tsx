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
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useFinanceProjects, type Country, type FinanceProject } from "@/hooks/use-finance-projects";
import { useCountries } from "@/hooks/use-countries";

export default function AddProjectPage() {
  const router = useRouter();
  const { createProject } = useFinanceProjects();
  const { countries, isLoading: countriesLoading } = useCountries();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // داده‌های فرم
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    country: null as Country | null,
    status: "D" as "P" | "D" | "R",
    cover_image: null as string | null,
    description_rich: "", // فیلد جدید برای توضیحات کامل
    capacity: "",
    engineType: "",
    builtYear: "",
    flag: "",
    projectType: "",
    location: "",
    budget: "",
  });

  const steps = [
    { id: 1, name: "General Info" },
    { id: 2, name: "Technical Details" },
    { id: 3, name: "Document & Media" },
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCountryChange = (countryId: string) => {
    const country = countries.find(c => c.id === parseInt(countryId)) || null;
    handleInputChange("country", country);
    
    // اگر لوکیشن خالی است، نام کشور را به عنوان لوکیشن پیش‌فرض قرار بده
    if (!formData.location && country) {
      handleInputChange("location", country.name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // در اینجا می‌توانید منطق آپلود فایل را پیاده‌سازی کنید
      console.log("Files selected:", files);
      
      // شبیه‌سازی آپلود موفق
      setTimeout(() => {
        handleInputChange("cover_image", "https://example.com/uploaded-image.jpg");
      }, 1000);
    }
  };

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      alert("Please enter a project title");
      return false;
    }
    if (!formData.country) {
      alert("Please select a country");
      return false;
    }
    if (!formData.summary.trim()) {
      alert("Please enter a project summary");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (currentStep === 3) {
      // اگر در مرحله آخر هستیم، پروژه را ذخیره کامل کنیم
      await handleSubmit();
    } else {
      // در غیر این صورت فقط اعتبارسنجی و رفتن به مرحله بعد
      if (currentStep === 1 && !validateStep1()) {
        return;
      }
      nextStep();
    }
  };

const handleSubmit = async () => {
  // اعتبارسنجی نهایی
  if (!validateStep1()) {
    return;
  }

  setIsLoading(true);
  
  try {
    // ✅ فقط فیلدهای مورد قبول API را از formData استخراج کن
    const projectData = {
      title: formData.title,
      summary: formData.summary,
      description_rich: formData.description_rich,
      country: formData.country || {}, // استفاده از id کشور
    };

    // استفاده از تابع createProject از هوک
    const result = await createProject(projectData);
    
    if (result.success) {
      alert(result.message);
      // هدایت به صفحه لیست پروژه‌ها
      router.push("/finance");
    } else {
      alert(result.message);
    }
  } catch (error: any) {
    console.error("Error creating finance project:", error);
    alert("An unexpected error occurred. Please try again.");
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
            Add New Finance Project
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Create a new finance project for the B2B maritime marketplace
          </p>
        </div>
      </div>

      {/* Progress + Form */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* نوار پیشرفت */}
        <div className="mb-16">
          <div className="relative max-w-3xl mx-auto">
            {/* خط پس‌زمینه خاکستری */}
            <div className="absolute inset-x-0 top-12 h-px bg-gray-300 -translate-y-1/2" />

            {/* خط پیشرفت آبی تیره */}
            <div
              className="absolute top-12 left-0 h-px bg-[#1A365D] transition-all duration-500 ease-in-out -translate-y-1/2 origin-left rounded-r-full"
              style={{ width: `${progressPercentage}%` }}
            />

            {/* متن مراحل */}
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

        {/* فرم */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Main Information</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ستون چپ */}
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">Project Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="Bulk Carrier for Charter" 
                      className="mt-2 h-12"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType" className="text-base font-medium">Project Type</Label>
                    <Select 
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange("projectType", value)}
                    >
                      <SelectTrigger id="projectType" className="mt-2 h-12">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charter">Charter</SelectItem>
                        <SelectItem value="sale">Sale & Purchase</SelectItem>
                        <SelectItem value="newbuilding">New Building</SelectItem>
                        <SelectItem value="demolition">Demolition</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-base font-medium">Country *</Label>
                    <Select 
                      value={formData.country?.id.toString() || ""}
                      onValueChange={handleCountryChange}
                      disabled={countriesLoading}
                    >
                      <SelectTrigger id="country" className="mt-2 h-12">
                        <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select country"} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name} ({country.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base font-medium">Status *</Label>
                    <Select 
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger id="status" className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">Published</SelectItem>
                        <SelectItem value="D">Draft</SelectItem>
                        <SelectItem value="R">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ستون راست */}
                <div className="space-y-7">
                  <div>
                    <Label htmlFor="summary" className="text-base font-medium">Project Summary *</Label>
                    <Input 
                      id="summary" 
                      placeholder="Brief project summary (max 200 characters)" 
                      className="mt-2 h-12"
                      value={formData.summary}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                      maxLength={200}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.summary.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-base font-medium">Location / Port</Label>
                    <Input 
                      id="location" 
                      placeholder="Singapore / Rotterdam" 
                      className="mt-2 h-12"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vessel" className="text-base font-medium">Vessel Type</Label>
                    <Select>
                      <SelectTrigger id="vessel" className="mt-2 h-12">
                        <SelectValue placeholder="Select vessel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bulk">Bulk Carrier</SelectItem>
                        <SelectItem value="tanker">Tanker</SelectItem>
                        <SelectItem value="container">Container Ship</SelectItem>
                        <SelectItem value="general">General Cargo</SelectItem>
                        <SelectItem value="roro">Ro-Ro</SelectItem>
                        <SelectItem value="lng">LNG Carrier</SelectItem>
                        <SelectItem value="lpg">LPG Carrier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-base font-medium">Estimated Budget (USD)</Label>
                    <div className="flex mt-2">
                      <Input 
                        id="budget" 
                        type="number" 
                        placeholder="5000000" 
                        className="h-12 rounded-r-none border-r-0"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                      />
                      <div className="flex items-center px-5 bg-gray-100 border border-l-0 rounded-r-lg h-12">
                        <span className="text-gray-700 font-semibold">$</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">
                Project Details & Technical Specs
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ستون چپ - توضیحات پروژه */}
                <div>
                  <Label className="text-base font-medium block mb-4">
                    Project Description
                  </Label>

                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <Textarea
                      placeholder="Describe the project in detail. Include requirements, specifications, timeline, and any special considerations."
                      rows={12}
                      className="w-full resize-none outline-none text-gray-700 placeholder-gray-400 text-base border-0"
                      value={formData.description_rich}
                      onChange={(e) => handleInputChange("description_rich", e.target.value)}
                    />
                  </div>
                </div>

                {/* ستون راست - مشخصات فنی */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Technical Specification
                  </h4>

                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="capacity" className="text-sm font-medium block mb-2">Capacity (DWT)</Label>
                        <Input 
                          id="capacity" 
                          placeholder="e.g., 80,000" 
                          className="h-12"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange("capacity", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="engineType" className="text-sm font-medium block mb-2">Engine Type</Label>
                        <Input 
                          id="engineType" 
                          placeholder="e.g., MAN B&W 6S60ME-C10.5" 
                          className="h-12"
                          value={formData.engineType}
                          onChange={(e) => handleInputChange("engineType", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="builtYear" className="text-sm font-medium block mb-2">Built Year</Label>
                        <Input 
                          id="builtYear" 
                          placeholder="e.g., 2020" 
                          className="h-12"
                          value={formData.builtYear}
                          onChange={(e) => handleInputChange("builtYear", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="flag" className="text-sm font-medium block mb-2">Flag</Label>
                        <Input 
                          id="flag" 
                          placeholder="e.g., Panama, Marshall Islands, etc." 
                          className="h-12"
                          value={formData.flag}
                          onChange={(e) => handleInputChange("flag", e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-gray-600">
                          Additional technical details can be added as attachments in the next step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">
                Attachments & Media
              </h3>

              {/* باکس بزرگ Drag & Drop */}
              <div className="max-w-4xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all duration-200">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer group"
                  >
                    {/* آیکن آپلود */}
                    <div className="mb-6">
                      <svg
                        className="w-16 h-16 text-gray-400 group-hover:text-[#1A365D] transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>

                    {/* متن‌ها */}
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag and drop files here or upload
                    </p>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                      Upload vessel images, technical drawings, documents (PDF, DOC, XLS)
                    </p>

                    {/* دکمه مخفی برای کلیک */}
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* نمایش وضعیت آپلود */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    {formData.cover_image ? "Cover image uploaded" : "No files uploaded yet"}
                  </p>
                </div>
              </div>

              {/* نکته کوچک پایین باکس */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Maximum file size: 25MB • Supported formats: JPG, PNG, PDF, DOC, XLS
                </p>
              </div>

              {/* نمایش خلاصه فرم */}
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Project Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title:</p>
                    <p className="font-medium">{formData.title || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country:</p>
                    <p className="font-medium">{formData.country?.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status:</p>
                    <p className="font-medium">{formData.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Project Type:</p>
                    <p className="font-medium">{formData.projectType || "Not set"}</p>
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
                      Create Project
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleSaveDraft}
                disabled={currentStep === 3 || isLoading}
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