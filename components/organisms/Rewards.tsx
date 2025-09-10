"use client";
import React, { useEffect, useState } from "react";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";

interface RewardsProps {
  currentKeys?: number;
  onRedeemKeys?: () => void;
}

const Rewards: React.FC<RewardsProps> = ({
  currentKeys,
  onRedeemKeys,
}) => {
  // Get real user data from profile
  const { data: userProfileData, isLoading, isError } = useGetUserProfileQuery();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Use real rewards data from API or fallback to prop/default
  const actualKeys = userProfileData?.currentUser?.rewards || currentKeys || 0;

  // Ensure hydration is complete before showing dynamic content
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  // Use a consistent structure to avoid hydration mismatches
  const renderContent = () => {
    // Show loading state until hydration is complete
    if (!isHydrated || isLoading) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-500">Loading rewards...</div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-red-500">Failed to load rewards data.</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="flex justify-center items-center mt-4 space-x-2 sm:mt-0">
          <div className="flex items-center rounded-full px-4 py-2">
            <span className="mr-2 text-7xl">🏆</span>
            <span className="text-lg font-medium text-orange-600">
              {actualKeys.toLocaleString()}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">
          Rewards Program
        </h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Earn Apartey keys for every interaction on our platform and redeem
          exciting rewards!
        </p>

        <div className="bg-orange-50 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-gray-600 text-sm mb-1">Your Apartey Keys</p>
              <p className="text-2xl font-semibold text-gray-900">
                {actualKeys.toLocaleString()} Apartey keys
              </p>
            </div>
            <button
              onClick={onRedeemKeys}
              className="bg-[#C85212] hover:bg-orange-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Redeem Keys
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-900 mb-12">Rewards</h1>
      {renderContent()}
    </div>
  );
};

export default Rewards;