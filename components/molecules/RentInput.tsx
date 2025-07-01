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
  return (
    <div className={`border border-gray-200 rounded-lg p-4`}>
      <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
      <p className="text-sm text-gray-600 mb-4">Enter your yearly rent amount</p>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="actual"
            name="rentType"
            checked={rentType === "actual"}
            onChange={() => {
              onRentTypeChange("actual");
              console.log('Rent Type:', 'actual');
            }}
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
            checked={rentType === "range"}
            onChange={() => {
              onRentTypeChange("range");
              console.log('Rent Type:', 'range');
            }}
            className="w-4 h-4 text-orange-600"
          />
          <label htmlFor="range" className="text-sm text-gray-700">
            Range
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yearly Rent
        </label>
        <input
          type="text"
          value={yearlyRent}
          onChange={(e) => {
            onYearlyRentChange(e.target.value);
            console.log('Yearly Rent:', e.target.value);
          }}
          placeholder=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default RentInput;
