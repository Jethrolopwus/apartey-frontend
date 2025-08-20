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
import PropertyTypesCard from "@/components/molecules/PropertyTypesCard";
import SalesMappingCard from "@/components/molecules/SalesMappingCard";
import HomeswapActivityTracker from "@/components/molecules/HomeswapActivityTracker";
import SwapSaleTrends from "@/components/molecules/SwapSaleTrends";
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

  // Debug: Log stats and trends to verify their structure
  console.log("stats:", stats);
  console.log("trends:", trends);
  // Debug: Log specific data passed to problematic components
  console.log("totalRevenue for TotalRevenueCard:", stats?.totalRevenue);
  console.log(
    "userDistribution for UserDistributionCard:",
    trends?.userDistribution
  );
  console.log("propertyTypes for PropertyTypesCard:", trends?.propertyTypes);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-6 md:px-10 pt-2 pb-8">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 mb-10">
          <TotalPropertiesCard
            label="Total properties"
            value={stats?.totalProperties || 0}
            percentage="18%"
          />
          <TotalUsersCard
            label="Total Users"
            value={stats?.totalUsers || 0}
            percentage="8%"
          />
          <ActiveListingsCard
            label="Active Listings"
            value={stats?.activeListings || 0}
            percentage="10%"
          />
          <NewUsersThisMonthCard
            label="New Users This Month"
            value={stats?.newUsersThisMonth || 0}
            percentage="15%"
          />
        </div>

        {/* Top section: Revenue and User Distribution side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
          <TotalRevenueCard totalRevenue={stats?.totalRevenue || 0} />
          <UserDistributionCard
            userDistribution={trends?.userDistribution || []}
          />
        </div>

        {/* Middle section: Homeswap Activity Tracker and Swap Sale Trends side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-10">
          <HomeswapActivityTracker />
          <SwapSaleTrends />
        </div>

        {/* Bottom section: Property Types and Sales Mapping side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <PropertyTypesCard propertyTypes={trends?.propertyTypes || []} />
          <SalesMappingCard countrySales={trends?.countrySales || []} />
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
