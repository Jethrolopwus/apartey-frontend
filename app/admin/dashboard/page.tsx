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

import SwapSaleTrends from "@/components/molecules/SwapSaleRentTrends";
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

  if (isLoading) {
    return (
      <div className="w-full mt-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded-2xl h-28"></div>
            ))}
          </div>

          <div className=" mt-5 flex flex-col items-center gap-4">
            <div className="w-full min-h-[350px] rounded-lg bg-gray-200"></div>
            <div className="w-full min-h-[350px] rounded-lg bg-gray-200"></div>
          </div>
          <div className=" mt-5 flex items-center gap-4">
            <div className="w-full min-h-[350px] rounded-lg bg-gray-200"></div>
            <div className="w-full min-h-[350px] rounded-lg bg-gray-200"></div>
          </div>
        </div>
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

  return (
    <div className="w-full mt-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 mb-6 md:mb-10">
        <TotalPropertiesCard
          label="Total properties"
          value={stats?.totalProperties || 0}
          percentage={overviewData?.stats?.growth?.totalProperties.value}
          increase={overviewData?.stats?.growth?.totalProperties.isIncrease}
        />
        <TotalUsersCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          percentage={overviewData?.stats?.growth?.totalUsers.value}
          increase={overviewData?.stats?.growth?.totalUsers.isIncrease}
        />
        <ActiveListingsCard
          label="Active Listings"
          value={stats?.activeListings || 0}
          percentage={overviewData?.stats?.growth?.activeListings.value}
          increase={overviewData?.stats?.growth?.activeListings.isIncrease}
        />
        <NewUsersThisMonthCard
          label="New Users This Month"
          value={stats?.newUsersThisMonth || 0}
          percentage={overviewData?.stats?.growth?.newUsers.value}
          increase={overviewData?.stats?.growth?.newUsers.isIncrease}
        />
      </div>

      {/* Top section: Revenue and User Distribution side by side */}
      <div className="">
        <TotalRevenueCard dailyRevenue={stats?.dailyRevenue || []} />
        <UserDistributionCard
          userDistribution={trends?.userDistributionByMonth || []}
        />
      </div>
      {/* design for totalcompletedListings, success Rent, success Sale, success Swap cards */}
      {/* Transaction Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 mb-6 md:mb-10">
        {/* Total Completed Listings */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Total Completed Listings
          </h3>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.completed.total}
          </div>
          <p className="text-gray-400 text-xs">
            Successfully completed transactions
          </p>
        </div>

        {/* Successful Rents */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Successful Rents
          </h3>
          <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
            {stats?.completed.rents}
          </div>
          <p className="text-gray-400 text-xs">
            {stats?.completed.change.rents.isIncrease ? "+" : "-"}
            {stats?.completed.change.rents.value}% Success rate
          </p>
        </div>

        {/* Successful Sales */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Successful Sales
          </h3>
          <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
            {stats?.completed.sales}
          </div>
          <p className="text-gray-400 text-xs">
            {stats?.completed.change.sales.isIncrease ? "+" : "-"}
            {stats?.completed.change.sales.value}% Success rate
          </p>
        </div>

        {/* Successful Swaps */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Successful Swaps
          </h3>
          <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">
            {stats?.completed.swaps}
          </div>
          <p className="text-gray-400 text-xs">
            {stats?.completed.change.swaps.isIncrease ? "+" : "-"}
            {stats?.completed.change.swaps.value}% Success rate
          </p>
        </div>
      </div>

      {/* Middle section: Recent Completed Listings and Right Column (Completion Distribution + Sales Mapping) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7 mb-6 md:mb-10">
        <RecentCompletedListings data={trends?.recentCompleted} />
        <div className="space-y-4 md:space-y-7">
          <CompletionDistribution data={trends?.completionDistribution} />
          <SalesMappingCard countrySales={trends?.countrySales || []} />
        </div>
      </div>

      {/* Bottom section: Swap vs Sale Trends (full width) */}
      <div className="w-full">
        <SwapSaleTrends data={trends?.monthlyCompletedCategoryTrend} />
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
