"use client";

import { useState } from 'react';
import { Building, User, ChevronDown } from 'lucide-react';

interface PriceFormData {
  price: string;
  currency: string;
  isMonthly: boolean;
  isNegotiated: boolean;
  offerType: 'private' | 'agent';
  notAvailableOnCedi: boolean;
  readyToCooperate: boolean;
  possibilityOfExchange: boolean;
}

const PriceForm = () => {
  const [formData, setFormData] = useState<PriceFormData>({
    price: '',
    currency: '$',
    isMonthly: true,
    isNegotiated: false,
    offerType: 'private',
    notAvailableOnCedi: false,
    readyToCooperate: false,
    possibilityOfExchange: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof PriceFormData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Price</h1>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price / Year *</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center">
            <label htmlFor="currency" className="sr-only">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={e => setFormData(p => ({...p, currency: e.target.value}))}
              className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            >
              <option>$</option>
              <option>€</option>
              <option>₦</option>
            </select>
          </div>
          <input
            type="text"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 pl-16 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Monthly</span>
           <button onClick={() => handleToggleChange('isMonthly')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isMonthly ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isMonthly ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
         <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Negotiated price</span>
          <button onClick={() => handleToggleChange('isNegotiated')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isNegotiated ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isNegotiated ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type of offer *</label>
        <div className="flex rounded-md border border-gray-300 p-1">
          <button onClick={() => setFormData(p => ({...p, offerType: 'private'}))} className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center transition-colors ${formData.offerType === 'private' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
            <User size={16} className="mr-2"/> Private person
          </button>
          <button onClick={() => setFormData(p => ({...p, offerType: 'agent'}))} className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center transition-colors ${formData.offerType === 'agent' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Building size={16} className="mr-2"/> Real estate agent
          </button>
        </div>
      </div>

      <div className="space-y-4">
         <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" name="notAvailableOnCedi" checked={formData.notAvailableOnCedi} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-700" />
            <span className="text-sm text-gray-700">Not available for sale on cedi</span>
        </label>
         <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" name="readyToCooperate" checked={formData.readyToCooperate} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-700" />
            <span className="text-sm text-gray-700">Ready to cooperate with real estate agents</span>
        </label>
         <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" name="possibilityOfExchange" checked={formData.possibilityOfExchange} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-700" />
            <span className="text-sm text-gray-700">The possibility of exchange</span>
        </label>
      </div>
    </div>
  );
};

export default PriceForm; 