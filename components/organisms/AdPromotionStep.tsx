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

const AdPromotionStep: React.FC<AdPromotionStepProps> = ({ onBack, onSubmit, formData, setFormData }) => {
  // Determine button text based on selected tier
  const selectedTier = formData?.adPromotion?.selectedTier;
  const buttonText = selectedTier === 'Easy Start' ? 'Submit' : 'Pay';

  const handleSubmit = () => {
    console.log("🔍 AdPromotionStep Debug:");
    console.log("Form Data:", formData);
    console.log("Selected Tier:", selectedTier);
    console.log("Ad Promotion:", formData?.adPromotion);
    
    // Always proceed with normal submission
    // The PropertyListings component will handle the checkout redirect after property creation
    onSubmit();
  };

  return (
    <div className="max-w-4xl w-full">
      <AdPromotionForm setFormData={setFormData} onSubmit={handleSubmit} />
      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-[#C85212]">
         <button onClick={onBack} className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" />Back
        </button>
         <button 
           onClick={handleSubmit}
           className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90" 
           style={{ backgroundColor: '#C85212' }}
         >
           {buttonText}
         </button>
      </div>
    </div>
  );
};

export default AdPromotionStep; 