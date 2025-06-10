import React from 'react';

type FormData = AmenitiesAccessibilityProps["formData"];
type FormDataCategory = keyof FormData;

interface AmenitiesAccessibilityProps {
    formData: {
      appliances: Record<string, boolean>;
      landlordLanguages: {
        [key: string]: boolean | string;
        others: boolean;
        customLanguage: boolean;
      };
      nearestGroceryStore: string;
      nearestPark: string;
      nearestPublicTransport: string;
      accessibilityFeatures: Record<string, boolean>;
    };
  
    updateFormData: (field: string, value: string) => void;
    updateNestedFormData: (
      section: keyof AmenitiesAccessibilityProps["formData"],
      field: string,
      value: boolean | string
    ) => void;
  
    getCurrentSubStepTitle: () => string;
  }
  

const AmenitiesAccessibility = ({ formData, updateFormData, updateNestedFormData, getCurrentSubStepTitle }: AmenitiesAccessibilityProps) => {
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
              <div
                key={appliance}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={appliance}
                  checked={
                    formData.appliances[
                      appliance as keyof typeof formData.appliances
                    ]
                  }
                  onChange={(e) =>
                    updateNestedFormData(
                      "appliances",
                      appliance,
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-orange-600"
                />
                <label
                  htmlFor={appliance}
                  className="text-sm text-gray-700 capitalize"
                >
                  {appliance.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
            {/* Other Appliances */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="others"
                checked={formData.appliances.others}
                onChange={(e) =>
                  updateNestedFormData(
                    "appliances",
                    "others",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-orange-600"
              />
              <label
                htmlFor="others"
                className="text-sm text-gray-700"
              >
                Others
              </label>
            </div>
          </div>
        </div>

        {/* Landlord Languages */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Landlord Languages
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the languages spoken by the landlord
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "english",
              "french",
              "spanish",
              "german",
              "chinese",
            ].map((language) => (
              <div
                key={language}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={language}
                  checked={
                    Boolean(formData.landlordLanguages[
                      language as keyof typeof formData.landlordLanguages
                    ])
                  }
                  onChange={(e) =>
                    updateNestedFormData(
                      "landlordLanguages",
                      language,
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-orange-600"
                />
                <label
                  htmlFor={language}
                  className="text-sm text-gray-700 capitalize"
                >
                  {language}
                </label>
              </div>
            ))}
            {/* Custom Language */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customLanguage"
                checked={formData.landlordLanguages.customLanguage}
                onChange={(e) =>
                  updateNestedFormData(
                    "landlordLanguages",
                    "customLanguage",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-orange-600"
              />
              <label
                htmlFor="customLanguage"
                className="text-sm text-gray-700"
              >
                Custom Language
              </label>
            </div>
            {/* Other Languages */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="others-languages"
                checked={formData.landlordLanguages.others}
                onChange={(e) =>
                  updateNestedFormData(
                    "landlordLanguages",
                    "others",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-orange-600"
              />
              <label
                htmlFor="others-languages"
                className="text-sm text-gray-700"
              >
                Others
              </label>
            </div>
          </div>

          {/* Other Language Text Input */}
          {formData.landlordLanguages.others && (
            <div className="mt-4">
              <label
                htmlFor="otherText"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Other Language
              </label>
              <input
                type="text"
                id="otherText"
                placeholder="Enter other language"
                value={String(formData.landlordLanguages.otherText || '')}
                onChange={(e) =>
                  updateNestedFormData(
                    "landlordLanguages",
                    "otherText",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Accessibility */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Accessibility
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Information about the property's accessibility features
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Grocery Store
              </label>
              <input
                type="text"
                placeholder="e.g. Supermarket, Local Store"
                value={formData.nearestGroceryStore}
                onChange={(e) =>
                  updateFormData(
                    "nearestGroceryStore",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Park
              </label>
              <input
                type="text"
                placeholder="e.g. City Park, Community Garden"
                value={formData.nearestPark}
                onChange={(e) =>
                  updateFormData("nearestPark", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Public Transport
              </label>
              <input
                type="text"
                placeholder="e.g. Bus Stop, Train Station"
                value={formData.nearestPublicTransport}
                onChange={(e) =>
                  updateFormData(
                    "nearestPublicTransport",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Accessibility Features
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select the accessibility features available in the property
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "wheelchairAccessible",
              "elevator",
              "brailleSigns",
              "audioAssistance",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={feature}
                  checked={
                    formData.accessibilityFeatures[
                      feature as keyof typeof formData.accessibilityFeatures
                    ]
                  }
                  onChange={(e) =>
                    updateNestedFormData(
                      "accessibilityFeatures",
                      feature,
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-orange-600"
                />
                <label
                  htmlFor={feature}
                  className="text-sm text-gray-700 capitalize"
                >
                  {feature.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesAccessibility;