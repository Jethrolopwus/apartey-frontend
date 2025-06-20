"use client";
import React from "react";
import { PropertyDetailsSectionProps } from "@/types/generated";
import { useReviewForm } from "@/app/context/RevievFormContext";



const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = () => {
  const { location, setLocation } = useReviewForm();
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
            value={location?.numberOfRooms || ""}
            onChange={e =>
              setLocation({ ...location, numberOfRooms: e.target.value })
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
            value={location?.numberOfOccupants || ""}
            onChange={e =>
              setLocation({ ...location, numberOfOccupants: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
