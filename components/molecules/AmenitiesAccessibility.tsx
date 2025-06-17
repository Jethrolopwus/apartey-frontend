"use client";
import React from "react";
import { UnlistedPropertyReview } from "@/types/generated";
interface AmenitiesAccessibilityProps {
  formData: UnlistedPropertyReview;
  updateFormData: (field: string, value: any) => void;
  updateNestedFormData: (
    section: keyof UnlistedPropertyReview,
    field: string,
    value: any
  ) => void;
  getCurrentSubStepTitle: () => string;
}

const AmenitiesAccessibility = ({
  formData,
  updateFormData,
  updateNestedFormData,
  getCurrentSubStepTitle,
}: AmenitiesAccessibilityProps) => {
  // Helper function to check if an appliance is selected
  const isApplianceSelected = (appliance: string): boolean => {
    return (
      formData?.stayDetails?.appliancesFixtures?.includes(appliance) ?? false
    );
  };

  // Helper function to toggle appliance selection
  const toggleAppliance = (appliance: string, checked: boolean) => {
    const current = formData?.stayDetails?.appliancesFixtures ?? [];
    let updated: string[];

    if (checked) {
      updated = [...current, appliance];
    } else {
      updated = current.filter((item) => item !== appliance);
    }

    updateNestedFormData("stayDetails", "appliancesFixtures", updated);
  };

  // Helper function to check if a language is selected
  const isLanguageSelected = (language: string): boolean => {
    return (
      formData?.stayDetails?.landlordLanguages?.includes(language) ?? false
    );
  };

  // Helper function to toggle language selection
  const toggleLanguage = (language: string, checked: boolean) => {
    const current = formData?.stayDetails?.landlordLanguages ?? [];
    let updated: string[];

    if (checked) {
      updated = [...current, language];
    } else {
      updated = current.filter((item) => item !== language);
    }

    updateNestedFormData("stayDetails", "landlordLanguages", updated);
  };

  // Helper function to check if a building facility is selected
  const isFacilitySelected = (facility: string): boolean => {
    return (
      formData?.stayDetails?.buildingFacilities?.includes(facility) ?? false
    );
  };

  // Helper function to toggle building facility selection
  const toggleFacility = (facility: string, checked: boolean) => {
    const current = formData?.stayDetails?.buildingFacilities ?? [];
    let updated: string[];

    if (checked) {
      updated = [...current, facility];
    } else {
      updated = current.filter((item) => item !== facility);
    }

    updateNestedFormData("stayDetails", "buildingFacilities", updated);
  };

  // Helper function to handle custom text input
  const handleCustomInput = (type: "appliance" | "language", value: string) => {
    if (!value.trim()) return;

    const fieldMap = {
      appliance: "appliancesFixtures",
      language: "landlordLanguages",
    } as const;

    const field = fieldMap[type];
    const current = formData?.stayDetails?.[field] ?? [];

    // Split the input by commas and clean up
    const newItems = value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    // Get predefined options for filtering
    const predefinedOptions =
      type === "appliance"
        ? [
            "oven",
            "washingMachine",
            "refrigerator",
            "garbageDisposal",
            "airConditioner",
            "dryer",
            "microwave",
          ]
        : ["english", "french", "spanish", "german", "chinese"];

    // Keep all existing items (both predefined and custom)
    // Only add new items that aren't already in the list
    const existingItems = [...current];
    const itemsToAdd = newItems.filter((item) => !existingItems.includes(item));

    const updated = [...existingItems, ...itemsToAdd];

    updateNestedFormData("stayDetails", field, updated);
  };

  // Helper function to handle custom facility input
  const handleCustomFacilityInput = (value: string) => {
    if (!value.trim()) return;

    const current = formData?.stayDetails?.buildingFacilities ?? [];

    const newItems = value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    // Keep all existing items and only add new ones that aren't already in the list
    const existingItems = [...current];
    const itemsToAdd = newItems.filter((item) => !existingItems.includes(item));

    const updated = [...existingItems, ...itemsToAdd];

    updateNestedFormData("stayDetails", "buildingFacilities", updated);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {getCurrentSubStepTitle()}
        </h2>
        <p className="text-gray-600">
          Tell us about the property's amenities and location
        </p>
      </div>

      <div className="space-y-6">
        {/* Appliances */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Appliances & Fixtures
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the appliances available in the property
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "oven",
              "washingMachine",
              "refrigerator",
              "garbageDisposal",
              "airConditioner",
              "dryer",
              "microwave",
            ].map((appliance) => (
              <div key={appliance} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={appliance}
                  checked={isApplianceSelected(appliance)}
                  onChange={(e) => toggleAppliance(appliance, e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label
                  htmlFor={appliance}
                  className="text-sm text-gray-700 capitalize"
                >
                  {appliance.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>

          {/* Custom Appliance Input */}
          <div className="mt-4">
            <label
              htmlFor="customAppliance"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Other Appliances (comma-separated)
            </label>
            <input
              type="text"
              id="customAppliance"
              placeholder="Enter other appliances"
              onBlur={(e) => {
                handleCustomInput("appliance", e.target.value);
                e.target.value = ""; // Clear input after processing
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Selected Appliances Display */}
          {(formData?.stayDetails?.appliancesFixtures?.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-orange-800 mb-2">
                Selected Appliances:
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.stayDetails.appliancesFixtures.map(
                  (appliance, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                    >
                      {appliance.replace(/([A-Z])/g, " $1")}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Landlord Languages */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Landlord Languages</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the languages spoken by the landlord
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["english", "french", "spanish", "german", "chinese"].map(
              (language) => (
                <div key={language} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={language}
                    checked={isLanguageSelected(language)}
                    onChange={(e) => toggleLanguage(language, e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <label
                    htmlFor={language}
                    className="text-sm text-gray-700 capitalize"
                  >
                    {language}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Custom Language Input */}
          <div className="mt-4">
            <label
              htmlFor="customLanguage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Other Languages (comma-separated)
            </label>
            <input
              type="text"
              id="customLanguage"
              placeholder="Enter other languages"
              onBlur={(e) => {
                handleCustomInput("language", e.target.value);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Selected Languages Display */}
          {(formData?.stayDetails?.landlordLanguages?.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-orange-800 mb-2">
                Selected Languages:
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.stayDetails.landlordLanguages.map(
                  (language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full capitalize"
                    >
                      {language}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accessibility */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Accessibility</h3>
          <p className="text-sm text-gray-600 mb-4">
            Information about the property's accessibility features
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Grocery Store
              </label>
              <select
                value={formData?.accessibility?.nearestGroceryStore ?? ""}
                onChange={(e) =>
                  updateNestedFormData(
                    "accessibility",
                    "nearestGroceryStore",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="Very Close">Very Close</option>
                <option value="Close">Close</option>
                <option value="Moderate">Moderate</option>
                <option value="Far">Far</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Park
              </label>
              <select
                value={formData?.accessibility?.nearestPark ?? ""}
                onChange={(e) =>
                  updateNestedFormData(
                    "accessibility",
                    "nearestPark",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="Very Close">Very Close</option>
                <option value="Close">Close</option>
                <option value="Moderate">Moderate</option>
                <option value="Far">Far</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Restaurant
              </label>
              <select
                value={formData?.accessibility?.nearestRestaurant ?? ""}
                onChange={(e) =>
                  updateNestedFormData(
                    "accessibility",
                    "nearestRestaurant",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="Very Close">Very Close</option>
                <option value="Close">Close</option>
                <option value="Moderate">Moderate</option>
                <option value="Far">Far</option>
              </select>
            </div>
          </div>
        </div>

        {/* Building Facilities */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Building Facilities
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the facilities available in the building
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "wheelchairAccessible",
              "elevator",
              "brailleSigns",
              "audioAssistance",
              "gym",
              "pool",
              "parking",
              "security",
            ].map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={facility}
                  checked={isFacilitySelected(facility)}
                  onChange={(e) => toggleFacility(facility, e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label
                  htmlFor={facility}
                  className="text-sm text-gray-700 capitalize"
                >
                  {facility.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>

          {/* Custom Facility Input */}
          <div className="mt-4">
            <label
              htmlFor="customFacility"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Other Facilities (comma-separated)
            </label>
            <input
              type="text"
              id="customFacility"
              placeholder="Enter other facilities"
              onBlur={(e) => {
                handleCustomFacilityInput(e.target.value);
                e.target.value = ""; // Clear input after processing
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Selected Facilities Display */}
          {(formData?.stayDetails?.buildingFacilities?.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-orange-800 mb-2">
                Selected Facilities:
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.stayDetails.buildingFacilities.map(
                  (facility, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                    >
                      {facility.replace(/([A-Z])/g, " $1")}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesAccessibility;
