"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Building, 
  Car,
  ChevronRight
} from 'lucide-react';
import { StepProps } from '@/types/generated';

const PropertyTypeStep: React.FC<StepProps> = ({ onNext, onBack, formData, setFormData }) => {
  const [category, setCategory] = useState(formData.category || 'rent');
  const [propertyType, setPropertyType] = useState(formData.propertyType || 'apartment');
  const [condition, setCondition] = useState(formData.condition || 'good');
  const [petPolicy, setPetPolicy] = useState(formData.petPolicy || 'pet-friendly');

  const propertyTypes = [
    { id: 'apartment', label: 'Apartment', icon: Building2 },
    { id: 'house', label: 'House', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'room', label: 'Room', icon: Building2 },
    { id: 'garage', label: 'Garage', icon: Car },
  ];

  const conditions = [
    { id: 'good', label: 'Good Condition' },
    { id: 'new', label: 'New Building' },
    { id: 'renovated', label: 'Renovated' },
  ];

  const petPolicies = [
    { id: 'pet-friendly', label: 'Pet-Friendly (All pets welcome)' },
    { id: 'cats-only', label: 'Cats Only' },
    { id: 'dogs-only', label: 'Dogs Only' },
    { id: 'small-pets', label: 'Small Pets Only (under 25 lbs)' },
    { id: 'no-pets', label: 'No Pets Allowed' },
  ];

  const handleNext = () => {
    if (setFormData) {
      setFormData({
        ...formData,
        category,
        propertyType,
        condition,
        petPolicy
      });
    }
    onNext();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Property type</h1>
      
      {/* Category */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setCategory('sell')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === 'sell'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sell property
          </button>
          <button
            onClick={() => setCategory('rent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === 'rent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{ backgroundColor: category === 'rent' ? '#FED7C3' : undefined }}
          >
            List for Rent
          </button>
          <button
            onClick={() => setCategory('swap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === 'swap'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home Swap
          </button>
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Property type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-4">
          {propertyTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setPropertyType(type.id)}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                  propertyType === type.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <IconComponent 
                  className={`w-8 h-8 mb-2 ${
                    propertyType === type.id ? 'text-orange-500' : 'text-gray-400'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  propertyType === type.id ? 'text-orange-900' : 'text-gray-600'
                }`}>
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
                onChange={(e) => setCondition(e.target.value)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">{cond.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Policy */}
      <div className="mb-12">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Pet Policy
        </label>
        <div className="space-y-3">
          {petPolicies.map((policy) => (
            <label key={policy.id} className="flex items-center">
              <input
                type="radio"
                name="petPolicy"
                value={policy.id}
                checked={petPolicy === policy.id}
                onChange={(e) => setPetPolicy(e.target.value)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">{policy.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C85212' }}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PropertyTypeStep; 