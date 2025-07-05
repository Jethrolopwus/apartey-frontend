import React from 'react';

const InsightsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Market Insights</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest trends, analysis, and insights about the rental property market.
          </p>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Market Trends</h3>
            <p className="text-gray-600">
              Discover current market trends and how they affect rental prices and availability in your area.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Investment Tips</h3>
            <p className="text-gray-600">
              Expert advice on property investment and maximizing your rental returns.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Neighborhood Guides</h3>
            <p className="text-gray-600">
              Comprehensive guides to help you understand different neighborhoods and communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage; 