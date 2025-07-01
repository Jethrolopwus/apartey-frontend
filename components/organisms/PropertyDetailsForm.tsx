"use client";

import { useState, useEffect } from 'react';
import CountSelector from '@/components/molecules/CountSelector';
import CheckboxGrid from '@/components/molecules/CheckboxGrid';

const amenities = [
    "TV set", "Washing machine", "Kitchen", "Air conditioning", "Separate workplace", "Refrigerator",
    "Drying machine", "Closet", "Perks", "Fireplace", "Shower cabin", "Whirlpool", "Security cameras", "Balcony", "Bar"
];

const infrastructure = [
    "Schools", "Parking lot", "Shop", "Kindergarten", "Sports center", "Shopping center",
    "Underground", "Beauty salon", "Rank", "Cinema/theater", "Restaurant/cafe", "Park/green area"
];



interface PropertyDetailsFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PropertyDetailsForm = ({ formData, setFormData }: PropertyDetailsFormProps) => {
    const [localData, setLocalData] = useState({
        totalFloors: formData.totalFloors || '16',
        floor: formData.floor || '12',
        totalArea: formData.totalArea || '120',
        livingArea: formData.livingArea || '86',
        kitchenArea: formData.kitchenArea || '25',
        bedrooms: formData.bedrooms || 3,
        bathrooms: formData.bathrooms || 2,
        parkingSpots: formData.parkingSpots || 1,
        amenities: formData.amenities || ["TV set", "Air conditioning", "Drying machine", "Washing machine", "Separate workplace", "Shower cabin", "Balcony", "Kitchen", "Parking lot", "Shopping center", "Park/green area"],
        infrastructure: formData.infrastructure || ["Schools", "Kindergarten", "Beauty salon", "Shopping center", "Park/green area"],
        description: formData.description || '',
        condition: formData.condition || 'Good Condition',
        petPolicy: formData.petPolicy || 'pet-friendly'
    });

    useEffect(() => {
        setFormData((prev: any) => ({ ...prev, ...localData }));
    }, [localData]);

    const handleCountChange = (field: string) => (value: number | null) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleCheckboxChange = (field: string) => (selected: string[]) => {
        setLocalData(prev => ({ ...prev, [field]: selected }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <div className="w-full space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900">Property details</h1>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor='totalFloors' className="block text-sm font-medium text-gray-700">Total floors *</label>
                    <input type="number" name="totalFloors" id="totalFloors" value={localData.totalFloors} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor='floor' className="block text-sm font-medium text-gray-700">Floor *</label>
                    <input type="number" name="floor" id="floor" value={localData.floor} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div>
                    <label htmlFor='totalArea' className="block text-sm font-medium text-gray-700">Total area *</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" name="totalArea" id="totalArea" value={localData.totalArea} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14" placeholder="0" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">sq.m</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor='livingArea' className="block text-sm font-medium text-gray-700">Living area *</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" name="livingArea" id="livingArea" value={localData.livingArea} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14" placeholder="0" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">sq.m</span>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor='kitchenArea' className="block text-sm font-medium text-gray-700">Kitchen area *</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" name="kitchenArea" id='kitchenArea' value={localData.kitchenArea} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm pr-14" placeholder="0" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">sq.m</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <CountSelector label="Bedrooms *" value={localData.bedrooms} onChange={handleCountChange('bedrooms')} />
                <CountSelector label="Bathrooms *" value={localData.bathrooms} onChange={handleCountChange('bathrooms')} />
                <CountSelector label="Parking spots *" value={localData.parkingSpots} onChange={handleCountChange('parkingSpots')} />
            </div>

            <CheckboxGrid title="Amenities" options={amenities} selectedOptions={localData.amenities} onChange={handleCheckboxChange('amenities')} />
            
            <CheckboxGrid title="Infrastructure" subtitle="(up to 500 meters)" options={infrastructure} selectedOptions={localData.infrastructure} onChange={handleCheckboxChange('infrastructure')} />

            <div>
                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                 <p className="text-sm text-gray-500 mb-2 mt-1">Here you can let your imagination run wild and describe the property in the best possible way!</p>
                 <textarea name="description" id="description" value={localData.description} onChange={handleInputChange} rows={4} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Describe your property"></textarea>
            </div>

           
        </div>
    );
};

export default PropertyDetailsForm; 