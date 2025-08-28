"use client";

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { StepProps } from '@/types/generated';
import PhotoVideoUploader from "@/components/organisms/PhotoVideoUploader";
import { PropertyListingFormState } from '@/types/propertyListing';
import toast from "react-hot-toast";

interface PhotosVideosStepProps extends StepProps {
  formData: PropertyListingFormState;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingFormState>>;
}

const PhotosVideosStep: React.FC<PhotosVideosStepProps> = ({ onNext, onBack, formData, setFormData }) => {
  // Check if a valid cover photo URL is present
  const hasCoverPhoto = !!(formData?.coverPhoto && formData.coverPhoto instanceof File);

  const handleNextClick = () => {
    if (!hasCoverPhoto) {
      toast.error("Cover photo is required. Please upload a cover photo.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl w-full">
      <PhotoVideoUploader formData={formData} setFormData={setFormData} />
      <div className="border-t-2 border-[#C85212] mt-8 pt-8"></div>
      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" />Back
        </button>
        <button
          onClick={handleNextClick}
          className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C85212' }}
          disabled={!hasCoverPhoto}
        >
          Next<ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PhotosVideosStep; 