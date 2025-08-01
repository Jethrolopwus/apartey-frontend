"use client";
import React from "react";
interface RentInputProps {
  rentType: "actual" | "range";
  yearlyRent: string;
  onRentTypeChange: (rentType: "actual" | "range") => void;
  onYearlyRentChange: (yearlyRent: string) => void;
}

const RentInput: React.FC<RentInputProps> = ({
  rentType,
  yearlyRent,
  onRentTypeChange,
  onYearlyRentChange,
}) => {
  // Parse current values
  const parseRentValue = (rentString: string) => {
    const parts = rentString.split(" ");
    const currency = parts[0] || "NGN";
    const amount = parts.slice(1).join(" ") || "";
    return { currency, amount };
  };

  const { currency, amount } = parseRentValue(yearlyRent);

  // Format display value with currency prefix
  const getDisplayValue = () => {
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

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    onYearlyRentChange(`${newCurrency} ${amount}`);
    console.log("Currency changed to:", newCurrency);
  };

  // Handle amount change
  const handleAmountChange = (newAmount: string) => {
    // Remove any currency symbols that might be typed
    const cleanAmount = newAmount
      .replace(/^(NGN|₦|\$|€)\s*/, "") // Remove currency prefixes
      .replace(/[^\d,.-]/g, ""); // Keep only numbers, commas, dots, and hyphens

    onYearlyRentChange(`${currency} ${cleanAmount}`);
    console.log("Amount changed to:", `${currency} ${cleanAmount}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
      <p className="text-sm text-gray-600 mb-4">Enter your rent amount</p>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="actual"
            name="rentType"
            checked={rentType === "actual"}
            onChange={() => {
              onRentTypeChange("actual");
              console.log("Rent Type:", "actual");
            }}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="actual" className="text-sm text-gray-700">
            Yearly
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="range"
            name="rentType"
            checked={rentType === "range"}
            onChange={() => {
              onRentTypeChange("range");
              console.log("Rent Type:", "range");
            }}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="range" className="text-sm text-gray-700">
            Monthly
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {rentType === "actual" ? "Yearly" : "Monthly"} Rent
        </label>
        <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500">
          <select
            value={currency}
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
            placeholder={`${currency} 300,000`}
            className="w-full px-3 py-2 border-0 rounded-r-md focus:outline-none focus:ring-0 text-sm text-gray-700"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter your {rentType === "actual" ? "yearly" : "monthly"} rent amount
        </p>
      </div>
    </div>
  );
};

export default RentInput;
