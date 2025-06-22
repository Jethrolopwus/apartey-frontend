"use client";

import React from "react";
import { useReviewForm } from "@/app/context/RevievFormContext";

const FixedUtilityCostsToggle: React.FC = () => {
  const { location, setLocation } = useReviewForm();

  const fixedUtilityCost = location?.fixedUtilityCost || false;
  const centralHeating = location?.centralHeating || false;
  const furnished = location?.furnished || false;
  const julySummerUtilities = location?.julySummerUtilities || "";
  const januaryWinterUtilities = location?.januaryWinterUtilities || "";

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Utilities & Amenities
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Tell us about the utilities and features
      </p>

      {/* Utilities Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Utilities</h3>
        <p className="text-sm text-gray-600 mb-4">
          Information about utility costs and features
        </p>

        <div className="space-y-4">
          {/* Fixed utility cost */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Fixed utility cost</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                checked={fixedUtilityCost}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    fixedUtilityCost: e.target.checked,
                  })
                }
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-white appearance-none cursor-pointer"
              />
              <label
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-[#D9D9D9] cursor-pointer ${
                  fixedUtilityCost ? "bg-orange-500" : ""
                }`}
              ></label>
            </div>
          </div>

          {/* Central Heating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Central Heating</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                checked={centralHeating}
                onChange={(e) =>
                  setLocation({ ...location, centralHeating: e.target.checked })
                }
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-white appearance-none cursor-pointer"
              />
              <label
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-[#D9D9D9] cursor-pointer ${
                  centralHeating ? "bg-orange-500" : ""
                }`}
              ></label>
            </div>
          </div>

          {/* Furnished */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Furnished</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                checked={furnished}
                onChange={(e) =>
                  setLocation({ ...location, furnished: e.target.checked })
                }
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-white appearance-none cursor-pointer"
              />
              <label
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-[#D9D9D9] cursor-pointer ${
                  furnished ? "bg-orange-500" : ""
                }`}
              ></label>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Costs Section */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Utility Costs</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your seasonal utility costs
        </p>

        <div className="space-y-4">
          {/* July Summer Utilities */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              July (Summer) Utilities
            </label>
            <input
              type="text"
              value={julySummerUtilities}
              onChange={(e) =>
                setLocation({
                  ...location,
                  julySummerUtilities: e.target.value,
                })
              }
              placeholder="e.g. ₦100,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>

          {/* January Winter Utilities */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              January (Winter) Utilities
            </label>
            <input
              type="text"
              value={januaryWinterUtilities}
              onChange={(e) =>
                setLocation({
                  ...location,
                  januaryWinterUtilities: e.target.value,
                })
              }
              placeholder="e.g. ₦120,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedUtilityCostsToggle;
