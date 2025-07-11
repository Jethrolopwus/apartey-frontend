"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import AdPromotionForm from "@/components/organisms/AdPromotionForm";
import { PropertyListingPayload } from "@/types/propertyListing";

type AdPromotionStepProps = {
  onBack: () => void;
  onSubmit: () => void;
  formData: PropertyListingPayload | Partial<PropertyListingPayload>;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingPayload | Partial<PropertyListingPayload>>>;
};

const AdPromotionStep: React.FC<AdPromotionStepProps> = ({ onBack, onSubmit,  setFormData }) => (
  <div className="max-w-4xl w-full">
    <AdPromotionForm setFormData={setFormData} />
    <div className="flex justify-between mt-8">
       <button onClick={onBack} className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-2" />Back
      </button>
      <button onClick={onSubmit} className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#C85212' }}>
        Save and publish
      </button>
    </div>
  </div>
);

export default AdPromotionStep; 