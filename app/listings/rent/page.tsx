import React from 'react';

const RentListingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Rent Properties</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find your perfect rental property from our extensive collection of homes, apartments, and more.
          </p>
        </div>
        
        <div className="mt-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Rentals</h2>
            <p className="text-gray-600">
              Browse through our curated selection of rental properties. Use filters to find exactly what you&apos;re looking for.
            </p>
            {/* Property listings will be rendered here */}
            <div className="mt-8 text-center text-gray-500">
              Property listings will be displayed here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentListingsPage; 