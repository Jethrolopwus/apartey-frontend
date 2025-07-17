"use client";

import { useState, useEffect, useCallback } from "react";
import CountSelector from "@/components/molecules/CountSelector";
import CheckboxGrid from "@/components/molecules/CheckboxGrid";
import { PropertyListingPayload } from "@/types/propertyListing";

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

// Type-safe property existence check for propertyDetails
function hasPropertyDetails(obj: unknown): obj is { propertyDetails: unknown } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'propertyDetails' in obj
  );
}

interface PropertyDetailsFormProps {
  formData: PropertyListingPayload | Partial<PropertyListingPayload>;
  setFormData: React.Dispatch<
    React.SetStateAction<
      PropertyListingPayload | Partial<PropertyListingPayload>
    >
  >;
}

const PropertyDetailsForm = ({
  formData,
  setFormData,
}: PropertyDetailsFormProps) => {
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
    price: (propertyDetails as Record<string, unknown>).price || "",
    currency: (propertyDetails as Record<string, unknown>).currency || "USD",
    negotiatedPrice: (propertyDetails as Record<string, unknown>).negotiatedPrice || false,
    totalFloors: (propertyDetails as Record<string, unknown>).totalFloors || "16",
    floor: (propertyDetails as Record<string, unknown>).floor || "12",
    totalAreaSqM: (propertyDetails as Record<string, unknown>).totalAreaSqM || "120",
    livingAreaSqM: (propertyDetails as Record<string, unknown>).livingAreaSqM || "86",
    kitchenAreaSqM: (propertyDetails as Record<string, unknown>).kitchenAreaSqM || "25",
    bedrooms: (propertyDetails as Record<string, unknown>).bedrooms || 3,
    bathrooms: (propertyDetails as Record<string, unknown>).bathrooms || 2,
    parkingSpots: (propertyDetails as Record<string, unknown>).parkingSpots || 1,
    amenities: (propertyDetails as Record<string, unknown>).amenities || [],
    infrastructure: (propertyDetails as Record<string, unknown>).infrastructure || [],
    description: (propertyDetails as Record<string, unknown>).description || "",
    condition: (propertyDetails as Record<string, unknown>).condition || "Good Condition",
    petPolicy: (propertyDetails as Record<string, unknown>).petPolicy || "pet-friendly",
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

  const handleCountChange = (field: string) => (value: number | null) => {
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [field]: value }));
  };

  const handleCheckboxChange = (field: string) => (selected: string[]) => {
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [field]: selected }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [name]: newValue }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalData((prev: unknown) => ({ ...(prev as object || {}), [name]: value }));
  };

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Property details</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="totalFloors"
            className="block text-sm font-medium text-gray-700"
          >
            Total floors *
          </label>
          <input
            type="number"
            name="totalFloors"
            id="totalFloors"
            value={(localData as Record<string, unknown>).totalFloors as string}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="floor"
            className="block text-sm font-medium text-gray-700"
          >
            Floor *
          </label>
          <input
            type="number"
            name="floor"
            id="floor"
            value={(localData as Record<string, unknown>).floor as string}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="totalAreaSqM"
            className="block text-sm font-medium text-gray-700"
          >
            Total area *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              name="totalAreaSqM"
              id="totalAreaSqM"
              value={(localData as Record<string, unknown>).totalAreaSqM as string}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14"
              placeholder="0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">sq.m</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="livingAreaSqM"
            className="block text-sm font-medium text-gray-700"
          >
            Living area *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              name="livingAreaSqM"
              id="livingAreaSqM"
              value={(localData as Record<string, unknown>).livingAreaSqM as string}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14"
              placeholder="0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">sq.m</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="kitchenAreaSqM"
            className="block text-sm font-medium text-gray-700"
          >
            Kitchen area *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              name="kitchenAreaSqM"
              id="kitchenAreaSqM"
              value={(localData as Record<string, unknown>).kitchenAreaSqM as string}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14"
              placeholder="0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">sq.m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <CountSelector
          label="Bedrooms *"
          value={(localData as Record<string, unknown>).bedrooms as number}
          onChange={handleCountChange("bedrooms")}
        />
        <CountSelector
          label="Bathrooms *"
          value={(localData as Record<string, unknown>).bathrooms as number}
          onChange={handleCountChange("bathrooms")}
        />
        <CountSelector
          label="Parking spots *"
          value={(localData as Record<string, unknown>).parkingSpots as number}
          onChange={handleCountChange("parkingSpots")}
        />
      </div>

      <CheckboxGrid
        title="Amenities"
        options={amenities}
        selectedOptions={(localData as Record<string, unknown>).amenities as string[]}
        onChange={handleCheckboxChange("amenities")}
      />

      <CheckboxGrid
        title="Infrastructure"
        subtitle="(up to 500 meters)"
        options={infrastructure}
        selectedOptions={(localData as Record<string, unknown>).infrastructure as string[]}
        onChange={handleCheckboxChange("infrastructure")}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2 mt-1">
          Here you can let your imagination run wild and describe the property
          in the best possible way!
        </p>
        <textarea
          name="description"
          id="description"
          value={(localData as Record<string, unknown>).description as string}
          onChange={handleInputChange}
          rows={4}
          required
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          placeholder="Describe your property"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condition *
        </label>
        <select
          name="condition"
          id="condition"
          value={(localData as Record<string, unknown>).condition as string}
          onChange={handleSelectChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        >
          <option value="Good Condition">Good Condition</option>
          <option value="New Building">New Building</option>
          <option value="Renovated">Renovated</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
