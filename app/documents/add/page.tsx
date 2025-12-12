"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RelatedActivitySelect from "@/components/ui/related-activity-select";
import UploadDocument from "@/components/ui/upload-document";
import Footer from "@/components/ui/footer-admin";
import { useDocuments } from "@/hooks/use-documents";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// لیست فعالیت‌ها با نام نمایشی و slug واقعی
const ACTIVITIES = [
  { label: "Ship Finance", value: "ship_finance" },
  { label: "Maritime Trading", value: "trading" },
  { label: "Ship Brokerage", value: "brokerage" },
  { label: "Consultancy", value: "consultancy" },
  { label: "Project Posting", value: "project_posting" },
  { label: "General", value: "general" },
];

export default function AddDocumentPage() {
  const [title, setTitle] = useState("");
  const [selectedActivityLabel, setSelectedActivityLabel] = useState(""); // فقط برای نمایش
  const [visibility, setVisibility] = useState("Public");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState("");

  const { createDocument } = useDocuments();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
   
    if (!title.trim()) return toast.error("Document title is required");
    if (!selectedActivityLabel) return toast.error("Please select a related activity");
    // if (!uploadedFile && !externalUrl.trim()) return toast.error("Please upload a file or provide a URL");
    alert("test");
    setIsSubmitting(true);

    // تبدیل label به slug
    const activityObj = ACTIVITIES.find(a => a.label === selectedActivityLabel);
    const activitySlug = activityObj?.value || "general";

    // تشخیص نوع فایل
    let type: string = "LINK";
    if (uploadedFile) {
      const ext = uploadedFile.name.split(".").pop()?.toLowerCase();
      type = ext === "pdf" ? "PDF" :
             ext === "doc" || ext === "docx" ? "DOCX" :
             ext === "xls" || ext === "xlsx" ? "XLSX" :
             ext?.match(/jpe?g|png|gif/) ? "IMG" :
             ext?.match(/mp4|avi|mov|webm/) ? "VID" : "PDF";
    } else if (externalUrl) {
      const ext = externalUrl.split(".").pop()?.toLowerCase();
      type = ext === "pdf" ? "PDF" :
             ext?.includes("doc") ? "DOCX" :
             ext?.includes("xls") ? "XLSX" :
             ext?.match(/jpe?g|png|gif/) ? "IMG" :
             ext?.match(/mp4|avi|mov|webm/) ? "VID" : "LINK";
    }

    const payload = {
      title: title.trim(),
      activity: activitySlug,
      type,
      file: uploadedFile || undefined,
      url: externalUrl.trim() || undefined,
      status: visibility === "Public" ? "active" as const : "archive" as const,
    };
    console.log(payload);
    const result = await createDocument(payload);

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Document uploaded successfully!");
      router.push("/documents");
    } else {
      toast.error(result.message || "Failed to upload document");
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
          <h2 className="text-2xl md:text-5xl font-semibold text-white mb-2">
            Add New Maritime Document
          </h2>
          <p className="text-lg md:text-3xl font-medium text-white">
            Upload a document to the B2B maritime marketplace
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-0 mt-8 mb-16">
        <div
          className="w-full max-w-[1226px] bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10"
          style={{ boxShadow: "-2px 2px 20px rgba(0,0,0,0.15)" }}
        >
          {/* Title */}
          <div className="mb-8">
            <label className="text-xl md:text-2xl font-medium mb-3 block">Document Title</label>
            <input
              type="text"
              placeholder="Enter a clear and descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-[#1A365D] focus:ring-4 focus:ring-[#1A365D]/20 transition-all text-base"
            />
          </div>

          {/* Activity + Visibility */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Related Activity */}
            <div>
              <label className="text-xl md:text-2xl font-medium mb-3 block">Related Activity</label>
              <RelatedActivitySelect
                selected={selectedActivityLabel}
                onSelect={(value: string) => setSelectedActivityLabel(value)}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="text-xl md:text-2xl font-medium mb-3 block">Visibility</label>
              <div className="space-y-4">
                {["Public", "Private", "Restricted", "Brokers Only"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value={option}
                      checked={visibility === option}
                      onChange={() => setVisibility(option)}
                      className="hidden"
                    />
                    <span
                      className={`w-6 h-6 mr-4 rounded-full border-2 flex items-center justify-center transition-all
                        ${visibility === option ? "bg-[#1A365D] border-[#1A365D]" : "border-gray-400"}
                      `}
                    >
                      {visibility === option && <span className="w-3 h-3 bg-white rounded-full"></span>}
                    </span>
                    <span className="text-lg">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Document */}
          <div className="mb-8">
            <UploadDocument
              onFileChange={setUploadedFile}
              onUrlChange={setExternalUrl}
              initialFile={uploadedFile}
              initialUrl={externalUrl}
            />
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-0 mb-20">
        <button
          onClick={() => router.back()}
          className="px-8 py-4 text-gray-700 font-medium hover:underline"
        >
          Cancel
        </button>
        <button className="px-8 py-4 border-2 border-[#1A365D] text-[#1A365D] rounded-xl font-medium hover:bg-[#1A365D] hover:text-white transition">
          Save as Draft
        </button>
        <Button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="px-10 py-4 bg-[#1A365D] text-white text-lg font-medium rounded-xl hover:bg-[#0F2A48] disabled:opacity-60"
        >
          {isSubmitting ? "Uploading..." : "Publish Document"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}