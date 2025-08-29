"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Camera,
  FileText,
  DollarSign,
  Phone,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateListingsMutation } from "../../Hooks/use.createListings.mutation";
import { PropertyListingFormState, PropertyCreationResponse } from "../../types/propertyListing";
import { createFormDataPayload } from "../../utils/propertyListingTransformer";

import PropertyTypeStep from "./PropertyTypeStep";
import LocationStep from "./LocationStep";
import PhotosVideosStep from "./PhotosVideosStep";
import PropertyDetailsStep from "./PropertyDetailsStep";
import PriceStep from "./PriceStep";
import ContactInfoStep from "./ContactInfoStep";
import AdPromotionStep from "./AdPromotionStep";
import toast from "react-hot-toast";



// Main Wizard Component
const PropertyListings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PropertyListingFormState>({});
  const router = useRouter();
  const { mutate } = useCreateListingsMutation();

  const steps = [
    {
      id: "property-type",
      label: "Property type",
      icon: Building2,
      component: PropertyTypeStep,
    },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      component: LocationStep,
    },
    {
      id: "photos-videos",
      label: "Photos and videos",
      icon: Camera,
      component: PhotosVideosStep,
    },
    {
      id: "property-details",
      label: "Property details",
      icon: FileText,
      component: PropertyDetailsStep,
    },
    { id: "price", label: "Price", icon: DollarSign, component: PriceStep },
    {
      id: "contact-info",
      label: "Contact info",
      icon: Phone,
      component: ContactInfoStep,
    },
    {
      id: "add-promotion",
      label: "Add promotion",
      icon: Star,
      component: AdPromotionStep,
    },
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

  const handleSubmit = async () => {
    try {
      // Check user role and authentication
      const token = localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("userRole");
      
      if (!token) {
        toast.error("Please sign in to create a listing");
        return;
      }
      
      if (userRole !== "homeowner" && userRole !== "agent") {
        toast.error("Only homeowners and agents can create property listings");
        return;
      }

      // Create FormData payload using the new function
      const form = createFormDataPayload(formData);
      
      // Add user role
      form.append("userRole", userRole);

      // Submit to API
      mutate(form, {
        onSuccess: (response: PropertyCreationResponse) => {
          toast.success("Property listing submitted successfully!");
          
          // Extract property ID from response
          const propertyId = response?.property?.id;
          
          if (propertyId) {
            // Build checkout URL with payment parameters
            const checkoutUrl = `/check-out/${propertyId}?tier=FastSale&addOns=liftsToTop,certifiedByApartey&aparteyKeys=100&currency=ngn`;
            
            setTimeout(() => {
              router.push(checkoutUrl);
            }, 1200);
          } else {
            // Fallback to profile if no property ID
            setTimeout(() => {
              router.push("/homeowner-profile");
            }, 1200);
          }
        },
        onError: (error: unknown) => {
          let errorMessage: string | undefined = undefined;
          if (typeof error === 'object' && error !== null && 'response' in error) {
            const response = (error as { response?: { data?: { message?: string } } }).response;
            errorMessage = response?.data?.message;
          }
          if (errorMessage && errorMessage.includes("Validation Error:")) {
            const errors = errorMessage
              .replace("Validation Error:", "")
              .split(",")
              .map((err: string) => err.trim())
              .filter((err: string) => err.length > 0);

            errors.forEach((err: string) => {
              const formattedError = err
                .replace(/"/g, "")
                .replace(/\.$/, "")
                .trim();
              toast.error(formattedError, {
                duration: 4000,
                style: {
                  maxWidth: "500px",
                },
              });
            });
          } else {
            toast.error(errorMessage || "Failed to submit property listing");
          }
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            List Your Property
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Step {currentStep + 1} of {steps.length}
          </p>
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
                    ? "bg-orange-50 border-l-4 border-orange-500"
                    : isCompleted
                    ? "bg-green-50 hover:bg-green-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-orange-500"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 ${
                      isActive || isCompleted ? "text-white" : "text-gray-600"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-orange-900"
                      : isCompleted
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
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
                backgroundColor: "#C85212",
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formData={formData as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setFormData={setFormData as any}
        />
      </div>
    </div>
  );
};

export default PropertyListings;
