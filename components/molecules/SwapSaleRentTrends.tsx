"use client";
import React from "react";
import { monthlyCompletedCategoryTrend } from "@/types/admin";

interface SwapSaleRentTrendsProps {
  data: monthlyCompletedCategoryTrend[];
}

const SwapSaleRentTrends: React.FC<SwapSaleRentTrendsProps> = ({ data }) => {
  // Transform API response → arrays for chart
  const months = data.map((d) => d.month.substring(0, 3)); 
  const sales = data.map((d) => d.Sale);
  const rents = data.map((d) => d.Rent);
  const swaps = data.map((d) => d.Swap);

  const maxValue = Math.max(...sales, ...rents, ...swaps, 1);
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 60;

  const getY = (value: number) => {
    return (
      chartHeight -
      padding -
      (value / maxValue) * (chartHeight - 2 * padding)
    );
  };

  const getX = (index: number) => {
    return (
      padding +
      (index * (chartWidth - 2 * padding)) / (months.length - 1 || 1)
    );
  };

  const createPath = (values: number[], color: string) => {
    const points = values
      .map((value, index) => {
        const x = getX(index);
        const y = getY(value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <path
        d={points}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const createDots = (values: number[], color: string) => {
    return values.map((value, index) => {
      const x = getX(index);
      const y = getY(value);
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="3"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Swap, Sale & Rent Trends
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Monthly comparison of successful transactions
        </p>
      </div>

      <div className="flex flex-col items-center">
        {/* Chart */}
        <div className="mb-4 md:mb-6 w-full overflow-x-auto">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[600px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, maxValue / 4, maxValue / 2, (3 * maxValue) / 4, maxValue].map(
              (value, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={getY(value)}
                  x2={chartWidth - padding}
                  y2={getY(value)}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              )
            )}

            {/* Y-axis labels */}
            {[0, maxValue / 4, maxValue / 2, (3 * maxValue) / 4, maxValue].map(
              (value, i) => (
                <text
                  key={i}
                  x={padding - 10}
                  y={getY(value) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6B7280"
                  className="text-xs"
                >
                  {Math.round(value)}
                </text>
              )
            )}

            {/* X-axis labels */}
            {months.map((month, index) => (
              <text
                key={month}
                x={getX(index)}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
                className="text-xs"
              >
                {month}
              </text>
            ))}

            {/* Chart lines */}
            {createPath(sales, "#3B82F6")}
            {createPath(rents, "#10B981")}
            {createPath(swaps, "#F59E0B")}

            {/* Chart dots */}
            {createDots(sales, "#3B82F6")}
            {createDots(rents, "#10B981")}
            {createDots(swaps, "#F59E0B")}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 md:space-x-8 mt-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              Sales
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              Rents
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              Swaps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapSaleRentTrends;
