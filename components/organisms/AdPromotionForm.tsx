"use client";

import { useState, useEffect } from 'react';
import { Check, Rocket, Zap, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';
import { PropertyListingPayload } from "@/types/propertyListing";
import { useDetectUserLocation } from "@/Hooks/use-getUserLocation.query";

// Currency conversion and pricing logic
const getCurrencyAndPrices = (countryCode: string) => {
  switch(countryCode) {
    case 'NG':
      return {
        currency: '₦',
        currencyCode: 'NGN',
        prices: {
          easyStart: 0,
          fastSale: 40000,
          turboBoost: 120000,
          otherServices: 20000
        }
      };
    case 'EE':
      return {
        currency: '€',
        currencyCode: 'EUR',
        prices: {
          easyStart: 0,
          fastSale: 28,
          turboBoost: 80,
          otherServices: 17
        }
      };
    default:
      return {
        currency: '$',
        currencyCode: 'USD',
        prices: {
          easyStart: 0,
          fastSale: 28,
          turboBoost: 80,
          otherServices: 18
        }
      };
  }
};

// Apartey Keys conversion functions
const keysToCurrency = (keys: number, currencyCode: string) => {
  const keysPerUnit = 100; // 100 keys = 1 unit of currency
  
  switch(currencyCode) {
    case 'EUR':
      return keys / keysPerUnit; // 100 keys = €1
    case 'NGN':
      return (keys / keysPerUnit) * 500; // 100 keys = ₦500
    case 'USD':
    default:
      return keys / keysPerUnit; // 100 keys = $1
  }
};

const promotionTiers = [
  {
    name: 'Easy Start',
    icon: Zap,
    description: "Ideal if you're testing the waters and want to start with basic exposure.",
    features: ['Upload up to 4 high-quality photos', 'Basic search visibility', 'Track views and basic engagement metrics', 'Property inquiry management']
  },
  {
    name: 'Fast Sale',
    icon: Rocket,
    description: 'Perfect for serious sellers who want more exposure and detailed insights.',
    features: ['Includes everything in Easy Start+', '14-Day Run for your ad active for two weeks', 'Detailed user engagement analytics', 'Dedicated assistance from our support team'],
    recommended: true
  },
  {
    name: 'Turbo Boost',
    icon: TrendingUp,
    description: 'Best for ambitious sellers who want maximum exposure and advanced insights.',
    features: ['Includes everything in Fast Sale+', '28-Day Run for your ad active for three weeks', 'Advanced comprehensive data analysis', 'Personalized assistance from our manager']
  }
];

const otherServices = [
  { name: 'Check and certify my ad by Apartey experts', icon: ShieldCheck, description: 'Ads with Certified badge get 10x more views.' },
  { name: '10 lifts to the top of the list (daily, 7 days)', icon: TrendingUp, description: 'Your ad will be seen by as many people as possible.' },
  { name: 'Detailed user engagement analytics', icon: BarChart2, description: 'Benefit from comprehensive data analysis, including demographic insights and engagement trends.' }
];

// Get tier price based on selected tier
const getTierPrice = (tierName: string, prices: { easyStart: number; fastSale: number; turboBoost: number }) => {
  switch(tierName) {
    case 'Easy Start':
      return prices.easyStart;
    case 'Fast Sale':
      return prices.fastSale;
    case 'Turbo Boost':
      return prices.turboBoost;
    default:
      return 0;
  }
};

type AdPromotionFormProps = {
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingPayload | Partial<PropertyListingPayload>>>;
  onSubmit?: () => void;
};

const AdPromotionForm: React.FC<AdPromotionFormProps> = ({ setFormData }) => {
  const { data: locationData, isLoading: locationLoading } = useDetectUserLocation();
  const { currency, currencyCode, prices } = getCurrencyAndPrices(locationData?.countryCode || 'US');
  
  const [selectedTier, setSelectedTier] = useState<'Easy Start' | 'Fast Sale' | 'Turbo Boost'>('Easy Start');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [aparteyKeys, setAparteyKeys] = useState<number>(0);

  // Derived states for dynamic flow
  const showOtherServices = selectedTier !== 'Easy Start';
  const tierPrice = getTierPrice(selectedTier, prices);
  
  const handleSelectTier = (tierName: 'Easy Start' | 'Fast Sale' | 'Turbo Boost') => {
    setSelectedTier(tierName);
    
    // Clear selected services when switching to Easy Start tier
    if (tierName === 'Easy Start') {
      setSelectedServices([]);
      setAparteyKeys(0);
    }
  };
  
  const handleToggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };
  
  const totalServicesPrice = selectedServices.reduce((total) => {
    return total + (prices.otherServices || 0);
  }, 0);

  const keysDiscount = keysToCurrency(aparteyKeys, currencyCode);
  const totalPrice = Math.max(0, tierPrice + totalServicesPrice - keysDiscount);

  useEffect(() => {
    setFormData((prev) => ({
      ...(typeof prev === 'object' && prev !== null ? prev : {}),
      adPromotion: {
        selectedTier,
        selectedServices: showOtherServices ? selectedServices : [],
        totalPrice,
        aparteyKeys: showOtherServices ? aparteyKeys : 0,
        keysDiscount: showOtherServices ? keysDiscount : 0,
        currency: currencyCode,
        location: locationData?.countryCode || 'US',
      },
    }));
  }, [selectedTier, selectedServices, totalPrice, aparteyKeys, keysDiscount, showOtherServices, setFormData, currencyCode, locationData]);

  // Loading state while detecting location
  if (locationLoading) {
    return (
      <div className="w-full px-4 md:px-0">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Detecting your location for pricing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-0">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Effective promotion of your ad</h1>
      <p className="text-sm md:text-base text-gray-600 mb-8 md:mb-10">We have created a special offer for your business to make promotion on Finder convenient and effective.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto min-w-0">
        {promotionTiers.map((tier) => {
          const tierPrice = getTierPrice(tier.name, prices);
          const isSelected = selectedTier === tier.name;
          
          return (
            <div key={tier.name} className={`bg-white border-2 rounded-xl p-6 md:p-6 flex flex-col relative h-auto ${isSelected ? 'border-[#C85212] shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C85212] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Recommended
                </div>
              )}
              <div className="flex-grow flex flex-col">
                  <div className="mb-4">
                    <tier.icon className="w-8 h-8 md:w-10 md:h-10 text-[#C85212] mb-3" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    {tier.name === 'Easy Start' ? (
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">{currency}0 <span className="text-sm md:text-base font-medium text-gray-500">/ Always</span></p>
                    ) : (
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">
                          {currency}{tierPrice.toLocaleString()} <span className="text-sm md:text-base font-medium text-gray-500">/ month</span>
                        </p>
                      </div>
                    )}
                    <p className="text-sm md:text-base text-gray-600 mt-2 mb-4">{tier.description}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleSelectTier(tier.name as 'Easy Start' | 'Fast Sale' | 'Turbo Boost')} 
                    className={`w-full py-3 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                      isSelected 
                        ? 'bg-[#C85212] text-white shadow-md' 
                        : 'bg-white border-2 border-[#C85212] text-[#C85212] hover:bg-orange-50'
                    }`}
                  >
                    {tier.name === 'Easy Start' ? 'List Property for Free' : `Select ${tier.name}`}
                  </button>
                  
                  <ul className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-start">
                          <Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0"/>
                          <span>{feature}</span>
                        </li>
                      ))}
                  </ul>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Conditionally show Other services section */}
      {showOtherServices && (
        <>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mt-8 md:mt-12 mb-4 md:mb-6">Other services</h2>
          <div className="space-y-4">
            {otherServices.map(service => (
               <div key={service.name} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center flex-1 min-w-0">
                     <button 
                       onClick={() => handleToggleService(service.name)} 
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-4 flex-shrink-0 ${
                         selectedServices.includes(service.name) ? 'bg-green-600' : 'bg-gray-300'
                       }`}
                     >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            selectedServices.includes(service.name) ? 'translate-x-6' : 'translate-x-1'
                          }`} 
                        />
                     </button>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-base">{service.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                     </div>
                  </div>
                  <p className="font-semibold text-gray-800 text-base ml-4 flex-shrink-0">
                    {currency}{prices.otherServices.toLocaleString()}{service.name.includes('analytics') ? '/month' : ''}
                  </p>
               </div>
            ))}
          </div>

          {/* Apartey Keys Section */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Use Apartey keys</span>
              <input
                type="number"
                value={aparteyKeys}
                onChange={(e) => setAparteyKeys(parseInt(e.target.value) || 0)}
                className="w-20 h-10 px-3 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                step="100"
              />
            </div>
          </div>
        </>
      )}

      {/* Total Section - Show only for paid services */}
      {showOtherServices && (
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total: {currency}{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdPromotionForm; 