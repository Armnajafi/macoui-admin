// components/ui/upload-document.tsx
"use client";

import { useState } from "react";
import { Upload, X, Link2, FileText } from "lucide-react";

interface Props {
  onFileChange?: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  initialFile?: File | null;
  initialUrl?: string;
}

export default function UploadDocument({
  onFileChange,
  onUrlChange,
  initialFile,
  initialUrl = "",
}: Props) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [url, setUrl] = useState(initialUrl);
  const [mode, setMode] = useState<"upload" | "url">(
    initialFile ? "upload" : initialUrl ? "url" : "upload"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setUrl("");
      setMode("upload");
      onFileChange?.(selected);
      onUrlChange?.("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setFile(null);
    setMode("url");
    onUrlChange?.(value);
    onFileChange?.(null);
  };

  const removeFile = () => {
    setFile(null);
    setUrl("");
    setMode("upload");
    onFileChange?.(null);
    onUrlChange?.("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-medium mb-4">Upload Document</h3>
        <p className="text-gray-600 mb-4">Upload a file or provide an external link</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
            ${mode === "upload" 
              ? "bg-[#1A365D] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          <Upload className="w-5 h-5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
            ${mode === "url" 
              ? "bg-[#1A365D] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          <Link2 className="w-5 h-5" />
          External Link
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, XLSX, Images, Videos</p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-green-200 rounded-full transition"
              >
                <X className="w-5 h-5 text-green-700" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div>
          <input
            type="url"
            placeholder="https://example.com/document.pdf"
            value={url}
            onChange={handleUrlChange}
            className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:border-[#1A365D] focus:ring-4 focus:ring-[#1A365D]/20 transition-all text-base"
          />
          {url && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <Link2 className="w-8 h-8 text-blue-600" />
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                {url}
              </a>
              <button onClick={removeFile} className="ml-auto">
                <X className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}