"use client";
import React, { useState } from 'react';
import { 
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { StepProps } from '@/types/generated';

const LocationForm: React.FC<StepProps> = ({ onNext, onBack, formData, setFormData }) => {
  const [searchAddress, setSearchAddress] = useState(formData.searchAddress || '');
  const [country, setCountry] = useState(formData.country || '');
  const [city, setCity] = useState(formData.city || '');
  const [district, setDistrict] = useState(formData.district || '');
  const [zipCode, setZipCode] = useState(formData.zipCode || '');
  const [streetAddress, setStreetAddress] = useState(formData.streetAddress || '');
  const [apartment, setApartment] = useState(formData.apartment || '');
  const [countryCode, setCountryCode] = useState(formData.countryCode || '');
    const [state, setState] = useState(formData.state || '');
  
  const handleNext = () => {
    if (setFormData) {
      const location = {
        fullAddress: searchAddress,
        apartment,
        countryCode,
        state,
        streetAddress,
        country,
        city,
        district,
        zipCode,
      };
      setFormData({
        ...formData,
        searchAddress,
        country,
        city,
        district,
        zipCode,
        streetAddress,
        apartment,
        countryCode,
        state,
        location,
      });
    }
    onNext();
  };
  
  const sidebarItems = [
    { id: 'property-type', label: 'Property type', active: false, completed: true },
    { id: 'location', label: 'Location', active: true, completed: false },
    { id: 'photos-videos', label: 'Photos and videos', active: false, completed: false },
    { id: 'property-details', label: 'Property details', active: false, completed: false },
    { id: 'price', label: 'Price', active: false, completed: false },
    { id: 'contact-info', label: 'Contact info', active: false, completed: false },
    { id: 'add-promotion', label: 'Add promotion', active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="space-y-4">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                item.active 
                  ? 'bg-orange-50 border-l-4 border-orange-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                item.active ? 'bg-orange-500' : 
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className={`text-sm font-medium ${
                item.active ? 'text-orange-900' : 
                item.completed ? 'text-green-700' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Location</h1>
          
          {/* Search Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="Enter address"
            />
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
                >
                  <option value="Abuja">Abuja</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Kano">Kano</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
                >
                  <option value="Wuse">Wuse</option>
                  <option value="Garki">Garki</option>
                  <option value="Maitama">Maitama</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Enter zip code"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="Enter street address"
            />
          </div>

          {/* Additional Location Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Apartment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apartment/Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="e.g., Flat 2B, Apt 15"
              />
            </div>

            {/* Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
                >
                  <option value="">Select country code</option>
                  <option value="NG">NG - Nigeria</option>
                  <option value="GH">GH - Ghana</option>
                  <option value="KE">KE - Kenya</option>
                  <option value="ET">ET - Estonia</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* State/Region */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Region <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
              >
                <option value="">Select state/region</option>
                <option value="Abuja FCT">Abuja FCT</option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Tallinn">Tallinn</option>
                <option value="Accra">Accra</option>
                <option value="Nairobi">Nairobi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Display on the map</h3>
            <p className="text-xs text-gray-500 mb-4">You can change the position of the mark on the map</p>
            
            {/* Map Container */}
            <div className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
              {/* Simulated Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-gray-100 to-blue-100">
                {/* Map grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Simulated roads */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-300 transform -translate-x-1/2"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-gray-300 transform rotate-45"></div>
                
                {/* Location labels */}
                <div className="absolute top-4 left-4 text-xs text-gray-600 font-medium">Garki</div>
                <div className="absolute top-4 right-4 text-xs text-gray-600 font-medium">Maitama</div>
                <div className="absolute bottom-4 left-4 text-xs text-gray-600 font-medium">Wuse</div>
                <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-medium">Central Area</div>
                
                {/* Location Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg relative">
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-orange-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#C85212' }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;