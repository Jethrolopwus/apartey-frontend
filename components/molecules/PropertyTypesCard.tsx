"use client";
import React from "react";

export interface PropertyTypesCardProps {
  propertyTypes: Array<{ count: number; name: string }>;
}

const PropertyTypesCard: React.FC<PropertyTypesCardProps> = ({
  propertyTypes,
}) => {
  // Map backend data to the expected format, deriving popularity and sale from count
  const types =
    propertyTypes.length > 0
      ? propertyTypes.map((item, idx) => ({
          name: item.name,
          popularity: item.count / 10, // Example: Normalize count to a 0-5 scale for popularity
          sale: item.count, // Use count as sale value
          color: ["#3B82F6", "#22C55E", "#A78BFA", "#F59E42"][idx % 4], // Cycle through colors
        }))
      : [{ name: "No Data", popularity: 0, sale: 0, color: "#3B82F6" }];

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Property Types
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-gray-400">
            <th className="py-1">#</th>
            <th className="py-1">Name</th>
            <th className="py-1">Popularity</th>
            <th className="py-1">Sale</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type, idx) => (
            <tr key={type.name} className="text-sm text-gray-700">
              <td className="py-2 font-semibold">{`0${idx + 1}`}</td>
              <td className="py-2">{type.name}</td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${type.popularity * 20}%`,
                        background: type.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {type.popularity.toFixed(1)}
                  </span>
                </div>
              </td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${type.sale}%`,
                        background: type.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {type.sale}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTypesCard;
