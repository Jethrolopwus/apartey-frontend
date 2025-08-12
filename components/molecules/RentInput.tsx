"use client";
import React from "react";

interface RentInputProps {
  rentType: string;
  rent: {
    amount: number;
    currency: string;
  };
  onRentTypeChange: (rentType: string) => void;
  onRentChange: (rent: { amount: number; currency: string }) => void;
}

const RentInput: React.FC<RentInputProps> = ({
  rentType,
  rent,
  onRentTypeChange,
  onRentChange,
}) => {
  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    onRentChange({
      amount: rent.amount,
      currency: newCurrency
    });
    console.log("Currency changed to:", newCurrency);
  };

  // Handle amount change
  const handleAmountChange = (newAmount: string) => {
    // Remove any currency symbols that might be typed
    const cleanAmount = newAmount
      .replace(/^(NGN|₦|\$|€)\s*/, "") // Remove currency prefixes
      .replace(/[^\d,.-]/g, ""); // Keep only numbers, commas, dots, and hyphens

    const numericAmount = parseFloat(cleanAmount.replace(/,/g, "")) || 0;
    
    onRentChange({
      amount: numericAmount,
      currency: rent.currency
    });
    console.log("Amount changed to:", numericAmount);
  };

  // Format display value with currency prefix
  const getDisplayValue = () => {
    if (!rent.amount) return "";

    switch (rent.currency) {
      case "NGN":
        return `NGN ${rent.amount.toLocaleString()}`;
      case "$":
        return `$ ${rent.amount.toLocaleString()}`;
      case "€":
        return `€ ${rent.amount.toLocaleString()}`;
      default:
        return `${rent.currency} ${rent.amount.toLocaleString()}`;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
      <p className="text-sm text-gray-600 mb-4">Enter your rent amount</p>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="yearly"
            name="rentType"
            checked={rentType === "Yearly"}
            onChange={() => {
              onRentTypeChange("Yearly");
              console.log("Rent Type:", "Yearly");
            }}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="yearly" className="text-sm text-gray-700">
            Yearly
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="monthly"
            name="rentType"
            checked={rentType === "Monthly"}
            onChange={() => {
              onRentTypeChange("Monthly");
              console.log("Rent Type:", "Monthly");
            }}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="monthly" className="text-sm text-gray-700">
            Monthly
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {rentType} Rent
        </label>
        <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
          <select
            value={rent.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-20 px-2 py-2 border-r border-gray-300 rounded-l-md focus:outline-none appearance-none bg-white text-sm text-gray-700"
          >
            <option value="NGN">NGN &#9660;</option>
            <option value="$">USD &#9660;</option>
            <option value="€">EUR &#9660;</option>
          </select>
          <input
            type="text"
            value={getDisplayValue()}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={`${rent.currency} 300,000`}
            className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter your {rentType.toLowerCase()} rent amount
        </p>
      </div>
    </div>
  );
};

export default RentInput;
