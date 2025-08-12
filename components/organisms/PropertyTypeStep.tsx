"use client";

import React, { useState } from "react";
import { Building2, Home, Building, Car, ChevronRight } from "lucide-react";
import { StepProps } from "@/types/generated";

const PropertyTypeStep: React.FC<StepProps> = ({
  onNext,
  formData,
  setFormData,
}) => {
  const propertyTypes = [
    { id: "House", label: "House", icon: Home },
    { id: "Apartment", label: "Apartment", icon: Building2 },
    { id: "Room", label: "Room", icon: Building2 },
    { id: "Commercial", label: "Commercial", icon: Building },
    { id: "Garage", label: "Garage", icon: Car },
  ];
  const categories = [
    { id: "Sale", label: "Sale" },
    { id: "Rent", label: "Rent" },
    { id: "Swap", label: "Swap" },
  ];
  const conditions = [
    { id: "Good Condition", label: "Good Condition" },
    { id: "New Building", label: "New Building" },
    { id: "Renovated", label: "Renovated" },
  ];

  const [category, setCategory] = useState(formData.category || "Rent");
  const [propertyType, setPropertyType] = useState(
    formData.propertyType || "Apartment"
  );
  const [condition, setCondition] = useState<"Good Condition" | "New Building" | "Renovated">(
    (formData.condition as "Good Condition" | "New Building" | "Renovated") || "Good Condition"
  );
  const [petPolicy, setPetPolicy] = useState(
    formData.petPolicy || "pet-friendly"
  );

  const handleNext = () => {
    if (setFormData) {
      setFormData({
        ...formData,
        category,
        propertyType,
        condition,
        petPolicy,
      });
    }
    onNext();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Property type
      </h1>

      {/* Category */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === cat.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                backgroundColor:
                  category === cat.id && cat.id === "Rent"
                    ? "#FED7C3"
                    : undefined,
              }}
            >
              {cat.label === "Sale"
                ? "Sell property"
                : cat.label === "Rent"
                ? "List for Rent"
                : "Home Swap"}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Property type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {propertyTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setPropertyType(type.id)}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                  propertyType === type.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <IconComponent
                  className={`w-8 h-8 mb-2 ${
                    propertyType === type.id
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    propertyType === type.id
                      ? "text-orange-900"
                      : "text-gray-600"
                  }`}
                >
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Condition of the property <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {conditions.map((cond) => (
            <label key={cond.id} className="flex items-center">
              <input
                type="radio"
                name="condition"
                value={cond.id}
                checked={condition === cond.id}
                onChange={() => setCondition(cond.id as "Good Condition" | "New Building" | "Renovated")}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">{cond.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Policy */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Pet Policy <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="petPolicy"
              value="pet-friendly"
              checked={petPolicy === "pet-friendly"}
              onChange={() => setPetPolicy("pet-friendly")}
              className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-3 text-sm text-gray-700">
              Pet-Friendly (All pets welcome)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="petPolicy"
              value="no-pets"
              checked={petPolicy === "no-pets"}
              onChange={() => setPetPolicy("no-pets")}
              className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-3 text-sm text-gray-700">No Pets Allowed</span>
          </label>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#C85212" }}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeStep;
