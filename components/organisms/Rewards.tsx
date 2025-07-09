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
      {/* Page Title */}
      <h1 className="text-4xl font-semibold text-gray-900 mb-12">Rewards</h1>

      {/* Rewards Program Card */}
      <div className="bg-white rounded-2xl p-8 text-center">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Trophy Base */}
            <div className="w-20 h-20 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-lg relative">
              {/* Trophy Cup */}
              <div className="absolute inset-x-2 top-2 bottom-4 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-t-lg">
                {/* Trophy Handles */}
                <div className="absolute -left-2 top-2 w-3 h-6 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-l-full"></div>
                <div className="absolute -right-2 top-2 w-3 h-6 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-r-full"></div>
                {/* Trophy Center Highlight */}
                <div className="absolute inset-x-2 top-2 bottom-2 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-t-lg"></div>
              </div>
              {/* Trophy Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-gradient-to-b from-amber-600 to-amber-700 rounded-sm"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gradient-to-b from-amber-700 to-amber-800 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Rewards Program
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Earn Apartey keys for every interaction on our platform and redeem
          exciting rewards!
        </p>

        {/* Keys Section */}
        <div className="bg-orange-50 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-gray-600 text-sm mb-1">Your Apartey Keys</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentKeys.toLocaleString()} Apt keys
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
