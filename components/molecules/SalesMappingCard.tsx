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
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Sales Mapping by Country
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Global property sales distribution
        </p>
      </div>

      {/* World map representation using CSS */}
      <div className="mb-4 md:mb-6">
        <div className="relative bg-gray-50 rounded-lg p-3 md:p-4 h-32 md:h-40 overflow-hidden">
          {/* Simple world representation */}
          <div className="flex justify-center items-center h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 text-xs">
              {countriesWithPercentage.map((country) => (
                <div
                  key={country.country}
                  className="flex flex-col items-center p-1 md:p-2 rounded-md transition-all hover:scale-105"
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
      <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
        {countriesWithPercentage.map((country) => (
          <div
            key={country.country}
            className="flex items-center gap-1 md:gap-2 text-xs text-gray-600"
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
    </div>
  );
};

export default SalesMappingCard;
