import React from 'react';

const SwapListingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Swap Properties</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Exchange your current property for another one that better suits your needs.
          </p>
        </div>
        
        <div className="mt-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Swaps</h2>
            <p className="text-gray-600">
              Find properties available for swapping. This is a great way to change your living situation without the hassle of traditional moving.
            </p>
            {/* Swap listings will be rendered here */}
            <div className="mt-8 text-center text-gray-500">
              Swap listings will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapListingsPage; 