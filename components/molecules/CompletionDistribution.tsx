"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the type for API data
type CompletionItem = {
  type: string;
  count: number;
};

interface CompletionDistributionProps {
  data: CompletionItem[];
}

const CompletionDistribution: React.FC<CompletionDistributionProps> = ({ data }) => {
  // Map API data to chart format
  const chartData = data.map((item) => {
    let color = "#10B981"; // default green
    if (item.type === "Sales") color = "#3B82F6"; // blue
    if (item.type === "Swaps") color = "#F59E0B"; // amber

    return {
      name: item.type,
      value: item.count,
      color,
    };
  });

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Completion Distribution
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Breakdown by transaction type
        </p>
      </div>

      <div className="flex flex-col items-center">
        {/* Recharts Pie Chart */}
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100} // full pie
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2 md:space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs md:text-sm text-gray-700">
                  {item.name}
                </span>
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletionDistribution;
