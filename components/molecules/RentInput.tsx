"use client";
import React from "react";
import { RentInputProps, RentData } from "@/types/generated";

const RentInput: React.FC<RentInputProps> = ({
  data,
  onChange,
  className = "",
  title = "Rent",
  description = "Enter your yearly rent amount",
  label = "Yearly Rent",
  placeholder = "",
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="actual"
            name="rentType"
            checked={data.rentType === "actual"}
            onChange={() => onChange("rentType", "actual")}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="actual" className="text-sm text-gray-700">
            Actual amount
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="range"
            name="rentType"
            checked={data.rentType === "range"}
            onChange={() => onChange("rentType", "range")}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="range" className="text-sm text-gray-700">
            Range
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="text"
          value={data.yearlyRent || ""}
          onChange={(e) => onChange("yearlyRent", e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default RentInput;
