"use client";

import React from "react";

interface FixedUtilityCostsToggleProps {
  fixedUtilityCost: boolean;
  centralHeating: boolean;
  furnished: boolean;
  julySummerUtilities: string;
  januaryWinterUtilities: string;
  onFixedUtilityCostChange: (value: boolean) => void;
  onCentralHeatingChange: (value: boolean) => void;
  onFurnishedChange: (value: boolean) => void;
  onJulySummerUtilitiesChange: (value: string) => void;
  onJanuaryWinterUtilitiesChange: (value: string) => void;
}

const FixedUtilityCostsToggle: React.FC<FixedUtilityCostsToggleProps> = ({
  fixedUtilityCost,
  centralHeating,
  furnished,
  julySummerUtilities,
  januaryWinterUtilities,
  onFixedUtilityCostChange,
  onCentralHeatingChange,
  onFurnishedChange,
  onJulySummerUtilitiesChange,
  onJanuaryWinterUtilitiesChange,
}) => {
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
                onChange={(e) => {
                  onFixedUtilityCostChange(e.target.checked);
                  console.log('Fixed Utility Cost:', e.target.checked);
                }}
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
                onChange={(e) => {
                  onCentralHeatingChange(e.target.checked);
                  console.log('Central Heating:', e.target.checked);
                }}
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
                onChange={(e) => {
                  onFurnishedChange(e.target.checked);
                  console.log('Furnished:', e.target.checked);
                }}
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
              onChange={(e) => {
                onJulySummerUtilitiesChange(e.target.value);
                console.log('July Summer Utilities:', e.target.value);
              }}
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
              onChange={(e) => {
                onJanuaryWinterUtilitiesChange(e.target.value);
                console.log('January Winter Utilities:', e.target.value);
              }}
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
