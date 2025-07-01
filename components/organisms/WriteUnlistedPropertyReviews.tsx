"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { ReviewFormProvider, useReviewForm } from "@/app/context/RevievFormContext";
import { Home } from "lucide-react";
import AddressForm from "../molecules/AddressForm";
import MoveOutDatePicker from "../atoms/MoveOutDatePicker";
import RentInput from "../molecules/RentInput";
import SecurityDepositToggle from "../molecules/SecurityDepositToggle";
import AgentBrokerFeesToggle from "../molecules/AgentBrokers";
import FixedUtilityCostsToggle from "../molecules/FixUtilityCost";
import AmenitiesAccessibility from "../molecules/AmenitiesAccessibility";
import RatingComponent from "../molecules/ReviewsRating";
import SubmitReviewComponent from "./SubmitReviews";
import Accessibility from "../molecules/Accessibility";

// Define the form data structure
interface FormData {
  propertyType: string;
  propertyName: string;
  propertyDescription: string;
  rentType: "actual" | "range";
  yearlyRent: string;
  securityDepositRequired: boolean;
  agentFeeRequired: boolean;
  fixedUtilityCost: boolean;
  centralHeating: boolean;
  furnished: boolean;
  julySummerUtilities: string;
  januaryWinterUtilities: string;
  appliances: string[];
  buildingFacilities: string[];
  costOfRepairsCoverage: string[];
  isAnonymous: boolean;
  agreeToTerms: boolean;
  // Missing fields
  numberOfRooms: number;
  numberOfOccupants: number;
  nearestGroceryStore: string;
  nearestPark: string;
  nearestRestaurant: string;
  landlordLanguages: string[];
}

// If PendingReviewData type exists, extend it. Otherwise, use type assertion for pendingReviewData.
type PendingReviewData = {
  stayDetails: any;
  costDetails: any;
  accessibility: any;
  ratingsAndReviews: any;
  submitAnonymously: boolean;
  location: any;
  contextLocation?: any;
};

// NOTE: This component must be wrapped in <ReviewFormProvider> at a higher level (e.g., in layout.tsx or _app.tsx)
// Do NOT wrap it here, or context will reset on every render.

