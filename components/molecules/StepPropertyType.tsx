"use client";
import React from "react";

interface PropertyTypeStepData {
  category: "rent" | "sale" | string;
  propertyType: "apartment" | "house" | "condo" | string;
  condition: "good" | "fair" | "excellent" | "poor" | string;
}

interface StepPropertyTypeProps {
  data: PropertyTypeStepData;
  update: (patch: Partial<PropertyTypeStepData>) => void;
  next: () => void;
}

const StepPropertyType: React.FC<StepPropertyTypeProps> = ({
  data,
  update,
  next,
}) => {
  const handleCategoryChange = (category: string) => {
    update({ category });
  };

  const handlePropertyTypeChange = (propertyType: string) => {
    update({ propertyType });
  };

  const handleConditionChange = (condition: string) => {
    update({ condition });
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Property Details
        </h2>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <div className="flex gap-4">
            {["rent", "sale"].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  data.category === category
                    ? "bg-[#C85212] text-white border-[#C85212]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#C85212]"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type
          </label>
          <div className="flex gap-4 flex-wrap">
            {["apartment", "house", "condo"].map((type) => (
              <button
                key={type}
                onClick={() => handlePropertyTypeChange(type)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  data.propertyType === type
                    ? "bg-[#C85212] text-white border-[#C85212]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#C85212]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Condition Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Condition
          </label>
          <div className="flex gap-4 flex-wrap">
            {["excellent", "good", "fair", "poor"].map((condition) => (
              <button
                key={condition}
                onClick={() => handleConditionChange(condition)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  data.condition === condition
                    ? "bg-[#C85212] text-white border-[#C85212]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#C85212]"
                }`}
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2 bg-[#C85212] text-white rounded-lg hover:bg-[#B44A0E] transition-colors"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepPropertyType;
