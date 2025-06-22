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

import PropertyTypeStep from '@/components/organisms/PropertyTypeStep';
import LocationStep from '@/components/organisms/LocationStep';
import PhotosVideosStep from '@/components/organisms/PhotosVideosStep';
import PropertyDetailsStep from '@/components/organisms/PropertyDetailsStep';
import PriceStep from '@/components/organisms/PriceStep';
import ContactInfoStep from '@/components/organisms/ContactInfoStep';
import AdPromotionStep from '@/components/organisms/AdPromotionStep';

// Main Wizard Component
const PropertyListings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

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
    console.log('Final form data:', formData);
    alert('Property listing submitted successfully!');
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