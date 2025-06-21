"use client";
import React from "react";
import { PropertyDetailsSectionProps } from "@/types/generated";
import { useReviewForm } from "@/app/context/RevievFormContext";



const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = () => {
  const { location, setLocation } = useReviewForm();
  // Allow extra fields for local use
  const extendedLocation = location as typeof location & {
    furnished?: boolean;
    numberOfRooms?: string | number;
    numberOfOccupants?: string | number;
  };
  return (
    <div className="space-y-6">
      {/* Number of Rooms & Occupants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Rooms
          </label>
          <input
            type="text"
            placeholder="e.g. 2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={extendedLocation?.numberOfRooms || ""}
            onChange={e =>
              setLocation({ ...(location as any), numberOfRooms: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Occupants
          </label>
          <input
            type="text"
            placeholder="e.g. 4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={extendedLocation?.numberOfOccupants || ""}
            onChange={e =>
              setLocation({ ...(location as any), numberOfOccupants: e.target.value })
            }
          />
        </div>
      </div>
      {/* Furnished Toggle */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          id="furnished"
          checked={!!extendedLocation?.furnished}
          onChange={e => setLocation({ ...(location as any), furnished: e.target.checked })}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="furnished" className="text-sm text-gray-700 cursor-pointer">
          Is the property furnished?
        </label>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
