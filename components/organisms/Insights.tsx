"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

// Sample data for charts
const priceData = [
  { month: "Jan", price: 850000 },
  { month: "Feb", price: 920000 },
  { month: "Mar", price: 980000 },
  { month: "Apr", price: 760000 },
  { month: "May", price: 820000 },
  { month: "Jun", price: 890000 },
  { month: "Jul", price: 950000 },
];

const propertyTypeData = [
  { name: "Apartment", value: 40, color: "#4F46E5" },
  { name: "House", value: 30, color: "#EF4444" },
  { name: "Commercial", value: 20, color: "#10B981" },
  { name: "Land", value: 10, color: "#F59E0B" },
];

const locationData = [
  { location: "Victoria Island", listings: 450 },
  { location: "Lekki", listings: 320 },
  { location: "Ikoyi", listings: 280 },
  { location: "Ajah", listings: 240 },
  { location: "Surulere", listings: 180 },
];

const reviewGrowthData = [
  { month: "Jan", positive: 85, negative: 15 },
  { month: "Feb", positive: 88, negative: 12 },
  { month: "Mar", positive: 92, negative: 8 },
  { month: "Apr", positive: 87, negative: 13 },
  { month: "May", positive: 94, negative: 6 },
  { month: "Jun", positive: 96, negative: 4 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <Info className="w-4 h-4 text-gray-400" />
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    {subtitle && <div className="text-sm text-gray-500 mb-2">{subtitle}</div>}
    <div className="flex items-center">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span
        className={`text-sm font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
      <span className="text-sm text-gray-500 ml-1">from last month</span>
    </div>
  </div>
);

const Insights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">
            Real People.... Real Experiences
          </h1>
          <p className="text-gray-600 mb-6">
            Find your perfect rental with confidence
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-[#C85212] text-white font-medium rounded-lg hover:bg-[#B8460F] transition-colors">
              View Latest Market Report
            </button>
            <button className="px-6 py-3 border border-[#C85212] text-[#C85212] font-medium rounded-lg hover:bg-orange-50 transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Average Property Price"
              value="₦85,000"
              change="↑ 5.3%"
              isPositive={true}
            />
            <MetricCard
              title="Total Active Listings"
              value="10,000"
              change="↑ 3.8%"
              isPositive={true}
            />
            <MetricCard
              title="Average Days on Market"
              value="25"
              change="↓ 2.1%"
              isPositive={true}
            />
            <MetricCard
              title="Customer Satisfaction"
              value="91%"
              change="↑ 0.9%"
              isPositive={true}
            />
          </div>
        </div>

        {/* Market Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Market Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Property Price Trends */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Average Property Price Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#C85212"
                      strokeWidth={3}
                      dot={{ fill: "#C85212", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#C85212" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Property Types Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Property Types Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {propertyTypeData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Locations by Listings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top Locations by Listings
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="location"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar
                    dataKey="listings"
                    fill="#C85212"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Reviews Growth */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Reviews Growth
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reviewGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#EC4899"
                    strokeWidth={3}
                    fill="#EC4899"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
