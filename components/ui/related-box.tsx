"use client"

import { useState } from "react"

export default function RelatedActivitySelect() {
  const [selected, setSelected] = useState<string>("")
  const activities = [
    "Activity 1",
    "Activity 2",
    "Activity 3",
    "Activity 4",
    "Activity 5",
    "News & Article",
  ]

  return (
    <div className="mb-4">
      {/* Label for the select */}
      <label className="block mb-2 text-sm sm:text-base">Related to</label>

      {/* Select box */}
      <div className="bg-white w-full">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full p-3 bg-white rounded shadow-sm text-sm sm:text-base"
        >
          {activities.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>
      </div>

      {/* Optional selected display */}
      {/* {selected && <p className="mt-2 text-gray-700 text-sm sm:text-base">Selected: {selected}</p>} */}
    </div>
  )
}
