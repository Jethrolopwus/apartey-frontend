"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Calendar, Home, Car, Bath } from 'lucide-react';
import { StepProps } from '@/types/generated';
import { PropertyListingPayload } from '@/types/propertyListing';

interface PropertyDetailsStepProps extends StepProps {
  formData: PropertyListingPayload | Partial<PropertyListingPayload>;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingPayload | Partial<PropertyListingPayload>>>;
}

// Form data interface for validation
interface PropertyDetailsFormData {
  description: string;
}

// Backend: AmenitiesEnum
const amenities = [
  "TV set",
  "Washing machine",
  "Kitchen",
  "Air conditioning",
  "Separate workplace",
  "Refrigerator",
  "Drying machine",
  "Closet",
  "Patio",
  "Fireplace",
  "Shower cabin",
  "Whirlpool",
  "Security cameras",
  "Balcony",
  "Bar",
];

// Backend: InfrastructureEnum
const infrastructure = [
  "Schools",
  "Parking lot",
  "Shop",
  "Kindergarten",
  "Sports center",
  "Shopping center",
  "Underground",
  "Beauty salon",
  "Bank",
  "Cinema / theater",
  "Restaurant / cafe",
  "Park / green area",
];

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ onNext, onBack, formData, setFormData }) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PropertyDetailsFormData>({
    mode: 'onChange',
    defaultValues: {
      description: (() => {
        // Type-safe property existence check for propertyDetails
        function hasPropertyDetails(obj: unknown): obj is { propertyDetails: unknown } {
          return (
            typeof obj === 'object' &&
            obj !== null &&
            'propertyDetails' in obj
          );
        }

        let propertyDetails: unknown = {};
        const formDataObj = formData as unknown;
        if (
          hasPropertyDetails(formDataObj) &&
          typeof (formDataObj as { propertyDetails?: unknown }).propertyDetails === "object" &&
          (formDataObj as { propertyDetails?: unknown }).propertyDetails !== null
        ) {
          propertyDetails = (formDataObj as { propertyDetails: unknown }).propertyDetails;
        }

        return (propertyDetails as Record<string, unknown>).description as string || "";
      })(),
    }
  });

  // Watch description for real-time validation
  const watchedDescription = watch('description');

  // State to track if Listing Duration section should be shown
  const [showListingDuration, setShowListingDuration] = useState(false);

  // Type-safe property existence check for propertyDetails
  function hasPropertyDetails(obj: unknown): obj is { propertyDetails: unknown } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'propertyDetails' in obj
    );
  }

  let propertyDetails: unknown = {};
  const formDataObj = formData as unknown;
  if (
    hasPropertyDetails(formDataObj) &&
    typeof (formDataObj as { propertyDetails?: unknown }).propertyDetails === "object" &&
    (formDataObj as { propertyDetails?: unknown }).propertyDetails !== null
  ) {
    propertyDetails = (formDataObj as { propertyDetails: unknown }).propertyDetails;
  }

  const [localData, setLocalData] = useState<unknown>({
    totalFloors: (propertyDetails as Record<string, unknown>).totalFloors || "16",
    floor: (propertyDetails as Record<string, unknown>).floor || "12",
    totalAreaSqM: (propertyDetails as Record<string, unknown>).totalAreaSqM || "120",
    livingAreaSqM: (propertyDetails as Record<string, unknown>).livingAreaSqM || "86",
    bedroomAreaSqM: (propertyDetails as Record<string, unknown>).bedroomAreaSqM || "25",
    listingDuration: (propertyDetails as Record<string, unknown>).listingDuration || "June 18, 2025 - July 18, 2025",
    livingRooms: (propertyDetails as Record<string, unknown>).livingRooms || 3,
    bedrooms: (propertyDetails as Record<string, unknown>).bedrooms || 3,
    bathrooms: (propertyDetails as Record<string, unknown>).bathrooms || 2,
    parkingSpots: (propertyDetails as Record<string, unknown>).parkingSpots || 1,
    amenities: (propertyDetails as Record<string, unknown>).amenities || ["TV set", "Air conditioning", "Drying machine", "Washing machine", "Separate workplace", "Shower cabin", "Balcony"],
    infrastructure: (propertyDetails as Record<string, unknown>).infrastructure || ["Schools", "Kindergarten", "Parking lot", "Beauty salon", "Shopping center", "Park / green area"],
    description: watchedDescription || (propertyDetails as Record<string, unknown>).description || "",
  });

  const updateFormData = useCallback(() => {
    setFormData((prev) => ({
      ...(prev as object),
      propertyDetails: {
        ...((prev as { propertyDetails?: unknown }).propertyDetails || {}),
        ...(localData as object),
      },
    }) as PropertyListingPayload | Partial<PropertyListingPayload>);
  }, [localData, setFormData]);

  useEffect(() => {
    updateFormData();
  }, [updateFormData]);

  // Update localData when description changes
  useEffect(() => {
    setLocalData((prev: unknown) => ({ 
      ...(prev as object || {}), 
      description: watchedDescription 
    }));
  }, [watchedDescription]);

  // Effect to check if category is "Swap" and show/hide Listing Duration section
  useEffect(() => {
    if ((formData.category as string) === "Swap") {
      setShowListingDuration(true);
    } else {
      setShowListingDuration(false);
    }
  }, [formData.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [name]: value }));
  };

  const handleCountChange = (field: string) => (value: number | null) => {
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [field]: value }));
  };

  const handleCheckboxChange = (field: string) => (selected: string[]) => {
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [field]: selected }));
  };

  const handleQuickSelect = (duration: string) => {
    // This would update the listing duration based on selection
    console.log('Selected duration:', duration);
  };

  // Form submission handler
  const onSubmit = (data: PropertyDetailsFormData) => {
    // Update the description in localData before proceeding
    setLocalData((prev: unknown) => ({ 
      ...(prev as object || {}), 
      description: data.description 
    }));
    onNext();
  };

  const CountSelector = ({ label, value, onChange, icon: Icon }: { 
    label: string; 
    value: number; 
    onChange: (value: number | null) => void;
    icon?: React.ComponentType<{ className?: string }>;
  }) => {
    const options = ["Any", "1", "2", "3", "4", "5"];
    
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {options.map((option) => {
            const isSelected = option === "Any" ? value === null : value === parseInt(option);
            return (
              <button
                key={option}
                onClick={() => onChange(option === "Any" ? null : parseInt(option))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  isSelected
                    ? "border-gray-600 bg-gray-100 text-gray-800"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const CheckboxGrid = ({ 
    title, 
    subtitle, 
    options, 
    selectedOptions, 
    onChange 
  }: { 
    title: string; 
    subtitle?: string;
    options: string[]; 
    selectedOptions: string[]; 
    onChange: (selected: string[]) => void; 
  }) => {
    const handleToggle = (option: string) => {
      const newSelected = selectedOptions.includes(option)
        ? selectedOptions.filter(item => item !== option)
        : [...selectedOptions, option];
      onChange(newSelected);
    };

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleToggle(option)}
                className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl w-full space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Property details</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Property Information Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total floors <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalFloors"
                value={(localData as Record<string, unknown>).totalFloors as string}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="floor"
                value={(localData as Record<string, unknown>).floor as string}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total area (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalAreaSqM"
                value={(localData as Record<string, unknown>).totalAreaSqM as string}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Living area (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="livingAreaSqM"
                value={(localData as Record<string, unknown>).livingAreaSqM as string}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedroom area (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bedroomAreaSqM"
                value={(localData as Record<string, unknown>).bedroomAreaSqM as string}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Ad Promotion Section */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="adPromotion"
              className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-800"
            />
            <span className="text-sm font-medium text-gray-700">Ad promotion</span>
          </label>
        </div>

        {/* Listing Duration Section - Only show for Swap category */}
        {showListingDuration && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Duration
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>{(localData as Record<string, unknown>).listingDuration as string}</span>
                </div>
              </div>
              
              <div className="flex-1 ml-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="flex gap-2">
                  {["1 Month", "3 Months", "6 Months", "1 Year"].map((duration) => {
                    const isSelected = duration === "1 Month";
                    return (
                      <button
                        key={duration}
                        onClick={() => handleQuickSelect(duration)}
                        className={`px-4 py-2 border border-gray-200 rounded-md text-sm transition-all ${
                          isSelected
                            ? "bg-white text-gray-800"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {duration}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room and Parking Spot Count Selectors */}
        <div className="space-y-6">
          <CountSelector
            label="Living Rooms"
            value={(localData as Record<string, unknown>).livingRooms as number}
            onChange={handleCountChange("livingRooms")}
            icon={Home}
          />
          <CountSelector
            label="Bedrooms"
            value={(localData as Record<string, unknown>).bedrooms as number}
            onChange={handleCountChange("bedrooms")}
            icon={Home}
          />
          <CountSelector
            label="Bathrooms"
            value={(localData as Record<string, unknown>).bathrooms as number}
            onChange={handleCountChange("bathrooms")}
            icon={Bath}
          />
          <CountSelector
            label="Parking spots"
            value={(localData as Record<string, unknown>).parkingSpots as number}
            onChange={handleCountChange("parkingSpots")}
            icon={Car}
          />
        </div>

        {/* Amenities Checkbox Group */}
        <CheckboxGrid
          title="Amenities"
          options={amenities}
          selectedOptions={(localData as Record<string, unknown>).amenities as string[]}
          onChange={handleCheckboxChange("amenities")}
        />

        {/* Infrastructure Checkbox Group */}
        <CheckboxGrid
          title="Infrastructure"
          subtitle="(up to 500 meters)"
          options={infrastructure}
          selectedOptions={(localData as Record<string, unknown>).infrastructure as string[]}
          onChange={handleCheckboxChange("infrastructure")}
        />

        {/* Description Section */}
        <div className="space-y-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500">
            Here you can let your imagination run wild and describe the property
            in the best possible way!
          </p>
          <textarea
            {...register('description', { 
              required: 'Please enter a description',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
              maxLength: { value: 1000, message: 'Description must be less than 1000 characters' }
            })}
            id="description"
            rows={4}
            className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your property"
          ></textarea>
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="border-t-2 border-[#C85212] mt-8 pt-8"></div>
        <div className="flex justify-between">
          <button 
            type="button"
            onClick={onBack} 
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button 
            type="submit"
            className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ backgroundColor: '#C85212' }}
            disabled={!isValid}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyDetailsStep; 