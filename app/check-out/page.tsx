"use client";

import Link from "next/link";

const CheckOutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Checkout Page
          </h1>
          <p className="text-gray-600 mb-6">
            To access the checkout, please use the correct URL format with a listing ID.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Correct URL Format:</h3>
            <p className="text-sm text-gray-600 mb-2">
              <code className="bg-gray-200 px-2 py-1 rounded">
                /check-out/[listing-id]?tier=FastSale&addOns=liftsToTop,certifiedByApartey
              </code>
            </p>
            <p className="text-xs text-gray-500">
              Example: <code className="bg-gray-200 px-1 py-0.5 rounded">/check-out/687d656b505f34d8d7deee04</code>
            </p>
          </div>
          
          <Link
            href="/"
            className="w-full bg-[#C85212] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-orange-700 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;