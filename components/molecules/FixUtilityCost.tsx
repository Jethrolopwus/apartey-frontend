"use client";

import React from "react";

interface UtilityCost {
  amount: number;
  currency: string;
}

interface FixedUtilityCostsToggleProps {
  fixedUtilityCost: boolean;
  centralHeating: boolean;
  furnished: boolean;
  julyUtilities: UtilityCost;
  januaryUtilities: UtilityCost;
  onFixedUtilityCostChange: (value: boolean) => void;
  onCentralHeatingChange: (value: boolean) => void;
  onFurnishedChange: (value: boolean) => void;
  onJulyUtilitiesChange: (value: UtilityCost) => void;
  onJanuaryUtilitiesChange: (value: UtilityCost) => void;
}

const FixedUtilityCostsToggle: React.FC<FixedUtilityCostsToggleProps> = ({
  fixedUtilityCost,
  centralHeating,
  furnished,
  julyUtilities,
  januaryUtilities,
  onFixedUtilityCostChange,
  onCentralHeatingChange,
  onFurnishedChange,
  onJulyUtilitiesChange,
  onJanuaryUtilitiesChange,
}) => {
  // Format number with commas for display
  const formatNumber = (num: number): string => {
    if (!num) return "";
    return num.toLocaleString();
  };

  // Parse formatted number back to number
  const parseFormattedNumber = (formatted: string): number => {
    const clean = formatted.replace(/[^\d]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  // Handle currency change
  const handleCurrencyChange = (season: 'july' | 'january', newCurrency: string) => {
    if (season === 'july') {
      onJulyUtilitiesChange({
        ...julyUtilities,
        currency: newCurrency
      });
    } else {
      onJanuaryUtilitiesChange({
        ...januaryUtilities,
        currency: newCurrency
      });
    }
  };

  // Handle amount change
  const handleAmountChange = (season: 'july' | 'january', newAmount: string) => {
    const parsedAmount = parseFormattedNumber(newAmount);
    
    if (season === 'july') {
      onJulyUtilitiesChange({
        ...julyUtilities,
        amount: parsedAmount
      });
    } else {
      onJanuaryUtilitiesChange({
        ...januaryUtilities,
        amount: parsedAmount
      });
    }
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
        <p className="text-sm text-gray-600 mb-4">Share your seasonal utility costs</p>

        <div className="space-y-4">
          {/* July (Summer) Utilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              July (Summer) Utilities
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
              <select
                value={julyUtilities.currency}
                onChange={(e) => handleCurrencyChange('july', e.target.value)}
                className="w-20 px-2 py-2 border-r border-gray-300 rounded-l-md focus:outline-none appearance-none bg-white text-sm text-gray-700"
              >
                <option value="NGN">NGN &#9660;</option>
            <option value="$">USD &#9660;</option>
            <option value="€">EUR &#9660;</option>
              </select>
              <input
                type="text"
                value={formatNumber(julyUtilities.amount)}
                onChange={(e) => handleAmountChange('july', e.target.value)}
                placeholder={`${julyUtilities.currency} 300,000`}
                className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* January (Winter) Utilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              January (Winter) Utilities
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
              <select
                value={januaryUtilities.currency}
                onChange={(e) => handleCurrencyChange('january', e.target.value)}
                className="w-20 px-2 py-2 border-r border-gray-300 rounded-l-md focus:outline-none appearance-none bg-white text-sm text-gray-700"
              >
                 <option value="NGN">NGN &#9660;</option>
            <option value="$">USD &#9660;</option>
            <option value="€">EUR &#9660;</option>
              </select>
              <input
                type="text"
                value={formatNumber(januaryUtilities.amount)}
                onChange={(e) => handleAmountChange('january', e.target.value)}
                placeholder={`${januaryUtilities.currency} 300,000`}
                className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedUtilityCostsToggle;
