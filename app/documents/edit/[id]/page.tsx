"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RelatedActivitySelect from "@/components/ui/related-activity-select";
import UploadDocument from "@/components/ui/upload-document";
import Footer from "@/components/ui/footer-admin";
import { useDocuments } from "@/hooks/use-documents";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, FileText, Link2 } from "lucide-react";
const ACTIVITIES = [
  { label: "Ship Finance", value: "ship_finance" },
  { label: "Maritime Trading", value: "trading" },
  { label: "Ship Brokerage", value: "brokerage" },
  { label: "Consultancy", value: "consultancy" },
  { label: "Project Posting", value: "project_posting" },
  { label: "General", value: "general" },
];

export default function EditDocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { documents, updateDocument, isLoading } = useDocuments();

  const document = documents.find((d) => d.id === id);

  const [title, setTitle] = useState("");
  const [selectedActivityLabel, setSelectedActivityLabel] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // لود اولیه داده‌ها
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setSelectedActivityLabel(document.activity); // activity در فرانت‌اند نمایشیه
      setVisibility(document.status === "Active" ? "Public" : "Private");

      // اگر فایل آپلود شده داره
      if (document.file) {
        setExternalUrl("");
        // ما نمی‌تونیم File واقعی بسازیم، پس فقط نشون می‌دیم که فایل وجود داره
        // UploadDocument خودش تشخیص می‌ده
      }
      // اگر لینک داره
      if (document.url) {
        setExternalUrl(document.url);
      }
    }
  }, [document]);

  const handleUpdate = async () => {
    if (!title.trim()) return toast.error("Document title is required");
    if (!selectedActivityLabel) return toast.error("Please select a related activity");

    setIsSubmitting(true);

    const activityObj = ACTIVITIES.find(a => a.label === selectedActivityLabel);
    const activitySlug = activityObj?.value || "general";

    let type: string = "LINK";
    if (uploadedFile) {
      const ext = uploadedFile.name.split(".").pop()?.toLowerCase();
      type = ext === "pdf" ? "PDF" :
             ext?.includes("doc") ? "DOCX" :
             ext?.includes("xls") ? "XLSX" :
             ext?.match(/jpe?g|png|gif/) ? "IMG" :
             ext?.match(/mp4|avi|mov|webm/) ? "VID" : "PDF";
    } else if (externalUrl) {
      const ext = externalUrl.split(".").pop()?.toLowerCase() || "";
      type = ext === "pdf" ? "PDF" :
             ext.includes("doc") ? "DOCX" :
             ext.includes("xls") ? "XLSX" :
             ext.match(/jpe?g|png|gif/) ? "IMG" :
             ext.match(/mp4|avi|mov|webm/) ? "VID" : "LINK";
    } else if (document?.type) {
      type = document.type;
    }

    const payload: any = {
      title: title.trim(),
      activity: activitySlug,
      type,
    };

    // فقط اگر فایل جدید آپلود شده
    if (uploadedFile) {
      payload.file = uploadedFile;
      payload.url = ""; // پاک کردن لینک قبلی
    }
    // فقط اگر لینک جدید وارد شده
    else if (externalUrl && externalUrl !== document?.url) {
      payload.url = externalUrl.trim();
      payload.file = ""; // پاک کردن فایل قبلی (بک‌اند باید پشتیبانی کنه)
    }

    if (visibility === "Public") {
      payload.status = "Active";
    } else {
      payload.status = "Archive";
    }

    const result = await updateDocument(id as string, payload);

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Document updated successfully!");
      router.push("/documents");
    } else {
      toast.error(result.message || "Failed to update document");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Document not found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
          <h2 className="text-2xl md:text-5xl font-semibold text-white mb-2">
            Edit Maritime Document
          </h2>
          <p className="text-lg md:text-3xl font-medium text-white">
            Update document details and content
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Link href="/documents" className="inline-flex items-center text-[#1A365D] hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Documents
        </Link>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-[#1A365D] focus:ring-4 focus:ring-[#1A365D]/20 transition-all text-base"
            />
          </div>

          {/* Activity + Visibility */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="text-xl md:text-2xl font-medium mb-3 block">Related Activity</label>
              <RelatedActivitySelect
                selected={selectedActivityLabel}
                onSelect={setSelectedActivityLabel}
              />
            </div>
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

          {/* Current File/Link Display */}
          {(document.file || document.url) && !uploadedFile && !externalUrl && (
            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-sm font-medium text-gray-600 mb-3">Current Attachment:</p>
              {document.file && (
                <a
                  href={document.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1A365D] hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  View Current File
                </a>
              )}
              {document.url && (
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1A365D] hover:underline"
                >
                  <Link2 className="w-5 h-5" />
                  {document.url}
                </a>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Upload a new file or enter a new link to replace it.
              </p>
            </div>
          )}

          {/* Upload New Document */}
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
        <Link href="/documents">
          <button className="px-8 py-4 text-gray-700 font-medium hover:underline">
            Cancel
          </button>
        </Link>
        <Button
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="px-10 py-4 bg-[#1A365D] text-white text-lg font-medium rounded-xl hover:bg-[#0F2A48] disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Document"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}