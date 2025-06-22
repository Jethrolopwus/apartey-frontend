"use client";

import { useState } from 'react';

interface ContactInfoFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    openForTour: boolean;
}

const ContactInfoForm = () => {
  const [formData, setFormData] = useState<ContactInfoFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    openForTour: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof ContactInfoFormData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-full space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">Contact info</h1>

        <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name *</label>
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name *</label>
                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
        </div>

         <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone number *</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="+__ ___ ___" />
            </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Open for schedule for a tour</span>
           <button onClick={() => handleToggleChange('openForTour')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.openForTour ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.openForTour ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
    </div>
  );
};

export default ContactInfoForm; 