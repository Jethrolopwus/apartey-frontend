"use client";
import React from "react";
interface RewardsProps {
  currentKeys?: number;
  onRedeemKeys?: () => void;
}

const Rewards: React.FC<RewardsProps> = ({
  currentKeys = 1250,
  onRedeemKeys,
}) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-100 ">
    
      <h1 className="text-4xl font-semibold text-gray-900 mb-12">Rewards</h1>

   
      <div className="bg-white rounded-2xl p-8 text-center">
     
        <div className="flex justify-center items-center mt-4 space-x-2 sm:mt-0">
          <div className="flex items-center rounded-full  px-4 py-2">
            <span className="mr-2  text-7xl">🏆</span>
            <span className="text-lg font-medium text-orange-600">
          
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
                {currentKeys.toLocaleString()} Apartey keys
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
    </div>
  );
};

export default Rewards;