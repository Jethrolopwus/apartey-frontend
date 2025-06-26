"use client";
import React from "react";
import { useReviewForm } from "@/app/context/RevievFormContext";

const AmenitiesAccessibility: React.FC = () => {
  const { location, setLocation } = useReviewForm();

  // Appliances
  const appliancesFixtures = location?.appliancesFixtures || [];
  const APPLIANCE_MAP: Record<string, string> = {
    oven: "Oven",
    washingMachine: "Washing machine",
    refrigerator: "Refrigerator",
    garbageDisposal: "Garbage disposal",
    airConditioner: "Air Conditioning",
    dryer: "Dryer",
    microwave: "Microwave",
  };
  const isApplianceSelected = (appliance: string): boolean =>
    appliancesFixtures.includes(APPLIANCE_MAP[appliance] || appliance);
  const toggleAppliance = (appliance: string, checked: boolean) => {
    let updated: string[];
    const mapped = APPLIANCE_MAP[appliance] || appliance;
    if (checked) {
      updated = [...appliancesFixtures, mapped];
    } else {
      updated = appliancesFixtures.filter((item) => item !== mapped);
    }
    setLocation({ ...location, appliancesFixtures: updated });
  };

  // Landlord Languages
  const landlordLanguages = location?.landlordLanguages || [];
  const LANGUAGE_MAP: Record<string, string> = {
    english: "English",
    french: "French",
    spanish: "Spanish",
    german: "German",
    chinese: "Chinese",
  };
  const isLanguageSelected = (language: string): boolean =>
    landlordLanguages.includes(LANGUAGE_MAP[language] || language);
  const toggleLanguage = (language: string, checked: boolean) => {
    let updated: string[];
    const mapped = LANGUAGE_MAP[language] || language;
    if (checked) {
      updated = [...landlordLanguages, mapped];
    } else {
      updated = landlordLanguages.filter((item) => item !== mapped);
    }
    setLocation({ ...location, landlordLanguages: updated });
  };

  // Building Facilities
  const buildingFacilities = location?.buildingFacilities || [];
  const FACILITY_MAP: Record<string, string> = {
    wheelchairAccessible: "Wheelchair accessible",
    elevator: "Elevator",
    brailleSigns: "Braille signs",
    audioAssistance: "Audio assistance",
    gym: "Gym",
    pool: "Pool",
    parking: "Parking lot",
    security: "Security system",
  };
  const isFacilitySelected = (facility: string): boolean =>
    buildingFacilities.includes(FACILITY_MAP[facility] || facility);
  const toggleFacility = (facility: string, checked: boolean) => {
    let updated: string[];
    const mapped = FACILITY_MAP[facility] || facility;
    if (checked) {
      updated = [...buildingFacilities, mapped];
    } else {
      updated = buildingFacilities.filter((item) => item !== mapped);
    }
    setLocation({ ...location, buildingFacilities: updated });
  };

  // Custom Inputs
  const handleCustomInput = (type: "appliance" | "language", value: string) => {
    if (!value.trim()) return;
    const field =
      type === "appliance" ? "appliancesFixtures" : "landlordLanguages";
    const current = location?.[field] || [];
    const newItems = value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);
    const existingItems = [...current];
    const itemsToAdd = newItems.filter((item) => !existingItems.includes(item));
    const updated = [...existingItems, ...itemsToAdd];
    setLocation({ ...location, [field]: updated });
  };

  const handleCustomFacilityInput = (value: string) => {
    if (!value.trim()) return;
    const current = location?.buildingFacilities || [];
    const newItems = value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);
    const existingItems = [...current];
    const itemsToAdd = newItems.filter((item) => !existingItems.includes(item));
    const updated = [...existingItems, ...itemsToAdd];
    setLocation({ ...location, buildingFacilities: updated });
  };

  // Accessibility
  const nearestGroceryStore = location?.nearestGroceryStore || "";
  const nearestPark = location?.nearestPark || "";
  const nearestRestaurant = location?.nearestRestaurant || "";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Amenities & Accessibility
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
                  className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
                />
                <label
                  htmlFor={appliance}
                  className="text-sm text-gray-700 capitalize"
                >
                  {APPLIANCE_MAP[appliance] || appliance}
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
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Selected Appliances Display */}
          {(appliancesFixtures.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-[#C85212] mb-2">
                Selected Appliances:
              </h4>
              <div className="flex flex-wrap gap-2">
                {appliancesFixtures.map((appliance, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-[#C85212] text-xs font-medium rounded-full"
                  >
                    {APPLIANCE_MAP[appliance] || appliance}
                  </span>
                ))}
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
                    className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <label
                    htmlFor={language}
                    className="text-sm text-gray-700 capitalize"
                  >
                    {LANGUAGE_MAP[language] || language}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Selected Languages Display */}
          {(landlordLanguages.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-[#C85212] mb-2">
                Selected Languages:
              </h4>
              <div className="flex flex-wrap gap-2">
                {landlordLanguages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-[#C85212] text-xs font-medium rounded-full capitalize"
                  >
                    {LANGUAGE_MAP[language] || language}
                  </span>
                ))}
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
                value={nearestGroceryStore}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    nearestGroceryStore: e.target.value,
                  })
                }
                className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="0-5 min walk">0-5 min walk</option>
                <option value="6-10 min walk">6-10 min walk</option>
                <option value="11-20 min walk">11-20 min walk</option>
                <option value="21-30 min walk'">21-30 min walk'</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Park
              </label>
              <select
                value={nearestPark}
                onChange={(e) =>
                  setLocation({ ...location, nearestPark: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="0-5 min walk">0-5 min walk</option>
                <option value="6-10 min walk">6-10 min walk</option>
                <option value="11-20 min walk">11-20 min walk</option>
                <option value="21-30 min walk'">21-30 min walk'</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Restaurant
              </label>
              <select
                value={nearestRestaurant}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    nearestRestaurant: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
              >
                <option value="">Select distance</option>
                <option value="0-5 min walk">0-5 min walk</option>
                <option value="6-10 min walk">6-10 min walk</option>
                <option value="11-20 min walk">11-20 min walk</option>
                <option value="21-30 min walk'">21-30 min walk'</option>
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
                  className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label
                  htmlFor={facility}
                  className="text-sm text-gray-700 capitalize"
                >
                  {FACILITY_MAP[facility] || facility}
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
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Selected Facilities Display */}
          {(buildingFacilities.length ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-[#C85212] mb-2">
                Selected Facilities:
              </h4>
              <div className="flex flex-wrap gap-2">
                {buildingFacilities.map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-[#C85212] text-xs font-medium rounded-full"
                  >
                    {FACILITY_MAP[facility] || facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesAccessibility;
