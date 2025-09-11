"use client";
import React, { useState } from "react";

type Revenue = { day: string; revenue: number };

export interface TotalRevenueCardProps {
  dailyRevenue: Revenue[];
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({ dailyRevenue }) => {
  const [hovered, setHovered] = useState<Revenue | null>(null);

  const maxRevenue =
    dailyRevenue.length > 0
      ? Math.max(...dailyRevenue.map((d) => d.revenue))
      : 0;

  const step = maxRevenue > 0 ? Math.ceil(maxRevenue / 4) : 1;
  const yAxisLabels = [0, step, step * 2, step * 3, step * 4];

  return (
    <div className="bg-white shadow rounded-xl p-4 md:p-6 h-full">
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4 md:mb-6">
        Total Revenue
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
                style={{ height: "1px" }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-6">
            {dailyRevenue.map((day) => (
              <div
                key={day.day}
                className="flex flex-col items-center relative"
                onMouseEnter={() => setHovered(day)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="bg-orange-500 rounded-t w-8 min-h-[4px] relative"
                  style={{
                    height:
                      maxRevenue > 0
                        ? `${(day.revenue / maxRevenue) * 100}%`
                        : "4px",
                    minHeight: "4px",
                  }}
                />

                {/* Tooltip */}
                {hovered?.day === day.day && (
                  <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                    €{day.revenue.toLocaleString()}
                  </div>
                )}

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
