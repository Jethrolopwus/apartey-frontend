"use client";

const proximityOptions = [
  "0-5 min walk",
  "6-10 min walk",
  "11-20 min walk",
  "21-30 min walk"
];

type AccessibilityData = {
  nearestGroceryStore: string;
  nearestPark: string;
  nearestRestaurant: string;
};

type Props = {
  accessibility: AccessibilityData;
  onInputChange: (field: keyof AccessibilityData, value: string) => void;
};

export default function Accessibility({ accessibility, onInputChange }: Props) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Accessibility
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Grocery Store
          </label>
          <select
            value={accessibility.nearestGroceryStore}
            onChange={(e) => {
              onInputChange("nearestGroceryStore", e.target.value);
              console.log('Nearest Grocery Store:', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select distance</option>
            {proximityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Park
          </label>
          <select
            value={accessibility.nearestPark}
            onChange={(e) => {
              onInputChange("nearestPark", e.target.value);
              console.log('Nearest Park:', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select distance</option>
            {proximityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest Restaurant
          </label>
          <select
            value={accessibility.nearestRestaurant}
            onChange={(e) => {
              onInputChange("nearestRestaurant", e.target.value);
              console.log('Nearest Restaurant:', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select distance</option>
            {proximityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}