const WriteUnlistedPropertyReviews: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitReviewRef = useRef<{ handleFinalSubmit: () => Promise<unknown> }>(null);
  const router = useRouter();
  const restoredRef = useRef(false);
  const [restoring, setRestoring] = useState(true);

  // Auth and pending data logic
  const {
    isAuthenticated,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    clearPendingData,
  } = useAuthRedirect();

  const { location: addressLocation, setLocation } = useReviewForm();

  // Parent-managed form state for prop-based components
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to restore from localStorage on first render
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pendingReviewData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // If the structure is correct, use it
          if (parsed && parsed.location) {
            return {
              ...parsed.location,
              landlordLanguages: parsed.location.landlordLanguages || [],
            };
          }
        } catch {}
      }
    }
    // Default initial state
    return {
      propertyType: "",
      propertyName: "",
      propertyDescription: "",
      rentType: "actual",
      yearlyRent: "",
      securityDepositRequired: false,
      agentFeeRequired: false,
      fixedUtilityCost: false,
      centralHeating: false,
      furnished: false,
      julySummerUtilities: "",
      januaryWinterUtilities: "",
      appliances: [],
      buildingFacilities: [],
      costOfRepairsCoverage: [],
      isAnonymous: false,
      agreeToTerms: false,
      numberOfRooms: 1,
      numberOfOccupants: 1,
      nearestGroceryStore: "",
      nearestPark: "",
      nearestRestaurant: "",
      landlordLanguages: [],
    };
  });

  // Restore pending data on mount (if redirected after login)
  useEffect(() => {
    if (restoredRef.current) return;
    const pending: PendingReviewData | null = pendingReviewData as PendingReviewData;
    if (pending) {
      // Restore formData
      if (pending.location) {
        setFormData({
          ...pending.location,
          landlordLanguages: pending.location.landlordLanguages || [],
        });
      }
      // Merge all fields for context restore
      const mergedContext = {
        ...(pending.contextLocation || {}),
        ...(pending.location || {}),
        ...(pending.ratingsAndReviews || {}),
      };
      if (Object.keys(mergedContext).length > 0) {
        setLocation(mergedContext);
      }
    }
    restoredRef.current = true;
    setRestoring(false);
  }, [pendingReviewData, setLocation]);

  // Persist form data and context data to localStorage on every change
  useEffect(() => {
    // Merge formData and addressLocation for the most up-to-date location
    const { propertyType, propertyName, propertyDescription, ...locationRest } = {
      ...formData,
      ...addressLocation,
    };
    console.log("locationRest", locationRest);
    console.log("formData", formData);
    console.log("addressLocation", addressLocation);
    // Merge all context fields for ratingsAndReviews
    const ratingsAndReviews = {
      valueForMoney: addressLocation?.valueForMoney ?? 0,
      costOfRepairs: addressLocation?.costOfRepairs ?? "",
      overallExperience: addressLocation?.overallExperience ?? 0,
      detailedReview: addressLocation?.detailedReview ?? "",
    };
    // Always include all context fields in location
    const pendingData = {
      stayDetails: {
        numberOfRooms: formData.numberOfRooms,
        numberOfOccupants: formData.numberOfOccupants,
      },
      costDetails: {
        rentType: formData.rentType,
        rent: formData.yearlyRent,
        securityDepositRequired: formData.securityDepositRequired,
        agentBrokerFeeRequired: formData.agentFeeRequired,
        fixedUtilityCost: formData.fixedUtilityCost,
        centralHeating: formData.centralHeating,
        furnished: formData.furnished,
        julySummerUtilities: formData.julySummerUtilities,
        januaryWinterUtilities: formData.januaryWinterUtilities,
      },
      accessibility: {
        nearestGroceryStore: formData.nearestGroceryStore,
        nearestPark: formData.nearestPark,
        nearestRestaurant: formData.nearestRestaurant,
      },
      ratingsAndReviews: ratingsAndReviews,
      submitAnonymously: formData.isAnonymous,
      location: { ...locationRest, ...ratingsAndReviews }, // include all context fields
      contextLocation: { ...addressLocation, ...ratingsAndReviews },
    };
    localStorage.setItem('pendingReviewData', JSON.stringify(pendingData));
  }, [formData, addressLocation]);

  // Navigation logic
  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setCurrentSubStep(1);
    } else if (currentStep === 2) {
      if (currentSubStep < 3) {
        setCurrentSubStep(currentSubStep + 1);
      } else {
        setCurrentStep(3);
      }
    }
  };
  const prevStep = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
      setCurrentSubStep(3);
    } else if (currentStep === 2) {
      if (currentSubStep > 1) {
        setCurrentSubStep(currentSubStep - 1);
      } else {
        setCurrentStep(1);
      }
    }
  };

  // Helper functions for step titles and messages
  const getCurrentStepTitle = () => {
    if (currentStep === 1) return "Property Details";
    if (currentStep === 2) return "Experience and Ratings";
    if (currentStep === 3) return "Submit Review";
    return "";
  };

  const getCurrentSubStepTitle = () => {
    if (currentStep === 2) {
      if (currentSubStep === 1) return "Cost Details";
      if (currentSubStep === 2) return "Amenities & Accessibility";
      if (currentSubStep === 3) return "Ratings & Reviews";
    }
    return "";
  };

  const getCurrentStepMessage = () => {
    if (currentStep === 1)
      return "Let's start your property review journey! Tell us about your place.";
    if (currentStep === 2 && currentSubStep === 1)
      return "You're doing great! Now let's dive into your experience.";
    if (currentStep === 2 && currentSubStep === 2)
      return "Tell us about the property&apos;s amenities and location";
    if (currentStep === 2 && currentSubStep === 3)
      return "Rate your experience with this property";
    if (currentStep === 3)
      return "Almost there! Just a few more details and you're done";
    return "";
  };

  // Final submit logic
  const handleFinalSubmitWithValidation = async () => {
    setIsSubmitting(true);
    try {
      // Build costDetails from formData
      const costDetails = {
        rentType: formData.rentType,
        rent: formData.yearlyRent,
        securityDepositRequired: formData.securityDepositRequired,
        agentBrokerFeeRequired: formData.agentFeeRequired,
        fixedUtilityCost: formData.fixedUtilityCost,
        centralHeating: formData.centralHeating,
        furnished: formData.furnished,
        julySummerUtilities: formData.julySummerUtilities,
        januaryWinterUtilities: formData.januaryWinterUtilities,
      };
      // Build ratingsAndReviews from context (addressLocation) and formData
      const ratingsAndReviews = {
        valueForMoney: addressLocation?.valueForMoney ?? 0,
        costOfRepairs: addressLocation?.costOfRepairs ?? "",
        overallExperience: addressLocation?.overallExperience ?? 0,
        detailedReview: addressLocation?.detailedReview ?? "",
      };
      // Build location from addressLocation, removing propertyType, propertyName, propertyDescription
      const { propertyType, propertyName, propertyDescription, ...locationRest } = {
        ...formData,
        ...addressLocation,
      };
      // Build pendingData
      const pendingData = {
        stayDetails: {
          numberOfRooms: formData.numberOfRooms,
          numberOfOccupants: formData.numberOfOccupants,
        },
        costDetails,
        accessibility: {
          nearestGroceryStore: formData.nearestGroceryStore,
          nearestPark: formData.nearestPark,
          nearestRestaurant: formData.nearestRestaurant,
        },
        ratingsAndReviews,
        submitAnonymously: formData.isAnonymous,
        location: locationRest,
      };
      // If not authenticated, save to localStorage and redirect
      if (!isAuthenticated) {
        localStorage.setItem('pendingReviewData', JSON.stringify(pendingData));
        handleAuthRedirect(pendingData);
        return;
      }
      // Simulate mutation (replace with real API call in production)
      setTimeout(() => {
        clearPendingData();
        localStorage.removeItem('pendingReviewData');
        toast.success("Review submitted successfully!");
        router.push("/reviewsPage");
      }, 1000);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (restoring) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {hasPendingData && isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 mt-4">
          <p className="text-green-700 text-sm flex items-center">
            <span className="mr-2">✓</span>
            Welcome back! Your review data has been restored.
          </p>
        </div>
      )}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">
            Write a Property Review
          </h1>
          <p className="text-gray-600">
            Share your honest opinion about a property to help others make
            informed decisions.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-orange-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 1 ? "text-orange-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > 1 ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium">Property Details</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 2 ? "text-orange-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > 2 ? "✓" : "2"}
              </div>
              <span className="text-sm font-medium">
                Experience and Ratings
              </span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 3 ? "text-orange-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? "bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Submit Review</span>
            </div>
          </div>
        </div>

        {/* Progress Message */}
        {currentStep === 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700 text-sm flex items-center">
              <span className="mr-2">👋</span>
              {getCurrentStepMessage()}
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {getCurrentStepTitle()}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  {getCurrentStepMessage()}
                </p>
              </div>

              <div className="space-y-6">
                <AddressForm />
               

                {/* Stay Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Stay Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Rooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.numberOfRooms}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setFormData(f => ({ ...f, numberOfRooms: value }));
                          console.log('Number of Rooms:', value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Occupants
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.numberOfOccupants}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setFormData(f => ({ ...f, numberOfOccupants: value }));
                          console.log('Number of Occupants:', value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <MoveOutDatePicker />
              </div>
            </div>
          )}

          {/* Step 2: Experience and Ratings */}
          {currentStep === 2 && (
            <div>
              {/* Step 2A: Cost Details */}
              {currentSubStep === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {getCurrentSubStepTitle()}
                    </h2>
                    <p className="text-gray-600">
                      Tell us about the rental costs
                    </p>
                  </div>

                  <div className="space-y-6">
                    <RentInput
                      rentType={formData.rentType}
                      yearlyRent={formData.yearlyRent}
                      onRentTypeChange={val => setFormData(f => ({ ...f, rentType: val }))}
                      onYearlyRentChange={val => setFormData(f => ({ ...f, yearlyRent: val }))}
                    />
                    <SecurityDepositToggle
                      securityDepositRequired={formData.securityDepositRequired}
                      onSecurityDepositChange={val => setFormData(f => ({ ...f, securityDepositRequired: val }))}
                    />
                    <AgentBrokerFeesToggle
                      agentFeeRequired={formData.agentFeeRequired}
                      onAgentFeeChange={val => setFormData(f => ({ ...f, agentFeeRequired: val }))}
                    />
                    <FixedUtilityCostsToggle
                      fixedUtilityCost={formData.fixedUtilityCost}
                      centralHeating={formData.centralHeating}
                      furnished={formData.furnished}
                      julySummerUtilities={formData.julySummerUtilities}
                      januaryWinterUtilities={formData.januaryWinterUtilities}
                      onFixedUtilityCostChange={val => setFormData(f => ({ ...f, fixedUtilityCost: val }))}
                      onCentralHeatingChange={val => setFormData(f => ({ ...f, centralHeating: val }))}
                      onFurnishedChange={val => setFormData(f => ({ ...f, furnished: val }))}
                      onJulySummerUtilitiesChange={val => setFormData(f => ({ ...f, julySummerUtilities: val }))}
                      onJanuaryWinterUtilitiesChange={val => setFormData(f => ({ ...f, januaryWinterUtilities: val }))}
                    />
                  </div>
                </div>
              )}
              {/* Step 2B: Amenities & Accessibility */}
              {currentSubStep === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {getCurrentSubStepTitle()}
                    </h2>
                    <p className="text-gray-600">
                      Tell us about the property&apos;s amenities and location
                    </p>
                  </div>
                  <div className="space-y-6">
                    <AmenitiesAccessibility
                      appliances={formData.appliances}
                      buildingFacilities={formData.buildingFacilities}
                      costOfRepairsCoverage={formData.costOfRepairsCoverage}
                      onAppliancesChange={val => setFormData(f => ({ ...f, appliances: val }))}
                      onBuildingFacilitiesChange={val => setFormData(f => ({ ...f, buildingFacilities: val }))}
                      onCostOfRepairsCoverageChange={val => setFormData(f => ({ ...f, costOfRepairsCoverage: val }))}
                      landlordLanguages={formData.landlordLanguages}
                      onLandlordLanguagesChange={val => setFormData(f => ({ ...f, landlordLanguages: val }))}
                    />
                    <Accessibility
                      accessibility={{
                        nearestGroceryStore: formData.nearestGroceryStore,
                        nearestPark: formData.nearestPark,
                        nearestRestaurant: formData.nearestRestaurant,
                      }}
                      onInputChange={(field, value) => setFormData(f => ({ ...f, [field]: value }))}
                    />
                  </div>
                </div>
              )}
              {/* Step 2C: Ratings & Reviews */}
              {currentSubStep === 3 && <RatingComponent />}
            </div>
          )}

          {/* Step 3: Submit Review */}
          {currentStep === 3 && (
            <SubmitReviewComponent
              isAnonymous={formData.isAnonymous}
              agreeToTerms={formData.agreeToTerms}
              onAnonymousChange={val => setFormData(f => ({ ...f, isAnonymous: val }))}
              onTermsChange={val => setFormData(f => ({ ...f, agreeToTerms: val }))}
              ref={submitReviewRef}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="bg-[#C85212] text-white px-6 py-2 rounded-md hover:bg-orange-800 transition duration-200"
              >
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleFinalSubmitWithValidation}
                disabled={isSubmitting}
                className="bg-[#C85212] text-white px-6 py-2 rounded-md hover:bg-orange-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteUnlistedPropertyReviews;
