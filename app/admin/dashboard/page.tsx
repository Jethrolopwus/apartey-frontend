"use client";
import React from "react";
import {
  TotalPropertiesCard,
  TotalUsersCard,
  ActiveListingsCard,
  NewUsersThisMonthCard,
} from "@/components/molecules/AdminCards";
import TotalRevenueCard from "@/components/molecules/TotalRevenueCard";
import UserDistributionCard from "@/components/molecules/UserDistributionCard";

import SalesMappingCard from "@/components/molecules/SalesMappingCard";

import SwapSaleTrends from "@/components/molecules/SwapSaleTrends";
import RecentCompletedListings from "@/components/molecules/RecentCompletedListings";
import CompletionDistribution from "@/components/molecules/CompletionDistribution";
import AdminAuthGuard from "@/components/molecules/AdminAuthGuard";
import { useAdminOverviewStatusQuery } from "@/Hooks/use-getAdminOverviewStatus.query";

const AdminDashboardContent: React.FC = () => {
  const {
    data: overviewData,
    isLoading,
    error,
  } = useAdminOverviewStatusQuery();

  // Debug: Log the entire overviewData to the console
  console.log("overviewData:", overviewData);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching dashboard data:", error); 
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-red-500 text-lg">Error loading dashboard data</div>
      </div>
    );
  }

  const stats = overviewData?.stats;
  const trends = overviewData?.trends;

  // Calculate total revenue from daily revenue data
  const totalRevenue = stats?.dailyRevenue?.reduce((sum, day) => sum + day.revenue, 0) || 0;

  // Debug: Log stats and trends to verify their structure
  console.log("stats:", stats);
  console.log("trends:", trends);
  // Debug: Log specific data passed to problematic components
  console.log("totalRevenue for TotalRevenueCard:", totalRevenue);
  console.log(
    "userDistribution for UserDistributionCard:",
    trends?.userDistribution
  );
  console.log("propertyTypes for PropertyTypesCard:", trends?.propertyTypes);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 mb-6 md:mb-10">
          <TotalPropertiesCard
            label="Total properties"
            value={stats?.totalProperties || 0}
            percentage={`${stats?.growth?.totalProperties?.value || 0}%`}
          />
          <TotalUsersCard
            label="Total Users"
            value={stats?.totalUsers || 0}
            percentage={`${stats?.growth?.totalUsers?.value || 0}%`}
          />
          <ActiveListingsCard
            label="Active Listings"
            value={stats?.activeListings || 0}
            percentage={`${stats?.growth?.activeListings?.value || 0}%`}
          />
          <NewUsersThisMonthCard
            label="New Users This Month"
            value={stats?.newUsersThisMonth || 0}
            percentage={`${stats?.growth?.newUsers?.value || 0}%`}
          />
        </div>

        {/* Top section: Revenue and User Distribution side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 mb-6 md:mb-10">
          <TotalRevenueCard totalRevenue={totalRevenue} />
          <UserDistributionCard
            userDistribution={trends?.userDistribution || []}
          />
        </div>
        {/* Transaction Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 mb-6 md:mb-10">
          {/* Total Completed Listings */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Completed Listings</h3>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats?.completed?.total || 0}</div>
            <p className="text-gray-400 text-xs">Successfully completed transactions</p>
          </div>

          {/* Successful Rents */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Successful Rents</h3>
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stats?.completed?.rents || 0}</div>
            <p className="text-gray-400 text-xs">Completed rental transactions</p>
          </div>

          {/* Successful Sales */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Successful Sales</h3>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stats?.completed?.sales || 0}</div>
            <p className="text-gray-400 text-xs">Completed sales transactions</p>
          </div>

          {/* Successful Swaps */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Successful Swaps</h3>
            <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">{stats?.completed?.swaps || 0}</div>
            <p className="text-gray-400 text-xs">Completed swap transactions</p>
          </div>
        </div>

        {/* Middle section: Recent Completed Listings and Right Column (Completion Distribution + Sales Mapping) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7 mb-6 md:mb-10">
          <RecentCompletedListings recentCompleted={trends?.recentCompleted || []} />
          <div className="space-y-4 md:space-y-7">
            <CompletionDistribution completionDistribution={trends?.completionDistribution || []} />
            <SalesMappingCard countrySales={trends?.countrySales || []} />
          </div>
        </div>

        {/* Bottom section: Swap vs Sale Trends (full width) */}
        <div className="w-full">
          <SwapSaleTrends />
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  );
}
