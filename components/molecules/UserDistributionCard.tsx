"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface UserDistributionCardProps {
  userDistribution: Array<{ _id: string; count: number }>;
}

const UserDistributionCard: React.FC<UserDistributionCardProps> = ({
  userDistribution,
}) => {
  // Transform userDistribution into chart-compatible data
  const chartData =
    userDistribution.length > 0
      ? [
          {
            name: "Users",
            ...userDistribution.reduce(
              (acc, item) => ({
                ...acc,
                [item._id]: item.count,
              }),
              {}
            ),
          },
        ]
      : [{ name: "Users", admin: 0, renter: 0, homeowner: 0 }];

  // Define colors for each role
  const roleColors: Record<"admin" | "renter" | "homeowner", string> = {
    admin: "#3B82F6",
    renter: "#1C4532",
    homeowner: "#FFD600",
  };

  // Dynamically create bars based on available roles
  const bars =
    userDistribution.length > 0
      ? userDistribution.map((item) => (
          <Bar
            key={item._id}
            dataKey={item._id}
            fill={roleColors[item._id as keyof typeof roleColors] || "#3B82F6"}
            radius={[6, 6, 0, 0]}
            barSize={18}
            name={item._id.charAt(0).toUpperCase() + item._id.slice(1)}
          />
        ))
      : [
          <Bar
            key="admin"
            dataKey="admin"
            fill={roleColors.admin}
            radius={[6, 6, 0, 0]}
            barSize={18}
            name="Admin"
          />,
          <Bar
            key="renter"
            dataKey="renter"
            fill={roleColors.renter}
            radius={[6, 6, 0, 0]}
            barSize={18}
            name="Renter"
          />,
          <Bar
            key="homeowner"
            dataKey="homeowner"
            fill={roleColors.homeowner}
            radius={[6, 6, 0, 0]}
            barSize={18}
            name="Homeowner"
          />,
        ];

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        User Distribution
      </h3>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "#F3F4F6" }} />
            <Legend
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#6B7280", fontSize: 12 }}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            {bars}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserDistributionCard;
