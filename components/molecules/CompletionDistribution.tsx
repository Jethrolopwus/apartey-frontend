"use client";
import React from "react";
import { CompletionDistribution as CompletionDistributionType } from "@/types/admin";

interface CompletionDistributionProps {
  completionDistribution?: CompletionDistributionType[];
}

const CompletionDistribution: React.FC<CompletionDistributionProps> = ({ 
  completionDistribution = [] 
}) => {
  // Use real data if available, otherwise fallback to default data
  const data = completionDistribution.length > 0 
    ? completionDistribution.map((item, index) => {
        const colors = ["#10B981", "#3B82F6", "#F59E0B"];
        return {
          label: item.type,
          value: item.count,
          color: colors[index % colors.length]
        };
      })
    : [
        { label: "Rents", value: 0, color: "#10B981" },
        { label: "Sales", value: 0, color: "#3B82F6" },
        { label: "Swaps", value: 0, color: "#F59E0B" }
      ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Create SVG pie chart
  const createPieChart = () => {
    let currentAngle = 0;
    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate SVG arc parameters
      const startRadians = (startAngle - 90) * (Math.PI / 180);
      const endRadians = (endAngle - 90) * (Math.PI / 180);
      
      const startX = centerX + radius * Math.cos(startRadians);
      const startY = centerY + radius * Math.sin(startRadians);
      const endX = centerX + radius * Math.cos(endRadians);
      const endY = centerY + radius * Math.sin(endRadians);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z'
      ].join(' ');

      currentAngle += angle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="white"
          strokeWidth="2"
        />
      );
    });
  };

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
        {/* Pie Chart */}
        <div className="mb-4 md:mb-6">
          <svg width="160" height="160" viewBox="0 0 160 160" className="w-32 h-32 md:w-40 md:h-40">
            {createPieChart()}
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2 md:space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs md:text-sm text-gray-700">{item.label}</span>
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