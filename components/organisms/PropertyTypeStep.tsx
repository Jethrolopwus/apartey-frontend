"use client";

import React, { useState } from "react";
import { Building2, Home, Building, Car, ChevronRight } from "lucide-react";
import { StepProps, CategoryType, PropertyType, PropertyCondition, PetPolicy } from "@/types/propertyListing";

const PropertyTypeStep: React.FC<StepProps> = ({
  onNext,
  formData,
  setFormData,
}) => {
  const propertyTypes = [
    { id: "Apartment", label: "Apartment", icon: Building2 },
    { id: "House", label: "House", icon: Home },
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

  const [category, setCategory] = useState<CategoryType>(formData.category || "Rent");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    formData.propertyType || "Apartment"
  );
  const [condition, setCondition] = useState<PropertyCondition>(
    formData.condition || "Good Condition"
  );
  const [petPolicy, setPetPolicy] = useState<PetPolicy>(
    formData.petPolicy || "pet-friendly"
  );

  // Validation state
  const [errors, setErrors] = useState<{
    category?: string;
    propertyType?: string;
    condition?: string;
    petPolicy?: string;
  }>({});

  // Clear specific error when user makes a selection
  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof typeof errors];
      return newErrors;
    });
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (!propertyType) {
      newErrors.propertyType = "Please select a property type";
    }

    if (!condition) {
      newErrors.condition = "Please select the property condition";
    }

    if (!petPolicy) {
      newErrors.petPolicy = "Please select a pet policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

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
              onClick={() => {
                setCategory(cat.id as CategoryType);
                clearError('category');
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === cat.id
                  ? "text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                backgroundColor: category === cat.id ? "#FED7C3" : undefined,
              }}
            >
              {cat.label === "Sale"
                ? "Sell Home"
                : cat.label === "Rent"
                ? "Rent Home"
                : "Swap Home"}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600">{errors.category}</p>
        )}
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
                onClick={() => {
                  setPropertyType(type.id as PropertyType);
                  clearError('propertyType');
                }}
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
        {errors.propertyType && (
          <p className="mt-2 text-sm text-red-600">{errors.propertyType}</p>
        )}
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
                onChange={() => {
                  setCondition(cond.id as "Good Condition" | "New Building" | "Renovated");
                  clearError('condition');
                }}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">{cond.label}</span>
            </label>
          ))}
        </div>
        {errors.condition && (
          <p className="mt-2 text-sm text-red-600">{errors.condition}</p>
        )}
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
              onChange={() => {
                setPetPolicy("pet-friendly");
                clearError('petPolicy');
              }}
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
              onChange={() => {
                setPetPolicy("no-pets");
                clearError('petPolicy');
              }}
              className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-3 text-sm text-gray-700">No Pets Allowed</span>
          </label>
        </div>
        {errors.petPolicy && (
          <p className="mt-2 text-sm text-red-600">{errors.petPolicy}</p>
        )}
      </div>

      {/* Next Button */}
      <div className="border-t-2 border-[#C85212] mt-8 pt-8"></div>
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
