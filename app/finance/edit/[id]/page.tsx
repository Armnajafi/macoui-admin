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
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useFinanceProjects, type FinanceProject } from "@/hooks/use-finance-projects";
import { useCountries } from "@/hooks/use-countries";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id ? parseInt(params.id as string) : null;
  
  const { projects, updateProject } = useFinanceProjects();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<Partial<FinanceProject>>({
    title: "",
    summary: "",
    country: null,
    status: "D",
    cover_image: undefined,
  });

  const steps = [
    { id: 1, name: "General Info" },
    { id: 2, name: "Technical Details" },
    { id: 3, name: "Document & Media" },
  ];

  // بارگذاری دیتای پروژه
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProjectData({
          title: foundProject.title,
          summary: foundProject.summary,
          country: foundProject.country,
          status: foundProject.status,
          cover_image: foundProject.cover_image,
        });
      }
    }
  }, [projectId, projects]);

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCountryChange = (countryId: string) => {
    const country = countries.find(c => c.id === parseInt(countryId)) || null;
    handleInputChange("country", country);
  };

  const handleSubmit = async () => {
    if (!projectId) {
      alert("Project ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: projectData.title,
        summary: projectData.summary,
        status: projectData.status,
        country: projectData.country?.id,
      };

      const result = await updateProject(projectId, payload);

      if (result.success) {
        alert("Finance project updated successfully!");
        router.push("/finance");
      } else {
        alert(result.message || "Failed to update finance project");
      }
    } catch (error) {
      console.error("Error updating finance project:", error);
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
            Edit Maritime Project
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Edit project #{projectId} for the B2B maritime marketplace
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
                    <Label htmlFor="title" className="text-base font-medium">Project Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Bulk Carrier for Charter" 
                      className="mt-2 h-12"
                      value={projectData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-base font-medium">Country</Label>
                    <Select 
                      value={projectData.country?.id.toString() || ""}
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
                    <Label htmlFor="status" className="text-base font-medium">Status</Label>
                    <Select 
                      value={projectData.status}
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
                    <Label htmlFor="location" className="text-base font-medium">Location / Port</Label>
                    <Input 
                      id="location" 
                      placeholder="Singapore / Rotterdam" 
                      className="mt-2 h-12"
                      value={projectData.country ? `${projectData.country.name}` : ""}
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary" className="text-base font-medium">Project Summary</Label>
                    <Input 
                      id="summary" 
                      placeholder="Brief project summary" 
                      className="mt-2 h-12"
                      value={projectData.summary || ""}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="created_by" className="text-base font-medium">Created By</Label>
                    <Input 
                      id="created_by" 
                      value={projectData.created_by || "h.smith@broker.com"}
                      className="mt-2 h-12"
                      disabled
                    />
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
                    <textarea
                      placeholder="Describe the project in a few sentences"
                      rows={8}
                      className="w-full resize-none outline-none text-gray-700 placeholder-gray-400 text-base"
                      value={projectData.summary || ""}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                    />
                  </div>
                </div>

                {/* ستون راست - مشخصات فنی */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Technical Specification
                  </h4>

                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex justify-between">
                        <span className="font-medium">Project ID</span>
                        <span className="text-gray-600">{projectId}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Country</span>
                        <span className="text-gray-600">{projectData.country?.name || "Not set"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Status</span>
                        <span className={`font-medium ${
                          projectData.status === "Published" ? "text-green-600" :
                          projectData.status === "Draft" ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {projectData.status}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Created By</span>
                        <span className="text-gray-600">{projectData.created_by || "Unknown"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Cover Image</span>
                        <span className="text-gray-600">
                          {projectData.cover_image ? "Uploaded" : "Not uploaded"}
                        </span>
                      </li>
                    </ul>
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
                      Upload vessel images, documents (Pdf, Doc, XLS)
                    </p>

                    {/* دکمه مخفی برای کلیک */}
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden"
                      onChange={(e) => {
                        // در اینجا می‌توانید منطق آپلود فایل را پیاده‌سازی کنید
                        console.log("Files selected:", e.target.files);
                      }}
                    />
                  </label>
                </div>

                {/* نمایش وضعیت فعلی کاور */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Current cover image: {projectData.cover_image ? "Available" : "Not available"}
                  </p>
                </div>
              </div>

              {/* نکته کوچک پایین باکس */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Maximum file size: 25MB • Supported formats: JPG, PNG, PDF, DOC, XLS
                </p>
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
            disabled={currentStep === 1}
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
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={nextStep}
                disabled={currentStep === 3}
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