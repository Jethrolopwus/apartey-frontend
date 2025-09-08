"use client";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface UserDistributionCardProps {
  userDistribution: Array<{
    month: string;
    renter: number;
    homeowner: number;
    agent: number;
  }>;
}

const UserDistributionCard: React.FC<UserDistributionCardProps> = ({
  userDistribution,
}) => {
  
  const monthlyData = userDistribution.map((d) => ({
    month: d.month.slice(0, 3),
    Renters: d.renter,
    Landlords: d.homeowner,
    Agents: d.agent,
  }));

  return (
    <div className="bg-white shadow rounded-xl p-4 md:p-6 h-full my-7">
      {/* Title */}
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4 md:mb-6">
        User Distribution
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            {/* Background grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            {/* Axes */}
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" allowDecimals={false} />

            {/* Hover tooltip */}
            <Tooltip
              contentStyle={{ fontSize: "0.85rem", borderRadius: "8px" }}
            />

            {/* Legend */}
            <Legend wrapperStyle={{ fontSize: "0.85rem" }} />

            {/* Bars */}
            <Bar dataKey="Renters" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Landlords" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Agents" fill="#3b82f6" radius={[4, 4, 0, 0]} /> {/* blue */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserDistributionCard;
