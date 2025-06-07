"use client";

const applianceOptions = [
  "Oven",
  "Refrigerator",
  "Washing machine",
  "Dishwasher",
  "Microwave",
  "Air Conditioning",
];

const facilityOptions = [
  "Elevator",
  "Parking lot",
  "Security system",
  "Gym",
  "Pool",
  "Garden",
];

const languageOptions = [
  "English",
  "Estonian",
  "Russian",
  "Finnish",
  "German",
  "Spanish",
];

type Props = {
  appliancesFixtures: string[];
  buildingFacilities: string[];
  landlordLanguages: string[];
  onApplianceChange: (appliance: string, checked: boolean) => void;
  onFacilityChange: (facility: string, checked: boolean) => void;
  onLanguageChange: (language: string, checked: boolean) => void;
};

export default function CheckboxGroups({
  appliancesFixtures,
  buildingFacilities,
  landlordLanguages,
  onApplianceChange,
  onFacilityChange,
  onLanguageChange,
}: Props) {
  return (
    <>
      {/* Appliances & Fixtures */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appliances & Fixtures
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {applianceOptions.map((appliance) => (
            <label key={appliance} className="flex items-center">
              <input
                type="checkbox"
                checked={appliancesFixtures?.includes(appliance) || false}
                onChange={(e) => onApplianceChange(appliance, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{appliance}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Building Facilities */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Building Facilities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {facilityOptions.map((facility) => (
            <label key={facility} className="flex items-center">
              <input
                type="checkbox"
                checked={buildingFacilities?.includes(facility) || false}
                onChange={(e) => onFacilityChange(facility, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Landlord Languages */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Landlord Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languageOptions.map((language) => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                checked={landlordLanguages?.includes(language) || false}
                onChange={(e) => onLanguageChange(language, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}