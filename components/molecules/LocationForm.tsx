"use client";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

const LocationForm = () => {
  const {
    control,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      country: '',
      city: '',
      state: '',
      district: '',
      zipCode: '',
      streetAddress: ''
    }
  });

  const selectedCountry = watch('country');
  const selectedCity = watch('city');
  const selectedState = watch('state');

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  // Dynamic state options based on country
  const getStateOptions = (country) => {
    const states = {
      nigeria: ['Abuja FCT', 'Lagos', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Ogun', 'Katsina', 'Cross River', 'Delta'],
      ghana: ['Greater Accra', 'Ashanti', 'Northern', 'Central', 'Eastern', 'Western', 'Volta', 'Upper East'],
      kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'],
      'south-africa': ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape']
    };
    return states[country] || [];
  };

  // Dynamic city options based on country
  const getCityOptions = (country) => {
    const cities = {
      nigeria: ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt'],
      ghana: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'],
      kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
      'south-africa': ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria']
    };
    return cities[country] || [];
  };

  // Dynamic district options based on state
  const getDistrictOptions = (state) => {
    const districts = {
      'Abuja FCT': ['Wuse', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa'],
      'Lagos': ['Victoria Island', 'Ikeja', 'Lekki', 'Surulere', 'Yaba'],
      'Greater Accra': ['Tema', 'East Legon', 'Osu', 'Adabraka'],
      'Nairobi': ['Westlands', 'Karen', 'Kilimani', 'CBD'],
      'Western Cape': ['City Bowl', 'Sea Point', 'Camps Bay', 'Constantia']
    };
    return districts[state] || [];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="" className="text-gray-500">Nigeria</option>
                      <option value="nigeria">Nigeria</option>
                      <option value="ghana">Ghana</option>
                      <option value="kenya">Kenya</option>
                      <option value="south-africa">South Africa</option>
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!selectedCountry}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } ${!selectedCountry ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="" className="text-gray-500">Abuja</option>
                      {getCityOptions(selectedCountry).map((city:any) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* State Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!selectedCountry}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      } ${!selectedCountry ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="" className="text-gray-500">Select State</option>
                      {getStateOptions(selectedCountry).map((state:any) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            {/* District Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: 'District is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!selectedState}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      } ${!selectedState ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="" className="text-gray-500">Wuse</option>
                      {getDistrictOptions(selectedState).map((district: any) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
              )}
            </div>

            {/* Zip Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip code <span className="text-red-500">*</span>
              </label>
              <Controller
                name="zipCode"
                control={control}
                rules={{ 
                  required: 'Zip code is required',
                  pattern: {
                    value: /^\d{5,6}$/,
                    message: 'Please enter a valid zip code (5-6 digits)'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="11237"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          {/* Street Address Field */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street address <span className="text-red-500">*</span>
            </label>
            <Controller
              name="streetAddress"
              control={control}
              rules={{ 
                required: 'Street address is required',
                minLength: {
                  value: 5,
                  message: 'Street address must be at least 5 characters'
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Kafur-Funtua Road"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 ${
                    errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              )}
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.streetAddress.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;