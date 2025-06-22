"use client";

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { StepProps } from '@/types/generated';
import PriceForm from "@/components/organisms/PriceForm";

const PriceStep: React.FC<StepProps> = ({ onNext, onBack }) => (
  <div className="max-w-2xl w-full">
    <PriceForm />
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

export default PriceStep; 