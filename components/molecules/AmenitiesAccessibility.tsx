"use client";
import React from "react";

interface AmenitiesAccessibilityProps {
  appliances: string[];
  buildingFacilities: string[];
  costOfRepairsCoverage: string[];
  onAppliancesChange: (appliances: string[]) => void;
  onBuildingFacilitiesChange: (facilities: string[]) => void;
  onCostOfRepairsCoverageChange: (coverage: string[]) => void;
  landlordLanguages: string[];
  onLandlordLanguagesChange: (languages: string[]) => void;
}

const AmenitiesAccessibility: React.FC<AmenitiesAccessibilityProps> = ({
  appliances,
  buildingFacilities,
  costOfRepairsCoverage,
  onAppliancesChange,
  onBuildingFacilitiesChange,
  onCostOfRepairsCoverageChange,
  landlordLanguages,
  onLandlordLanguagesChange,
}) => {
  // Appliances
  const APPLIANCE_MAP: Record<string, string> = {
    oven: "Oven",
    washingMachine: "Washing machine",
    refrigerator: "Refrigerator",
    Dishwasher: "Dishwasher",
    airConditioner: "Air Conditioning",
    dryer: "Dryer",
    microwave: "Microwave",
  };

  const isApplianceSelected = (appliance: string): boolean =>
    appliances.includes(APPLIANCE_MAP[appliance] || appliance);

  const toggleAppliance = (appliance: string, checked: boolean) => {
    let updated: string[];
    const mapped = APPLIANCE_MAP[appliance] || appliance;
    if (checked) {
      updated = [...appliances, mapped];
    } else {
      updated = appliances.filter((item) => item !== mapped);
    }
    onAppliancesChange(updated);
  };

  // Building Facilities
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
    onBuildingFacilitiesChange(updated);
  };

  // Custom Inputs
  const handleCustomInput = (
    type: "appliance" | "facility" | "coverage",
    value: string
  ) => {
    if (!value.trim()) return;
    const newItems = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (type === "appliance") {
      const existingItems = [...appliances];
      const itemsToAdd = newItems.filter(
        (item) => !existingItems.includes(item)
      );
      onAppliancesChange([...existingItems, ...itemsToAdd]);
    } else if (type === "facility") {
      const existingItems = [...buildingFacilities];
      const itemsToAdd = newItems.filter(
        (item) => !existingItems.includes(item)
      );
      onBuildingFacilitiesChange([...existingItems, ...itemsToAdd]);
    } else if (type === "coverage") {
      const existingItems = [...costOfRepairsCoverage];
      const itemsToAdd = newItems.filter(
        (item) => !existingItems.includes(item)
      );
      onCostOfRepairsCoverageChange([...existingItems, ...itemsToAdd]);
    }
  };

  return (
    <div>
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
              "Dishwasher",
              "airConditioner",
              "dryer",
              "microwave",
            ].map((appliance) => (
              <div key={appliance} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={appliance}
                  checked={isApplianceSelected(appliance)}
                  onChange={(e) => {
                    toggleAppliance(appliance, e.target.checked);
                    console.log(
                      "Appliance:",
                      APPLIANCE_MAP[appliance] || appliance,
                      e.target.checked
                    );
                  }}
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
                console.log("Custom Appliance:", e.target.value);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Selected Appliances Display */}
          {appliances.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-[#C85212] mb-2">
                Selected Appliances:
              </h4>
              <div className="flex flex-wrap gap-2">
                {appliances.map((appliance, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-[#C85212] text-xs font-medium rounded-full"
                  >
                    {appliance}
                  </span>
                ))}
              </div>
            </div>
          )}
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
              "intercom",
              "storage",
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
                  onChange={(e) => {
                    toggleFacility(facility, e.target.checked);
                    console.log(
                      "Facility:",
                      FACILITY_MAP[facility] || facility,
                      e.target.checked
                    );
                  }}
                  className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
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
                handleCustomInput("facility", e.target.value);
                console.log("Custom Facility:", e.target.value);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
            />
          </div>

          {/* Selected Facilities Display */}
          {buildingFacilities.length > 0 && (
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
                    {facility}
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
            Languages spoken by the landlord/property management
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              "English",
              "French",
              "Italian",
              "Estonian",
              "Spanish",
              "German",
            ].map((lang) => (
              <label key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={lang}
                  checked={landlordLanguages.includes(lang)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onLandlordLanguagesChange([...landlordLanguages, lang]);
                    } else {
                      onLandlordLanguagesChange(
                        landlordLanguages.filter((l) => l !== lang)
                      );
                    }
                    console.log("Landlord Language:", lang, e.target.checked);
                  }}
                  className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
                />
                <span className="text-sm text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="Other"
                checked={landlordLanguages.includes("Other")}
                onChange={(e) => {
                  if (e.target.checked) {
                    onLandlordLanguagesChange([...landlordLanguages, "Other"]);
                  } else {
                    onLandlordLanguagesChange(
                      landlordLanguages.filter((l) => l !== "Other")
                    );
                  }
                  console.log("Landlord Language:", "Other", e.target.checked);
                }}
                className="w-4 h-4 text-[#C85212] bg-gray-100 border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
              />
              <span className="text-sm text-gray-700">Others:</span>
              <input
                type="text"
                placeholder="Enter language"
                className="border border-gray-300 py-1 px-3 focus:outline-none text-sm text-gray-700 bg-transparent"
                style={{ borderBottom: "", width: "120px" }}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value && landlordLanguages.includes("Other")) {
                    const updatedLanguages = landlordLanguages
                      .filter((l) => l !== "Other")
                      .concat(value);
                    onLandlordLanguagesChange(updatedLanguages);
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {/* Selected Languages Display */}
          {landlordLanguages.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="text-sm font-medium text-[#C85212] mb-2">
                Selected Languages:
              </h4>
              <div className="flex flex-wrap gap-2">
                {landlordLanguages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-[#C85212] text-xs font-medium rounded-full"
                  >
                    {lang}
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
