'use client';
import React, { useState } from 'react';
import Button from '../atoms/Buttons/ActionButton';


type PropertyCategory = 'sell' | 'rent' | 'swap';
type PropertyType = 'apartment' | 'house' | 'commercial' | 'room' | 'garage';
type Condition = 'good' | 'new' | 'renovated';

interface StepPropertyTypeProps {
  formData: {
    category: PropertyCategory;
    propertyType: PropertyType;
    condition: Condition;
  };
  updateFormData: (data: Partial<StepPropertyTypeProps['formData']>) => void;
  onNext: () => void;
}

const StepPropertyType: React.FC<StepPropertyTypeProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const categories: { label: string; value: PropertyCategory }[] = [
    { label: 'Sell property', value: 'sell' },
    { label: 'Rent property', value: 'rent' },
    { label: 'Home Swap', value: 'swap' },
  ];

  const propertyTypes: { label: string; value: PropertyType }[] = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Room', value: 'room' },
    { label: 'Garage', value: 'garage' },
  ];

  const conditions: { label: string; value: Condition }[] = [
    { label: 'Good Condition', value: 'good' },
    { label: 'New building', value: 'new' },
    { label: 'Renovated', value: 'renovated' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Property type</h2>

      {/* Category */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Category *</p>
        <div className="flex gap-3 flex-wrap">
          {categories.map((item) => (
            <button
              key={item.value}
              className={`px-4 py-2 rounded-full border ${
                formData.category === item.value
                  ? 'bg-orange-100 text-orange-600 border-orange-600'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
              onClick={() => updateFormData({ category: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Property type *</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {propertyTypes.map((item) => (
            <button
              key={item.value}
              className={`border p-3 rounded-md text-sm text-center ${
                formData.propertyType === item.value
                  ? 'bg-orange-100 border-orange-600 text-orange-600'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              onClick={() => updateFormData({ propertyType: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Condition of the property *
        </p>
        <div className="flex flex-col gap-2">
          {conditions.map((item) => (
            <label key={item.value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="condition"
                checked={formData.condition === item.value}
                onChange={() => updateFormData({ condition: item.value })}
                className="form-radio text-orange-600"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700">
          Next →
        </Button>
      </div>
    </div>
  );
};

export default StepPropertyType;
