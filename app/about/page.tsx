import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Apartey</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Apartey is your trusted platform for finding the perfect rental property and connecting with reliable landlords and agents.
          </p>
        </div>
        
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To simplify the rental process and create better experiences for both tenants and property owners through innovative technology and trusted partnerships.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading platform that transforms how people find, rent, and manage properties with transparency and efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 