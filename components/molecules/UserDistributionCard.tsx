"use client";
import React from "react";

export interface UserDistributionCardProps {
  userDistribution: Array<{ _id: string; count: number }>;
}

const UserDistributionCard: React.FC<UserDistributionCardProps> = ({
}) => {
  // Sample monthly data for Renters and Landlords (Jan to Jul)
  const monthlyData = [
    { month: "Jan", renters: 580, landlords: 700 },
    { month: "Feb", renters: 600, landlords: 780 },
    { month: "Mar", renters: 650, landlords: 820 },
    { month: "Apr", renters: 720, landlords: 890 },
    { month: "May", renters: 800, landlords: 930 },
    { month: "Jun", renters: 880, landlords: 1000 },
    { month: "Jul", renters: 910, landlords: 1050 },
  ];

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.renters, d.landlords]));
  const yAxisLabels = [0, 300, 600, 900, 1200];

  return (
    <div className="bg-white shadow rounded-xl p-4 md:p-6 h-full">
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4 md:mb-6">
        User Distribution
      </h3>
      
      <div className="relative h-48 md:h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          {yAxisLabels.map((label) => (
            <span key={label} className="text-right">
              {label.toLocaleString()}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {yAxisLabels.map((label) => (
              <div
                key={label}
                className="border-t border-gray-200 border-dashed"
                style={{ height: '1px' }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-6">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex flex-col items-center">
                <div className="flex items-end space-x-1 mb-2">
                  {/* Renters bar (green) */}
                  <div
                    className="bg-green-500 rounded-t w-6 min-h-[4px]"
                    style={{
                      height: `${(data.renters / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  {/* Landlords bar (orange) */}
                  <div
                    className="bg-orange-500 rounded-t w-6 min-h-[4px]"
                    style={{
                      height: `${(data.landlords / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 text-center">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Renters</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-xs text-gray-600">Landlords</span>
        </div>
      </div>
    </div>
  );
};

export default UserDistributionCard;
