"use client";
const proximityOptions = [
  "0-5 min walk",
  "6-10 min walk",
  "11-20 min walk",
  "21-30 min walk",
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
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Accessibility</h2>
      <p className="text-sm text-gray-600 mb-4">
        How accessible are key amenities from this property?
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nearest Grocery Store
          </label>
          <select
            value={accessibility.nearestGroceryStore}
            onChange={(e) => {
              onInputChange("nearestGroceryStore", e.target.value);
              console.log("Nearest Grocery Store:", e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300"
          >
            <option value="">Select Distance</option>
            {proximityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nearest Park
          </label>
          <select
            value={accessibility.nearestPark}
            onChange={(e) => {
              onInputChange("nearestPark", e.target.value);
              console.log("Nearest Park:", e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300"
          >
            <option value="">Select Distance</option>
            {proximityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nearest Restaurant
          </label>
          <select
            value={accessibility.nearestRestaurant}
            onChange={(e) => {
              onInputChange("nearestRestaurant", e.target.value);
              console.log("Nearest Restaurant:", e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300"
          >
            <option value="">Select Distance</option>
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
