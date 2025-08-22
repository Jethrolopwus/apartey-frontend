"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useGetAdminAnalyticsQuery } from '@/Hooks/use-getAdminAnalytics.query';

const pieColors = [
  '#4F8CFF', '#FFB946', '#FF5C5C', '#6DD400', '#A259FF', '#00B8D9', '#FF7A00', '#FF4F81'
];

export default function AdminAnalytics() {
  const { data: analyticsData, isLoading, error } = useGetAdminAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-gray-200 rounded-2xl h-28"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
          <div className="text-red-500 text-center py-8">
            Error loading analytics data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  // Format summary cards data
  const summaryCards = [
    { 
      label: 'Monthly Revenue', 
      value: `NGN${analyticsData.totals.totalRevenue.toLocaleString()}`, 
      change: `${analyticsData.growth.registrations.isIncrease ? '+' : '-'}${analyticsData.growth.registrations.value}% ${analyticsData.growth.registrations.isIncrease ? 'Increase' : 'Decrease'}` 
    },
    { 
      label: 'Property Views', 
      value: analyticsData.totals.views.toLocaleString(), 
      change: `${analyticsData.growth.reviews.isIncrease ? '+' : '-'}${analyticsData.growth.reviews.value}% ${analyticsData.growth.reviews.isIncrease ? 'Increase' : 'Decrease'}` 
    },
    { 
      label: 'New Registrations', 
      value: analyticsData.totals.newUsers.toLocaleString(), 
      change: `${analyticsData.growth.registrations.isIncrease ? '+' : '-'}${analyticsData.growth.registrations.value}% ${analyticsData.growth.registrations.isIncrease ? 'Increase' : 'Decrease'}` 
    },
    { 
      label: 'Platform Reviews', 
      value: analyticsData.totals.reviews.toLocaleString(), 
      change: `${analyticsData.growth.reviews.isIncrease ? '+' : '-'}${analyticsData.growth.reviews.value}% ${analyticsData.growth.reviews.isIncrease ? 'Increase' : 'Decrease'}` 
    },
  ];

  // Format revenue data for chart
  const revenueData = analyticsData.trends.revenue.map(item => ({
    month: item.month,
    revenue: item.total
  }));

  // Format user growth data for chart
  const userGrowthData = analyticsData.trends.userGrowth.map(item => ({
    month: item.label,
    users: item.count
  }));

  // Format pie chart data
  const pieData = analyticsData.distribution.map(item => ({
    name: item.type,
    value: item.count
  }));

  // Format key metrics
  const keyMetrics = [
    { label: 'Average Rent', value: `NGN${analyticsData.metrics.averageRent.toLocaleString()}` },
    { label: 'Properties Listed', value: analyticsData.metrics.propertiesListed.toLocaleString() },
    { label: 'Active Users', value: analyticsData.metrics.activeUsers.toLocaleString() },
    { label: 'Response Rate', value: `${analyticsData.metrics.responseRate}%` },
    { label: 'Customer Satisfaction', value: `${analyticsData.metrics.customerSatisfaction}/5` },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Analytics</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 min-h-[110px]">
            <span className="text-sm text-gray-500 font-medium">{card.label}</span>
            <span className="text-2xl font-bold text-[#2D3A4A]">{card.value}</span>
            <span className={`text-xs font-semibold ${card.change.includes('Increase') ? 'text-green-500' : 'text-[#0D4949]'}`}>
              {card.change}
            </span>
          </div>
        ))}
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-base font-semibold text-[#2D3A4A] mb-4">Monthly Revenue Trend</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4F8CFF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* User Growth */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-base font-semibold text-[#2D3A4A] mb-4">User Growth</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#FF5C5C" fill="#FFB94633" strokeWidth={3} fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Pie and Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Property Type Distribution Pie */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-1">
          <h3 className="text-base font-semibold text-[#2D3A4A] mb-4">Property Type Distribution</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-2 flex flex-col justify-center">
          <h3 className="text-base font-semibold text-[#2D3A4A] mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-500 text-sm font-medium">{metric.label}</span>
                <span className="text-[#2D3A4A] font-bold text-base">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 