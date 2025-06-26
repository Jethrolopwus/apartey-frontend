"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Building, 
  Car, 
  Warehouse,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Camera,
  FileText,
  DollarSign,
  Phone,
  Star,
  BadgeDollarSign,
  User,
  Award
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useCreateListingsMutation } from "@/Hooks/use.createListings.mutation";
import { PropertyListingPayload, CategoryType, PropertyTypeType, ConditionType, PetPolicyType } from "@/types/propertyListing";

import PropertyTypeStep from '@/components/organisms/PropertyTypeStep';
import LocationStep from '@/components/organisms/LocationStep';
import PhotosVideosStep from '@/components/organisms/PhotosVideosStep';
import PropertyDetailsStep from '@/components/organisms/PropertyDetailsStep';
import PriceStep from '@/components/organisms/PriceStep';
import ContactInfoStep from '@/components/organisms/ContactInfoStep';
import AdPromotionStep from '@/components/organisms/AdPromotionStep';
import toast from 'react-hot-toast';

// Main Wizard Component
const PropertyListings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PropertyListingPayload | Partial<PropertyListingPayload>>({});
  const router = useRouter();
  const { mutate, isLoading } = useCreateListingsMutation();

  const steps = [
    { id: 'property-type', label: 'Property type', icon: Building2, component: PropertyTypeStep },
    { id: 'location', label: 'Location', icon: MapPin, component: LocationStep },
    { id: 'photos-videos', label: 'Photos and videos', icon: Camera, component: PhotosVideosStep },
    { id: 'property-details', label: 'Property details', icon: FileText, component: PropertyDetailsStep },
    { id: 'price', label: 'Price', icon: DollarSign, component: PriceStep },
    { id: 'contact-info', label: 'Contact info', icon: Phone, component: ContactInfoStep },
    { id: 'add-promotion', label: 'Add promotion', icon: Star, component: AdPromotionStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // 1. Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.typeOfOffer || !formData.description || !formData.petPolicy) {
      toast.error('Please fill all required fields.');
      return;
    }
    if (!formData.media?.coverPhoto) {
      toast.error('Please upload a cover photo.');
      return;
    }
    const loc = formData.location || {};
    if (!loc || typeof loc !== 'object' || 
        !('fullAddress' in loc) || !('apartment' in loc) || !('countryCode' in loc) || 
        !('state' in loc) || !('streetAddress' in loc) || !('country' in loc) || 
        !('city' in loc) || !('district' in loc) || !('zipCode' in loc) ||
        !loc.fullAddress || !loc.apartment || !loc.countryCode || !loc.state || 
        !loc.streetAddress || !loc.country || !loc.city || !loc.district || !loc.zipCode) {
      toast.error('Please complete all location fields.');
      return;
    }

    // 2. Map values to backend enums with proper typing
    const categoryMap: Record<CategoryType, string> = { 
      rent: "RENT", 
      sell: "SALE", 
      swap: "SWAP" 
    };
    const propertyTypeMap: Record<PropertyTypeType, string> = { 
      apartment: "APARTMENT", 
      house: "HOUSE", 
      commercial: "COMMERCIAL", 
      room: "ROOM", 
      garage: "GARAGE" 
    };
    const conditionMap: Record<ConditionType, string> = { 
      good: "GOOD", 
      new: "NEW", 
      renovated: "RENOVATED" 
    };
    const petPolicyMap: Record<PetPolicyType, string> = { 
      "pet-friendly": "PET_FRIENDLY", 
      "cats-only": "CATS_ONLY", 
      "dogs-only": "DOGS_ONLY", 
      "small-pets": "SMALL_PETS", 
      "no-pets": "NO_PETS" 
    };

    // 3. Build FormData with type safety
    const apiFormData = new window.FormData();
    apiFormData.append('firstName', formData.firstName || '');
    apiFormData.append('lastName', formData.lastName || '');
    apiFormData.append('email', formData.email || '');
    apiFormData.append('typeOfOffer', formData.typeOfOffer || '');
    apiFormData.append('description', formData.description || '');
    
    // Type-safe mapping with fallbacks
    const category = formData.category as CategoryType;
    const propertyType = formData.propertyType as PropertyTypeType;
    const condition = formData.condition as ConditionType;
    const petPolicy = formData.petPolicy as PetPolicyType;
    
    apiFormData.append('petPolicy', petPolicyMap[petPolicy] || petPolicy);
    apiFormData.append('category', categoryMap[category] || category);
    apiFormData.append('propertyType', propertyTypeMap[propertyType] || propertyType);
    apiFormData.append('condition', conditionMap[condition] || condition);

    // Handle cover photo
    if (formData.media?.coverPhoto) {
      apiFormData.append('coverPhoto', formData.media.coverPhoto);
    }

    // Handle location object
    apiFormData.append('location', JSON.stringify(loc));
    
    // Handle ad promotion
    if (formData.adPromotion) {
      apiFormData.append('adPromotion', JSON.stringify(formData.adPromotion));
    }

    // 4. Submit
    mutate(apiFormData, {
      onSuccess: (data) => {
        toast.success("Property listing submitted successfully!");
        setTimeout(() => {
          router.push("/listings");
        }, 1200);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to submit property listing");
      },
    });
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">List Your Property</h2>
          <p className="text-sm text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</p>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-orange-50 border-l-4 border-orange-500' 
                    : isCompleted
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-orange-500' : 
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <IconComponent className={`w-4 h-4 ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-orange-900' : 
                  isCompleted ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                backgroundColor: '#C85212'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </div>
  );
};

export default PropertyListings;