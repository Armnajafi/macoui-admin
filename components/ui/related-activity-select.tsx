// components/ui/related-activity-select.tsx
"use client";

import { useState } from "react";

const ACTIVITIES = [
  { label: "Ship Finance", value: "ship_finance" },
  { label: "Maritime Trading", value: "trading" },
  { label: "Ship Brokerage", value: "brokerage" },
  { label: "Consultancy", value: "consultancy" },
  { label: "Project Posting", value: "project_posting" },
  { label: "General", value: "general" },
];

interface Props {
  selected?: string;
  onSelect?: (value: string) => void;
}

export default function RelatedActivitySelect({ selected = "", onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = ACTIVITIES.find(a => a.label === selected)?.label || selected || "Select Activity";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#1A365D]/30 transition-all"
      >
        <span className="text-base font-medium text-gray-800">{selectedLabel}</span>
        <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {ACTIVITIES.map((activity) => (
            <button
              key={activity.value}
              onClick={() => {
                onSelect?.(activity.label);
                setOpen(false);
              }}
              className="w-full px-5 py-4 text-left hover:bg-[#1A365D]/5 transition-colors text-base font-medium"
            >
              {activity.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}