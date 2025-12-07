"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RelatedActivitySelect from "@/components/ui/related-box"
import UploadDocument from "@/components/ui/upload-documents"
import Footer from "@/components/ui/footer-admin"

export default function AddDocumentPage() {
  const [visibility, setVisibility] = useState("")

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header Section */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-4 md:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Add New Maritime Document
          </h2>
          <p className="text-sm sm:text-[20px] md:text-[44px] font-semibold text-white">
            Upload a document to the B2B maritime marketplace
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div  >
      <div className="flex justify-center px-4 sm:px-6 md:px-0 mt-6">
        <div
          className="w-full sm:w-[95%] md:w-[1226px] bg-[#f8f8f8] shadow-xl rounded-xl p-4 sm:p-6 md:p-8"
          style={{
            boxShadow: "-2px 2px 4px 0px #00000033",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
          }}
          >
          {/* Document Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl mb-4">Document Title</h3>
          <input
            type="text"
            placeholder="Enter document title"
            className="w-full mb-4 px-3 py-2 bg-white border border-gray-300 rounded text-sm sm:text-base"
            />

          {/* Related Activity & Visibility */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 mb-6">
            {/* Related Activity */}
            <div className="flex-1">
              <RelatedActivitySelect />
            </div>

            {/* Visibility */}
            <div className="flex-1">
              <p className="mb-2 text-sm sm:text-base">Visibility</p>
              <div className="flex flex-col gap-2 sm:gap-3">
                {["Public", "Private", "Restricted", "Brokers Only"].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer text-sm sm:text-base">
                    <input
                      type="radio"
                      name="visibility"
                      value={option}
                      checked={visibility === option}
                      onChange={() => setVisibility(option)}
                      className="hidden"
                      />
                    <span
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 rounded-full border border-gray-400 flex items-center justify-center
                        ${visibility === option ? "bg-[#1A365D]" : "bg-white"}`}
                    >
                      {visibility === option && (
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Document */}
          <UploadDocument />

          {/* Tags */}
          <h3 className="text-lg sm:text-xl md:text-2xl mb-4">Tags (optional)</h3>
          <input
            type="text"
            placeholder="Add tags"
            className="w-full mb-4 px-3 py-2 bg-white border border-gray-300 rounded text-sm sm:text-base"
          />

          {/* Description */}
          <h3 className="text-lg sm:text-xl md:text-2xl mb-4">Description</h3>
          <input
            type="text"
            placeholder="Type document description..."
            className="w-full mb-4 px-3 py-2 bg-white border border-gray-300 rounded text-sm sm:text-base"
            />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 w-full sm:w-[95%] max-w-[1226px] mx-auto px-4 sm:px-6 md:px-0 mb-6">
        <button className="text-gray-700 hover:underline text-sm sm:text-base">
          Cancel
        </button>

        <button className="px-4 py-2 border border-[#1A365D] text-[#1A365D] rounded hover:bg-[#1A365D] hover:text-white transition-colors text-sm sm:text-base">
          Save as Draft
        </button>

        <button className="px-4 py-2 bg-[#1A365D] text-white rounded hover:bg-[#0F2A48] transition-colors text-sm sm:text-base">
          Publish
        </button>
      </div>
      </div>
      <Footer/>
    </div>
  )
}
