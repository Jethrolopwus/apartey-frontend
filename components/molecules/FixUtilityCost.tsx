"use client";

import React from "react";

interface FixedUtilityCostsToggleProps {
  fixedUtilityCost: boolean;
  centralHeating: boolean;
  furnished: boolean;
  utilities?: string;
  onFixedUtilityCostChange: (value: boolean) => void;
  onCentralHeatingChange: (value: boolean) => void;
  onFurnishedChange: (value: boolean) => void;
  onUtilitiesChange: (value: string) => void;
}

const FixedUtilityCostsToggle: React.FC<FixedUtilityCostsToggleProps> = ({
  fixedUtilityCost,
  centralHeating,
  furnished,
  utilities = "", // Default to empty string
  onFixedUtilityCostChange,
  onCentralHeatingChange,
  onFurnishedChange,
  onUtilitiesChange,
}) => {
  // Utility functions for parsing and formatting values
  const parseUtilityValue = (utilityString: string) => {
    const parts = utilityString.split(" ");
    const currency = parts[0] || "NGN";
    const amount = parts.slice(1).join(" ") || "";
    return { currency, amount };
  };

  const getDisplayValue = (utilityString: string) => {
    const { currency, amount } = parseUtilityValue(utilityString);
    if (!amount) return "";

    switch (currency) {
      case "NGN":
        return `NGN ${amount}`;
      case "$":
        return `$ ${amount}`;
      case "€":
        return `€ ${amount}`;
      default:
        return `${currency} ${amount}`;
    }
  };

  // Handle currency change for Utilities
  const handleUtilityCurrencyChange = (newCurrency: string) => {
    const { amount } = parseUtilityValue(utilities);
    onUtilitiesChange(`${newCurrency} ${amount}`);
    console.log("Utility currency changed to:", newCurrency);
  };

  // Handle amount change for Utilities
  const handleUtilityAmountChange = (newAmount: string) => {
    const { currency } = parseUtilityValue(utilities);
    // Remove any currency symbols that might be typed
    const cleanAmount = newAmount
      .replace(/^(NGN|₦|\$|€)\s*/, "") // Remove currency prefixes
      .replace(/[^\d,.-]/g, ""); // Keep only numbers, commas, dots, and hyphens

    onUtilitiesChange(`${currency} ${cleanAmount}`);
    console.log("Utility amount changed to:", `${currency} ${cleanAmount}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Utilities & Amenities
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Tell us about the utilities and fixtures
      </p>

      {/* Utilities Section */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Utilities</h3>
        <p className="text-sm text-gray-600 mb-4">
          Information about utility costs and fixtures
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
                  console.log("Fixed Utility Cost:", e.target.checked);
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
                  console.log("Central Heating:", e.target.checked);
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
                  console.log("Furnished:", e.target.checked);
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
        <p className="text-sm text-gray-600 mb-4">Share your utility costs</p>

        <div className="space-y-4">
          {/* Utilities */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Utilities
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
              <select
                value={parseUtilityValue(utilities).currency}
                onChange={(e) => handleUtilityCurrencyChange(e.target.value)}
                className="w-20 px-2 py-2 border-r border-gray-300 rounded-l-md focus:outline-none appearance-none bg-white text-sm text-gray-700"
              >
                <option value="NGN">NGN &#9660;</option>
                <option value="$">USD &#9660;</option>
                <option value="€">EUR &#9660;</option>
              </select>
              <input
                type="text"
                value={getDisplayValue(utilities)}
                onChange={(e) => handleUtilityAmountChange(e.target.value)}
                placeholder={`${parseUtilityValue(utilities).currency} 80,000`}
                className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your utility costs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedUtilityCostsToggle;
