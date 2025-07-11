"use client";

import { useState, useEffect } from 'react';
import { Check, Rocket, Zap, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';
import { PropertyListingPayload } from "@/types/propertyListing";

const promotionTiers = [
  {
    name: 'Easy Start',
    price: 20000,
    icon: Zap,
    description: "Ideal if you're testing the waters and want to start with basic exposure.",
    features: ['7-Day Run for your ad active for one week', 'Keep your ad live and active for one week', 'Track views and basic engagement metrics']
  },
  {
    name: 'Fast Sale',
    price: 40000,
    icon: Rocket,
    description: 'Perfect for serious sellers who want more exposure and detailed insights.',
    features: ['Includes everything in Easy Start', '14-Day Run for your ad active for two weeks', 'Detailed user engagement analytics', 'Dedicated assistance from our support team'],
    recommended: true
  },
  {
    name: 'Turbo Boost',
    price: 120000,
    icon: TrendingUp,
    description: 'Best for ambitious sellers who want maximum exposure and advanced insights.',
    features: ['Includes everything in Fast Sale', '28-Day Run for your ad active for four weeks', 'Advanced comprehensive data analysis', 'Personalized assistance from our manager']
  }
];

const otherServices = [
  { name: 'Check and certify my ad by Finder experts', price: 20000, icon: ShieldCheck, description: 'Ads with Certified badge get 10x more views.' },
  { name: '10 lifts to the top of the list (daily, 7 days)', price: 20000, icon: TrendingUp, description: 'Your ad will be seen by as many people as possible.' },
  { name: 'Detailed user engagement analytics', price: 20000, icon: BarChart2, description: 'Benefit from comprehensive data analysis, including demographic insights and engagement trends.' }
];

type AdPromotionFormProps = {
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingPayload | Partial<PropertyListingPayload>>>;
};

const AdPromotionForm: React.FC<AdPromotionFormProps> = ({ setFormData }) => {
  const [selectedTier, setSelectedTier] = useState('Fast Sale');
  const [selectedServices, setSelectedServices] = useState<string[]>(['10 lifts to the top of the list (daily, 7 days)']);
  
  const handleSelectTier = (tierName: string) => {
    setSelectedTier(tierName);
  };
  
  const handleToggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };
  
  const totalTierPrice = promotionTiers.find(t => t.name === selectedTier)?.price || 0;
  const totalServicesPrice = otherServices
    .filter(s => selectedServices.includes(s.name))
    .reduce((total, s) => total + s.price, 0);
  const totalPrice = totalTierPrice + totalServicesPrice;

  useEffect(() => {
    setFormData((prev) => ({
      ...(typeof prev === 'object' && prev !== null ? prev : {}),
      adPromotion: {
        selectedTier,
        selectedServices,
        totalPrice,
      },
    }));
  }, [selectedTier, selectedServices, totalPrice, setFormData]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-900">Effective promotion of your ad</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">We have created a special offer for your business to make promotion on Finder convenient and effective.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotionTiers.map(tier => (
          <div key={tier.name} className={`border rounded-lg p-6 flex flex-col relative ${selectedTier === tier.name ? 'border-orange-500 border-2' : 'border-gray-300'}`}>
            {tier.recommended && <div className="absolute top-0 -mt-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Recommended</div>}
            <div className="flex-grow">
                <tier.icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">NGN{tier.price.toLocaleString()}<span className="text-sm font-medium text-gray-500">/month</span></p>
                <p className="text-sm text-gray-600 mt-2 mb-4">{tier.description}</p>
                <button onClick={() => handleSelectTier(tier.name)} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${selectedTier === tier.name ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'}`}>Select {tier.name}</button>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {tier.features.map(feature => <li key={feature} className="flex items-start"><Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0"/>{feature}</li>)}
                </ul>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-6">Other services</h2>
      <div className="space-y-4">
        {otherServices.map(service => (
           <div key={service.name} className={`border rounded-lg p-4 flex items-center justify-between ${selectedServices.includes(service.name) ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
              <div className="flex items-center">
                 <button onClick={() => handleToggleService(service.name)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-4 ${selectedServices.includes(service.name) ? 'bg-green-600' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedServices.includes(service.name) ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
                 <div>
                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                    <p className="text-xs text-gray-500">{service.description}</p>
                 </div>
              </div>
              <p className="font-semibold text-gray-800">NGN{service.price.toLocaleString()}</p>
           </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end items-center">
        <span className="text-lg font-medium text-gray-600 mr-4">Total:</span>
        <span className="text-2xl font-bold text-gray-900">NGN{totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default AdPromotionForm; 