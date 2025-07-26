"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const summaryCards = [
  { label: 'Monthly Revenue', value: 'NGN25,324,000', change: '+8% Increase' },
  { label: 'Property Views', value: '15,324', change: '+8% Increase' },
  { label: 'New Registrations', value: '2,145', change: '+10% Increase' },
  { label: 'Platform Reviews', value: '3,120', change: '+15% Increase from last month' },
];

const revenueData = [
  { month: 'Jan', revenue: 120, },
  { month: 'Feb', revenue: 210, },
  { month: 'Mar', revenue: 180, },
  { month: 'Apr', revenue: 250, },
  { month: 'May', revenue: 200, },
  { month: 'Jun', revenue: 300, },
  { month: 'Jul', revenue: 260, },
  { month: 'Aug', revenue: 320, },
  { month: 'Sep', revenue: 280, },
  { month: 'Oct', revenue: 350, },
  { month: 'Nov', revenue: 400, },
  { month: 'Dec', revenue: 370, },
];

const userGrowthData = [
  { month: 'Jan', users: 80 },
  { month: 'Feb', users: 120 },
  { month: 'Mar', users: 100 },
  { month: 'Apr', users: 160 },
  { month: 'May', users: 140 },
  { month: 'Jun', users: 200 },
  { month: 'Jul', users: 180 },
  { month: 'Aug', users: 220 },
  { month: 'Sep', users: 210 },
  { month: 'Oct', users: 250 },
  { month: 'Nov', users: 270 },
  { month: 'Dec', users: 300 },
];

const pieData = [
  { name: 'Flats', value: 400 },
  { name: 'Studio', value: 300 },
  { name: 'Penthouse', value: 300 },
  { name: 'Cottage', value: 200 },
  { name: 'Loft', value: 278 },
  { name: 'Townhouse', value: 189 },
  { name: 'Villa', value: 239 },
  { name: 'Mansion', value: 100 },
];

const pieColors = [
  '#4F8CFF', '#FFB946', '#FF5C5C', '#6DD400', '#A259FF', '#00B8D9', '#FF7A00', '#FF4F81'
];

const keyMetrics = [
  { label: 'Average Rent', value: 'NGN1,000,000' },
  { label: 'Properties Listed', value: '5,432' },
  { label: 'Active Users', value: '54,763' },
  { label: 'Response Rate', value: '94%' },
  { label: 'Customer Satisfaction', value: '4.5/5' },
];

export default function AdminAnalytics() {
  return (
    <div className="w-full max-w-7xl mx-auto bg-transparent p-0 mt-4">
      <h2 className="text-2xl font-semibold text-[#2D3A4A] mb-8">Analytics</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 min-h-[110px]">
            <span className="text-sm text-gray-500 font-medium">{card.label}</span>
            <span className="text-2xl font-bold text-[#2D3A4A]">{card.value}</span>
            <span className="text-xs text-green-500 font-semibold">{card.change}</span>
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
  );
} 