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
    // 1. Validate required fields and enums
    const PropertyTypeEnum = ['House', 'Apartment', 'Room', 'Commercial', 'Garage'];
    const CategoriesEnum = ['Sale', 'Rent', 'Swap'];
    const AmenitiesEnum = [
      'TV set', 'Washing machine', 'Kitchen', 'Air conditioning', 'Separate workplace', 'Refrigerator',
      'Drying machine', 'Closet', 'Patio', 'Fireplace', 'Shower cabin', 'Whirlpool', 'Security cameras', 'Balcony', 'Bar',
      'Parking lot', 'Shopping center', 'Park/green area',
    ];
    const InfrastructureEnum = [
      "Schools",
      "Parking lot",
      "Shop",
      "Kindergarten",
      "Sports center",
      "Shopping center",
      "Underground",
      "Beauty salon",
      "Bank",
      "Cinema / theater",
      "Cinema/theater",
      "Restaurant / cafe",
      "Park / green area",
      "Park/green area"
    ];
    const PropertyConditionEnum = ['Good Condition', 'New Building', 'Renovated'];

    // Validate enums
    if (!PropertyTypeEnum.includes(formData.propertyType || '')) {
      console.log("The proerty",PropertyTypeEnum);
      
      toast.error('Invalid property type.');
      return;
    }
    if (!CategoriesEnum.includes(formData.category || '')) {
      toast.error('Invalid category.');
      return;
    }
    const invalidAmenities = (formData.amenities || []).filter((a: string) => !AmenitiesEnum.includes(a));
    if (invalidAmenities.length > 0) {
      console.log("Invalid amenities:", invalidAmenities, "All amenities:", formData.amenities);
      toast.error(`Invalid amenities: ${invalidAmenities.join(", ")}`);
      return;
    }
    const invalidInfrastructure = (formData.infrastructure || []).filter((i: string) => !InfrastructureEnum.includes(i));
    if (invalidInfrastructure.length > 0) {
      console.log("Invalid infrastructure:", invalidInfrastructure, "All infrastructure:", formData.infrastructure);
      toast.error(`Invalid infrastructure: ${invalidInfrastructure.join(", ")}`);
      return;
    }
    if (!PropertyConditionEnum.includes(formData.condition || '')) {
      toast.error('Invalid property condition.');
      return;
    }

    // 2. Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.typeOfOffer || !formData.description || !formData.petPolicy) {
      toast.error('Please fill all required fields.');
      return;
    }
    if (!formData?.media?.coverPhoto) {
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

    // 3. Build FormData with dot/bracket notation
    const apiFormData = new window.FormData();

    // Property Type
    apiFormData.append('propertyType', String(formData.propertyType || ''));
    apiFormData.append('category', String(formData.category || ''));
    apiFormData.append('condition', String(formData.condition || ''));
    apiFormData.append('petPolicy', String(formData.petPolicy || ''));

    // Location (dot notation) - Match exactly with Postman
    apiFormData.append('location.country', String(loc.country));
    apiFormData.append('location.stateOrRegion', String(loc.state));
    apiFormData.append('location.district', String(loc.district));
    apiFormData.append('location.postalCode', String(loc.zipCode));
    apiFormData.append('location.street', String(loc.streetAddress));
    apiFormData.append('location.countryCode', String(loc.countryCode));
    apiFormData.append('location.apartment', String(loc.apartment));
    apiFormData.append('location.fullAddress', String(loc.fullAddress));
    apiFormData.append('location.city', String(loc.city));
    // Add coordinates if they exist
    if (loc && typeof loc === 'object' && 'coordinates' in loc && loc.coordinates && typeof loc.coordinates === 'object') {
      const coords = loc.coordinates as any;
      if (coords.latitude !== undefined) {
        apiFormData.append('location.coordinates.latitude', String(coords.latitude));
      }
      if (coords.longitude !== undefined) {
        apiFormData.append('location.coordinates.longitude', String(coords.longitude));
      }
    }

    // Media (files)
    if (formData.media?.coverPhoto) {
      apiFormData.append('coverPhoto', formData.media.coverPhoto);
    }
    if (formData.media?.uploads && Array.isArray(formData.media.uploads)) {
      formData.media.uploads.forEach((file) => {
        if (file) apiFormData.append('mediaUploads', file);
      });
    }

    // Property Details (dot/bracket notation)
    apiFormData.append('propertyDetails.price', String(formData.price || ''));
    apiFormData.append('propertyDetails.negotiatedPrice', String(formData.isNegotiated || ''));
    apiFormData.append('propertyDetails.totalFloors', String(formData.totalFloors || ''));
    apiFormData.append('propertyDetails.floor', String(formData.floor || ''));
    apiFormData.append('propertyDetails.totalAreaSqM', String(formData.totalArea || ''));
    apiFormData.append('propertyDetails.livingAreaSqM', String(formData.livingArea || ''));
    apiFormData.append('propertyDetails.kitchenAreaSqM', String(formData.kitchenArea || ''));
    apiFormData.append('propertyDetails.bedrooms', String(formData.bedrooms || ''));
    apiFormData.append('propertyDetails.bathrooms', String(formData.bathrooms || ''));
    apiFormData.append('propertyDetails.parkingSpots', String(formData.parkingSpots || ''));
    (formData.amenities || []).forEach((item) => {
      apiFormData.append('propertyDetails.amenities[]', String(item));
    });
    (formData.infrastructure || []).forEach((item) => {
      apiFormData.append('propertyDetails.infrastructure[]', String(item));
    });
    apiFormData.append('propertyDetails.description', String(formData.description || ''));

    // Contact Info (dot notation)
    apiFormData.append('contactInfo.typeOfOffer', String(formData.typeOfOffer || ''));
    apiFormData.append('contactInfo.firstName', String(formData.firstName || ''));
    apiFormData.append('contactInfo.lastName', String(formData.lastName || ''));
    apiFormData.append('contactInfo.email', String(formData.email || ''));
    apiFormData.append('contactInfo.phoneNumber', String(formData.phoneNumber || ''));
    apiFormData.append('contactInfo.openForTourSchedule', String(formData.openForTour || ''));

    // Ad Promotion (dot notation, if present)
    if (formData.adPromotion) {
      if ('selectedTier' in formData.adPromotion && formData.adPromotion.selectedTier)
        apiFormData.append('adPromotion.selectedTier', String(formData.adPromotion.selectedTier));
      if ('certifiedByFinder' in formData.adPromotion && formData.adPromotion.certifiedByFinder)
        apiFormData.append('adPromotion.certifiedByFinder', String(formData.adPromotion.certifiedByFinder));
      if ('liftsToTopCount' in formData.adPromotion && formData.adPromotion.liftsToTopCount)
        apiFormData.append('adPromotion.liftsToTopCount', String(formData.adPromotion.liftsToTopCount));
      if ('detailedAnalytics' in formData.adPromotion && formData.adPromotion.detailedAnalytics)
        apiFormData.append('adPromotion.detailedAnalytics', String(formData.adPromotion.detailedAnalytics));
      if ('totalPrice' in formData.adPromotion && formData.adPromotion.totalPrice)
        apiFormData.append('adPromotion.totalPrice', String(formData.adPromotion.totalPrice));
    }

    // Log the submitted data for debugging
    const submittedData = {
      ...formData,
      location: loc,
    };
    console.log('Submitted property listing data:', submittedData);

    // Submit
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