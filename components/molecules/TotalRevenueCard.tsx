"use client";
import React from "react";

export interface TotalRevenueCardProps {
  totalRevenue: number;
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  totalRevenue,
}) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Total Revenue
      </h3>
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {totalRevenue === 0
              ? "No revenue recorded"
              : "Total revenue to date"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
