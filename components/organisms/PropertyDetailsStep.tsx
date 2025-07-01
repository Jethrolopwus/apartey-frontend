"use client";

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { StepProps } from '@/types/generated';
import PropertyDetailsForm from "@/components/organisms/PropertyDetailsForm";

interface PropertyDetailsStepProps extends StepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ onNext, onBack, formData, setFormData }) => (
  <div className="max-w-3xl w-full">
    <PropertyDetailsForm formData={formData} setFormData={setFormData} />
    <div className="flex justify-between mt-8">
      <button onClick={onBack} className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-2" />Back
      </button>
      <button onClick={onNext} className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#C85212' }}>
        Next<ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
);

export default PropertyDetailsStep; 