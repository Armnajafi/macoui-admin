"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Remove selected file
  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="mt-6 mb-6">
      {/* Section Title */}
      <p className="mb-2 text-sm sm:text-base">Upload Document</p>

      {/* File Upload Box */}
      <label
        htmlFor="file-upload"
        className="w-full sm:w-auto md:w-auto h-[196px] bg-white rounded-[10px] border border-gray-300 shadow-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mx-auto"
      >
        {/* Upload Icon */}
        <img src="/upload-icon.png" alt="Upload Icon" className="w-10 h-10 mb-4" />

        {/* Instructions */}
        <span className="text-gray-500 text-base sm:text-lg font-medium">
          Drag and drop files here or upload
        </span>
        <span className="text-gray-400 text-xs sm:text-sm mt-1 text-center">
          Upload vessel images, documents (Pdf , Doc , XLS)
        </span>

        {/* Hidden File Input */}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Selected File Info */}
      {file && (
        <div className="mt-2 flex flex-col gap-1 w-full sm:w-[600px] md:w-[1106px] text-sm text-gray-700 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            {/* File Name */}
            <span className="font-medium">{file.name}</span>

            {/* File Size */}
            <span className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>

            {/* Remove Button */}
            <Button
              size="sm"
              variant="link"
              onClick={removeFile}
              className="text-[#1A365D] cursor-pointer hover:underline"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
