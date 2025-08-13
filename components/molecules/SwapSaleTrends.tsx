"use client";
import React from "react";

const SwapSaleTrends: React.FC = () => {
  // Sample monthly data for Swaps and Sales (Jan to Jul)
  const monthlyData = [
    { month: "Jan", swaps: 45, sales: 22 },
    { month: "Feb", swaps: 53, sales: 28 },
    { month: "Mar", swaps: 48, sales: 32 },
    { month: "Apr", swaps: 60, sales: 25 },
    { month: "May", swaps: 55, sales: 33 },
    { month: "Jun", swaps: 66, sales: 29 },
    { month: "Jul", swaps: 58, sales: 36 },
  ];

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.swaps, d.sales]));
  const yAxisLabels = [0, 20, 40, 60, 80];

  // Function to calculate SVG path for line chart
  const createLinePath = (data: typeof monthlyData, key: 'swaps' | 'sales') => {
    const width = 280; // Chart width
    const height = 160; // Chart height
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const xStep = chartWidth / (data.length - 1);
    const points = data.map((item, index) => {
      const x = padding + (index * xStep);
      const y = padding + chartHeight - ((item[key] / maxValue) * chartHeight);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Function to create circle markers
  const createMarkers = (data: typeof monthlyData, key: 'swaps' | 'sales') => {
    const width = 280;
    const height = 160;
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const xStep = chartWidth / (data.length - 1);
    
    return data.map((item, index) => {
      const x = padding + (index * xStep);
      const y = padding + chartHeight - ((item[key] / maxValue) * chartHeight);
      return { x, y };
    });
  };

  const swapMarkers = createMarkers(monthlyData, 'swaps');
  const saleMarkers = createMarkers(monthlyData, 'sales');

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        Swap vs Sale Trends
      </h3>
      <p className="text-sm text-gray-500 mb-6">Monthly comparison</p>
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          {yAxisLabels.map((label) => (
            <span key={label} className="text-right">
              {label}
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

          {/* Vertical grid lines for months */}
          <div className="absolute inset-0 flex justify-between">
            {monthlyData.map((_, index) => (
              <div
                key={index}
                className="border-l border-gray-200 border-dashed"
                style={{ width: '1px' }}
              />
            ))}
          </div>

          {/* SVG Chart */}
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Swap line (blue) */}
            <path
              d={createLinePath(monthlyData, 'swaps')}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Sales line (green) */}
            <path
              d={createLinePath(monthlyData, 'sales')}
              stroke="#10B981"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Swap markers (blue circles) */}
            {swapMarkers.map((marker, index) => (
              <circle
                key={`swap-${index}`}
                cx={marker.x}
                cy={marker.y}
                r="4"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Sales markers (green circles) */}
            {saleMarkers.map((marker, index) => (
              <circle
                key={`sale-${index}`}
                cx={marker.x}
                cy={marker.y}
                r="4"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {monthlyData.map((data) => (
              <span key={data.month} className="text-xs text-gray-500">
                {data.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Swaps</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Sales</span>
        </div>
      </div>
    </div>
  );
};

export default SwapSaleTrends; 