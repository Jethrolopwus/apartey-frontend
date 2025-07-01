"use client";
import React from "react";

interface PropertyDetailsSectionProps {
  propertyType: string;
  propertyName: string;
  propertyDescription: string;
  onPropertyTypeChange: (value: string) => void;
  onPropertyNameChange: (value: string) => void;
  onPropertyDescriptionChange: (value: string) => void;
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({
  propertyType,
  propertyName,
  propertyDescription,
  onPropertyTypeChange,
  onPropertyNameChange,
  onPropertyDescriptionChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
      <p className="text-sm text-gray-600">Tell us about the property you're reviewing</p>
      
      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          value={propertyType}
          onChange={(e) => onPropertyTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Select property type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="studio">Studio</option>
          <option value="townhouse">Townhouse</option>
          <option value="duplex">Duplex</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Property Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name
        </label>
        <input
          type="text"
          value={propertyName}
          onChange={(e) => onPropertyNameChange(e.target.value)}
          placeholder="Enter property name or building name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Property Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Description
        </label>
        <textarea
          value={propertyDescription}
          onChange={(e) => onPropertyDescriptionChange(e.target.value)}
          placeholder="Brief description of the property..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
