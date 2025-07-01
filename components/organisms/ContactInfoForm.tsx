"use client";

import { useState, useEffect } from 'react';

interface ContactInfoFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    openForTour: boolean;
    typeOfOffer: string;
}

interface ContactInfoFormProps {
  formData: ContactInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ContactInfoForm = ({ formData, setFormData }: ContactInfoFormProps) => {
  const [localData, setLocalData] = useState<ContactInfoFormData>({
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    email: formData.email || '',
    phoneNumber: formData.phoneNumber || '',
    openForTour: formData.openForTour || false,
    typeOfOffer: formData.typeOfOffer || ''
  });

  useEffect(() => {
    setFormData((prev: any) => ({ ...prev, ...localData }));
  }, [localData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: keyof ContactInfoFormData) => {
    setLocalData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="w-full space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">Contact info</h1>

        <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name *</label>
                <input type="text" name="firstName" id="firstName" value={localData.firstName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name *</label>
                <input type="text" name="lastName" id="lastName" value={localData.lastName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
        </div>

         <div className="grid grid-cols-2 gap-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                <input type="email" name="email" id="email" value={localData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone number *</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={localData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="+__ ___ ___" />
            </div>
        </div>

        {/* Type of Offer */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of offer *</label>
            <div className="flex rounded-md border border-gray-300 p-1">
                <button 
                    type="button"
                    onClick={() => setLocalData(prev => ({ ...prev, typeOfOffer: 'private' }))} 
                    className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center transition-colors ${localData.typeOfOffer === 'private' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    Private person
                </button>
                <button 
                    type="button"
                    onClick={() => setLocalData(prev => ({ ...prev, typeOfOffer: 'agent' }))} 
                    className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center transition-colors ${localData.typeOfOffer === 'agent' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    Real estate agent
                </button>
            </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Open for schedule for a tour</span>
           <button onClick={() => handleToggleChange('openForTour')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localData.openForTour ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localData.openForTour ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
    </div>
  );
};

export default ContactInfoForm; 