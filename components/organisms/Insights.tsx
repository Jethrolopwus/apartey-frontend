"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

// Sample data matching the Figma design
const monthlyTrendsData = [
  { month: "Jan", rent: 650, sale: 450, swap: 150 },
  { month: "Feb", rent: 750, sale: 500, swap: 200 },
  { month: "Mar", rent: 850, sale: 550, swap: 250 },
  { month: "Apr", rent: 950, sale: 600, swap: 300 },
  { month: "May", rent: 1050, sale: 650, swap: 350 },
  { month: "Jun", rent: 1200, sale: 600, swap: 350 },
];

const propertyDistributionByCountry = [
  { country: "Nigeria", properties: 4500 },
  { country: "Ghana", properties: 2850 },
  { country: "Kenya", properties: 2250 },
  { country: "South Africa", properties: 1850 },
  { country: "Uganda", properties: 1450 },
  { country: "Others", properties: 1250 },
];

const propertyTypeDistribution = [
  { name: "For Rent", value: 57, color: "#82C9A9" },
  { name: "For Sale", value: 36, color: "#D96B3F" },
  { name: "For Swap", value: 8, color: "#FDD835" },
];

const countryPerformanceData = [
  { country: "Nigeria", properties: 4521, percentage: 32, color: "#8B5CF6" },
  { country: "Estonia", properties: 2834, percentage: 20, color: "#10B981" },
  { country: "Kenya", properties: 2267, percentage: 16, color: "#F59E0B" },
  { country: "South Africa", properties: 1890, percentage: 13, color: "#EF4444" },
  { country: "Uganda", properties: 1456, percentage: 10, color: "#3B82F6" },
  { country: "Others", properties: 1234, percentage: 9, color: "#EC4899" },
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
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <Info className="w-4 h-4 text-gray-400" />
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
    {subtitle && <div className="text-sm text-gray-500 mb-3">{subtitle}</div>}
    <div className="flex items-center">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
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

interface SuccessfulDealCardProps {
  title: string;
  value: string;
  progress: number;
}

const SuccessfulDealCard: React.FC<SuccessfulDealCardProps> = ({
  title,
  value,
  progress,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
    <div className="text-2xl font-bold text-gray-900 mb-3">{value}</div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const Insights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Property Insights Dashboard
          </h1>
          <p className="text-gray-600 mb-2">
            Comprehensive overview of property listings and market performance
          </p>
          <p className="text-sm text-gray-500">Last Updated: Today</p>
        </div>

        {/* Key Metrics - Top Row */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Swap Properties"
              value="1,247"
              change="+12%"
              isPositive={true}
            />
            <MetricCard
              title="Total Rent Properties"
              value="8,934"
              change="+8%"
              isPositive={true}
            />
            <MetricCard
              title="Total Sale Properties (NGN)"
              value="5,621"
              change="+15%"
              isPositive={true}
            />
            <MetricCard
              title="Total Reviews"
              value="12,456"
              change="+23%"
              isPositive={true}
            />
          </div>
        </div>

        {/* Successful Deals Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SuccessfulDealCard
              title="Successful Swaps"
              value="892"
              progress={75}
            />
            <SuccessfulDealCard
              title="Successful Rents"
              value="7,234"
              progress={85}
            />
            <SuccessfulDealCard
              title="Successful Sales"
              value="4,156"
              progress={70}
            />
          </div>
        </div>

        {/* Property Distribution Charts */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Distribution by Country */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  Property Distribution by Country
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Geographic distribution of all property listings
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyDistributionByCountry}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="country" 
                      axisLine={false} 
                      tickLine={false}
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Bar
                      dataKey="properties"
                      fill="#C85212"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Property Type Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Property Type Distribution
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Breakdown of properties by listing type
              </p>
              <div className="h-80 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {propertyTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom labels positioned around the pie chart */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* For Rent - Bottom Left */}
                  <div className="absolute bottom-8 left-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#82C9A9" }}></div>
                      <span className="text-sm font-medium text-gray-700">For Rent 57%</span>
                    </div>
                  </div>
                  
                  {/* For Sale - Top Right */}
                  <div className="absolute top-8 right-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#D96B3F" }}></div>
                      <span className="text-sm font-medium text-gray-700">For Sale 36%</span>
                    </div>
                  </div>
                  
                  {/* For Swap - Bottom Right */}
                  <div className="absolute bottom-8 right-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#FDD835" }}></div>
                      <span className="text-sm font-medium text-gray-700">For Swap 8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">
                Monthly Trends
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Property listing trends over the past 6 months
            </p>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm">
                All Types
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Rent
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Sale
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Swap
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="rent"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="sale"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="swap"
                    stackId="1"
                    stroke="#FCD34D"
                    fill="#FCD34D"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Country Performance Details */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Detailed breakdown of property performance by country
            </h3>
            <div className="space-y-4">
              {countryPerformanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.country}
                      </span>
                      <div className="text-xs text-gray-500">
                        {item.properties.toLocaleString()} properties
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
