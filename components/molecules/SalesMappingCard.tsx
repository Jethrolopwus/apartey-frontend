"use client";
import React from "react";

export interface SalesMappingCardProps {
  countrySales: Array<{ country: string; listings: number }>;
}

const SalesMappingCard: React.FC<SalesMappingCardProps> = ({
  countrySales,
}) => {
  // Calculate percentages for better visualization
  const maxListings = Math.max(...countrySales.map((c) => c.listings), 1);

  const countriesWithPercentage = countrySales.map((country) => ({
    ...country,
    percentage: (country.listings / maxListings) * 100,
  }));

  const totalListings = countrySales.reduce(
    (sum, country) => sum + country.listings,
    0
  );

  // Color mapping for different countries
  const getCountryColor = (country: string, percentage: number) => {
    const colors = {
      Estonia: "#4F8AFA",
      Nigeria: "#FF6B6B",
      USA: "#FFB200",
      Brazil: "#FF5A5F",
      China: "#A78BFA",
      "Saudi Arabia": "#1CC29F",
    };

    // Use predefined color or generate based on percentage
    return (
      colors[country as keyof typeof colors] ||
      `hsl(${percentage * 2}, 70%, 50%)`
    );
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Sales Mapping by Country
      </h3>

      {/* Visual representation using bars */}
      <div className="flex-1 space-y-3">
        {countriesWithPercentage.map((country) => (
          <div key={country.country} className="relative">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {country.country}
              </span>
              <span className="text-sm text-gray-500">
                {country.listings} listings
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${country.percentage}%`,
                  backgroundColor: getCountryColor(
                    country.country,
                    country.percentage
                  ),
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {((country.listings / totalListings) * 100).toFixed(1)}% of total
            </div>
          </div>
        ))}
      </div>

      {/* World map representation using CSS */}
      <div className="mt-6 mb-4">
        <div className="relative bg-blue-50 rounded-lg p-4 h-32 overflow-hidden">
          {/* Simple world representation */}
          <div className="flex justify-center items-center h-full">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {countriesWithPercentage.map((country) => (
                <div
                  key={country.country}
                  className="flex flex-col items-center p-2 rounded-md transition-all hover:scale-105"
                  style={{
                    backgroundColor: getCountryColor(
                      country.country,
                      country.percentage
                    ),
                    color: "white",
                    opacity: 0.8,
                  }}
                >
                  <div className="font-bold text-xs truncate w-full text-center">
                    {country.country}
                  </div>
                  <div className="text-xs">{country.listings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        {countriesWithPercentage.map((country) => (
          <div
            key={country.country}
            className="flex items-center gap-2 text-xs text-gray-600"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getCountryColor(
                  country.country,
                  country.percentage
                ),
              }}
            />
            <span className="font-medium">{country.country}</span>
            <span className="text-gray-500">({country.listings})</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      {countrySales.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-500 border-t pt-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold text-lg text-gray-800">
                {totalListings}
              </div>
              <div>Total Listings</div>
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-800">
                {countrySales.length}
              </div>
              <div>Countries</div>
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-800">
                {Math.round(totalListings / countrySales.length)}
              </div>
              <div>Avg per Country</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesMappingCard;
