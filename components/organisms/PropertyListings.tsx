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
import { PropertyListingPayload } from "../../types/propertyListing";
import type { LocationPayload } from "../../types/generated";

import PropertyTypeStep from "./PropertyTypeStep";
import LocationStep from "./LocationStep";
import PhotosVideosStep from "./PhotosVideosStep";
import PropertyDetailsStep from "./PropertyDetailsStep";
import PriceStep from "./PriceStep";
import ContactInfoStep from "./ContactInfoStep";
import AdPromotionStep from "./AdPromotionStep";
import toast from "react-hot-toast";

// Type-safe property existence check for propertyDetails
function hasPropertyDetails(obj: unknown): obj is { propertyDetails: unknown } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'propertyDetails' in obj
  );
}

// Main Wizard Component
const PropertyListings = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    PropertyListingPayload | Partial<PropertyListingPayload>
  >({});
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
    // Updated enums to match backend expectations
    const PropertyTypeEnum = [
      "House",
      "Apartment",
      "Room",
      "Commercial",
      "Garage",
    ];

    const CategoriesEnum = ["Sale", "Rent", "Swap"];

    // Backend: AmenitiesEnum
    const AmenitiesEnum = [
      "TV set",
      "Washing machine",
      "Kitchen",
      "Air conditioning",
      "Separate workplace",
      "Refrigerator",
      "Drying machine",
      "Closet",
      "Patio",
      "Fireplace",
      "Shower cabin",
      "Whirlpool",
      "Security cameras",
      "Balcony",
      "Bar",
    ];

    // Backend: InfrastructureEnum
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
      "Restaurant / cafe",
      "Park / green area",
    ];

    const   PropertyConditionEnum = [
      "Good Condition",
      "New Building",
      "Renovated",
    ];

    // Backend: OfferTypeEnum
    const ValidOfferTypes = [
      "Private person",
      " Real estate agent",
    ];

    // Validate enums
    if (!PropertyTypeEnum.includes(formData.propertyType || "")) {
      toast.error("Invalid property type.");
      return;
    }

    if (!CategoriesEnum.includes(formData.category || "")) {
      toast.error("Invalid category.");
      return;
    }

    // Validate offer type
    if (!ValidOfferTypes.includes(formData.typeOfOffer || "")) {
      toast.error(
        `Invalid offer type. Valid options are: Private person, Real estate agent`
      );
      return;
    }

    const invalidAmenities = (formData.amenities || []).filter(
      (a: string) => !AmenitiesEnum.includes(a)
    );
    if (invalidAmenities.length > 0) {
      toast.error(`Invalid amenities: ${invalidAmenities.join(", ")}`);
      return;
    }

    const invalidInfrastructure = (formData.infrastructure || []).filter(
      (i: string) => !InfrastructureEnum.includes(i)
    );
    if (invalidInfrastructure.length > 0) {
      toast.error(
        `Invalid infrastructure: ${invalidInfrastructure.join(", ")}`
      );
      return;
    }

    if (!PropertyConditionEnum.includes(formData.condition || "")) {
      toast.error("Invalid property condition.");
      return;
    }

    // Validate required fields for backend
    let propertyDetails: unknown = {};
    const formDataObj = formData as unknown;
    if (
      hasPropertyDetails(formDataObj) &&
      typeof (formDataObj as { propertyDetails?: unknown }).propertyDetails === "object" &&
      (formDataObj as { propertyDetails?: unknown }).propertyDetails !== null
    ) {
      propertyDetails = (formDataObj as { propertyDetails: unknown }).propertyDetails;
    }
    const description = (propertyDetails as Record<string, unknown>).description as string;
    const coverPhoto = ((formData as Record<string, unknown>).media && typeof (formData as Record<string, unknown>).media === 'object')
      ? ((formData as Record<string, unknown>).media as { coverPhoto?: File }).coverPhoto
      : undefined;
    const location = (formData as PropertyListingPayload | Partial<PropertyListingPayload>).location || {};
    const street = (location as LocationPayload)?.street || (typeof formData === 'object' && formData && Object.prototype.hasOwnProperty.call(formData, 'streetAddress') ? (formData as { streetAddress?: string }).streetAddress : undefined);
    const stateOrRegion = (location as LocationPayload)?.stateOrRegion || (typeof formData === 'object' && formData && Object.prototype.hasOwnProperty.call(formData, 'state') ? (formData as { state?: string }).state : undefined);

    if (!description || !description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!(coverPhoto instanceof File && coverPhoto.type.startsWith("image/"))) {
      toast.error("Cover photo is required.");
      return;
    }
    if (!street) {
      toast.error("Street address is required.");
      return;
    }
    if (!stateOrRegion) {
      toast.error("State is required.");
      return;
    }

    // Build FormData
    const form = new FormData();

    // Contact Info (dot notation)
    if (formData.firstName) form.append("contactInfo.firstName", formData.firstName);
    if (formData.lastName) form.append("contactInfo.lastName", formData.lastName);
    if (formData.email) form.append("contactInfo.email", formData.email);
    if (formData.phoneNumber) form.append("contactInfo.phoneNumber", formData.phoneNumber);
    if (formData.openForTour !== undefined) form.append("contactInfo.openForTour", String(formData.openForTour));
    if (formData.typeOfOffer) form.append("contactInfo.typeOfOffer", formData.typeOfOffer);

    // Location (dot notation, only once per field)
    const locationFields: Array<[string, string]> = [
      ["country", "location.country"],
      ["countryCode", "location.countryCode"],
      ["stateOrRegion", "location.stateOrRegion"],
      ["district", "location.district"],
      ["street", "location.street"],
      ["streetNumber", "location.streetNumber"],
      ["apartment", "location.apartment"],
      ["postalCode", "location.postalCode"],
      ["fullAddress", "location.fullAddress"],
    ];
    locationFields.forEach(([key, formKey]) => {
      let value: string | undefined;
      if (key === "street") {
        value = (location as LocationPayload)?.street || (typeof formData === 'object' && formData && Object.prototype.hasOwnProperty.call(formData, 'streetAddress') ? (formData as { streetAddress?: string }).streetAddress : undefined);
      } else if (key === "stateOrRegion") {
        value = (location as LocationPayload)?.stateOrRegion || (typeof formData === 'object' && formData && Object.prototype.hasOwnProperty.call(formData, 'state') ? (formData as { state?: string }).state : undefined);
      } else {
        value = (location as LocationPayload)?.[key as keyof LocationPayload] ?? (typeof formData === 'object' && formData && Object.prototype.hasOwnProperty.call(formData, key) ? (formData as Record<string, string>)[key] : undefined);
      }
      if (value) form.append(formKey, value);
    });
    // Coordinates (optional)
    const coordinates = (location as LocationPayload & { coordinates?: { latitude?: number; longitude?: number } }).coordinates;
    if (coordinates) {
      if (coordinates.latitude)
        form.append("location.coordinates.latitude", String(coordinates.latitude));
      if (coordinates.longitude)
        form.append("location.coordinates.longitude", String(coordinates.longitude));
    }

    // Cover photo (as file, not as media.coverPhoto)
    if (coverPhoto instanceof File && coverPhoto.type.startsWith("image/")) {
      form.append("coverPhoto", coverPhoto);
      
    }
    // console.log("coverPhoto", coverPhoto);
    
    // Do NOT append any media fields or objects

    // Property Details (dot notation)
    if (propertyDetails) {
      const propertyDetailsFields = [
        "price", "currency", "negotiatedPrice", "totalFloors", "floor", "totalAreaSqM", "livingAreaSqM", "kitchenAreaSqM", "bedrooms", "bathrooms", "parkingSpots", "description", "condition", "petPolicy"
      ];
      propertyDetailsFields.forEach((key) => {
        if ((propertyDetails as Record<string, unknown>)[key] !== undefined && (propertyDetails as Record<string, unknown>)[key] !== null) {
          form.append(`propertyDetails.${key}`, String((propertyDetails as Record<string, unknown>)[key]));
        }
      });
      // Array fields (amenities, infrastructure)
      if (Array.isArray((propertyDetails as Record<string, unknown>).amenities)) {
        ((propertyDetails as Record<string, unknown>).amenities as string[]).forEach((a: string) => form.append("propertyDetails.amenities", a));
      }
      if (Array.isArray((propertyDetails as Record<string, unknown>).infrastructure)) {
        ((propertyDetails as Record<string, unknown>).infrastructure as string[]).forEach((i: string) => form.append("propertyDetails.infrastructure", i));
      }
    }

    // All other fields (flat, not nested)
    const skip = new Set([
      "firstName", "lastName", "email", "phoneNumber", "openForTour", "typeOfOffer",
      "location", "country", "city", "district", "zipCode", "streetAddress", "apartment", "state", "searchAddress",
      "media", "description", "propertyDetails"
    ]);
    Object.entries(formData).forEach(([key, value]) => {
      if (skip.has(key)) return;
      if (value === undefined || value === null) return;
      if (typeof value === "object") return; // already handled nested
      form.append(key, String(value));
    });

    // Ad Promotion (if present)
    if (formData.adPromotion) {
      if ((formData.adPromotion as Record<string, unknown>).selectedTier)
        form.append("adPromotion.selectedTier", (formData.adPromotion as Record<string, unknown>).selectedTier as string);
      if ((formData.adPromotion as Record<string, unknown>).selectedServices && Array.isArray((formData.adPromotion as Record<string, unknown>).selectedServices)) {
        ((formData.adPromotion as Record<string, unknown>).selectedServices as string[]).forEach((service: string) => {
          form.append("adPromotion.selectedServices", service);
        });
      }
      if ((formData.adPromotion as Record<string, unknown>).totalPrice !== undefined)
        form.append("adPromotion.totalPrice", String((formData.adPromotion as Record<string, unknown>).totalPrice));
    }

    // DEBUG: Log all FormData entries before submission
    // for (let pair of form.entries()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }
    console.log(coverPhoto);
    

    mutate(form, {
      onSuccess: () => {
        toast.success("Property listing submitted successfully!");
        setTimeout(() => {
          router.push("/listings");
        }, 1200);
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
          formData={formData as PropertyListingPayload}
          setFormData={setFormData}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </div>
  );
};

export default PropertyListings;
