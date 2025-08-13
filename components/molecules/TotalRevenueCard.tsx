"use client";
import React from "react";

export interface TotalRevenueCardProps {
  totalRevenue: number;
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
}) => {
  // Sample daily revenue data (you can replace with actual data)
  const dailyRevenue = [
    { day: "Monday", revenue: 14500 },
    { day: "Tuesday", revenue: 17500 },
    { day: "Wednesday", revenue: 21000 },
    { day: "Thursday", revenue: 25000 },
    { day: "Friday", revenue: 19000 },
    { day: "Saturday", revenue: 28000 },
    { day: "Sunday", revenue: 23500 },
  ];

  const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue));
  const yAxisLabels = [0, 7000, 14000, 21000, 28000];

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-6">
        Total Revenue
      </h3>
      
      <div className="relative h-64">
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
            {dailyRevenue.map((day) => (
              <div key={day.day} className="flex flex-col items-center">
                <div
                  className="bg-orange-500 rounded-t w-8 min-h-[4px]"
                  style={{
                    height: `${(day.revenue / maxRevenue) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-gray-500 mt-2 text-center">
                  {day.day.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
