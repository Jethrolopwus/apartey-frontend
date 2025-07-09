"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  setField,
  setMultipleFields,
} from "../../store/propertyReviewFormSlice";
import { useWriteUnlistedReviewMutation } from "@/Hooks/use.writeUnlistedReviews.mutation";

// If PendingReviewData type exists, extend it. Otherwise, use type assertion for pendingReviewData.
type PendingReviewData = {
  stayDetails: Record<string, unknown>;
  costDetails: Record<string, unknown>;
  accessibility: Record<string, unknown>;
  ratingsAndReviews: Record<string, unknown>;
  submitAnonymously: boolean;
  location: {
    landlordLanguages?: string[];
    [key: string]: unknown;
  };
  contextLocation?: Record<string, unknown>;
};

// NOTE: This component must be wrapped in <ReviewFormProvider> at a higher level (e.g., in layout.tsx or _app.tsx)
// Do NOT wrap it here, or context will reset on every render.

// Allowed building facilities for backend
const ALLOWED_BUILDING_FACILITIES = [
  "Parking lot",
  "Elevator",
  "Security system",
];

function mapValidBuildingFacilities(facilities: string[]): string[] {
  return facilities.filter((facility) =>
    ALLOWED_BUILDING_FACILITIES.includes(facility)
  );
}

const WriteUnlistedPropertyReviews: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitReviewRef = useRef<{ handleFinalSubmit: () => Promise<unknown> }>(
    null
  );
  const router = useRouter();
  const restoredRef = useRef(false);
  const [restoring, setRestoring] = useState(true);

  // Custom hook to handle authentication and pending data
  const {
    isAuthenticated,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    clearPendingData,
  } = useAuthRedirect();

  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.propertyReviewForm);
  const { mutate } = useWriteUnlistedReviewMutation();

  // Restore pending data on mount (if redirected after login)
  useEffect(() => {
    if (restoredRef.current) return;
    const pending: PendingReviewData | null =
      pendingReviewData as PendingReviewData;
    if (pending && pending.location) {
      dispatch(
        setMultipleFields({
          ...pending.location,
          landlordLanguages: pending.location.landlordLanguages || [],
          ...pending.ratingsAndReviews,
          ...pending.stayDetails,
          ...pending.costDetails,
          ...pending.accessibility,
          isAnonymous: pending.submitAnonymously,
        })
      );
    }
    restoredRef.current = true;
    setRestoring(false);
  }, [pendingReviewData, dispatch]);

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
      // Build fullAddress as required by backend
      const fullAddress = [
        "",
        formData.street,
        formData.apartment,
        formData.district,
        formData.stateOrRegion,
      ]
        .filter(Boolean)
        .join(", ");
      // Build API payload matching backend requirements
      const payload = {
        location: {
          country: formData.country,
          countryCode: formData.countryCode || "NG",
          stateOrRegion: formData.stateOrRegion,
          street: formData.street,
          streetNumber: "",
          apartment: formData.apartment,
          district: formData.district,
          postalCode: formData.postalCode,
          fullAddress,
          city: "",
          streetAddress: formData.street,
        },
        stayDetails: {
          numberOfRooms: formData.numberOfRooms,
          numberOfOccupants: formData.numberOfOccupants,
          dateLeft: formData.moveOutDate || "",
          furnished: formData.furnished,
          appliancesFixtures: Array.isArray(formData.appliances)
            ? formData.appliances
            : [],
          buildingFacilities: mapValidBuildingFacilities(
            Array.isArray(formData.buildingFacilities)
              ? formData.buildingFacilities
              : []
          ),
          landlordLanguages: Array.isArray(formData.landlordLanguages)
            ? formData.landlordLanguages
            : [],
        },
        costDetails: {
          rentType: (formData.rentType === "actual"
            ? "Monthly"
            : formData.rentType === "range"
            ? "Yearly"
            : "Monthly") as "Monthly" | "Yearly",
          rent: Number(formData.yearlyRent),
          securityDepositRequired: formData.securityDepositRequired,
          agentBrokerFeeRequired: formData.agentFeeRequired,
          fixedUtilityCost: formData.fixedUtilityCost,
          julySummerUtilities: Number(formData.julySummerUtilities),
          januaryWinterUtilities: Number(formData.januaryWinterUtilities),
        },
        accessibility: {
          nearestGroceryStore: formData.nearestGroceryStore,
          nearestPark: formData.nearestPark,
          nearestRestaurant: formData.nearestRestaurant,
        },
        ratingsAndReviews: {
          valueForMoney: formData.valueForMoney,
          costOfRepairsCoverage: formData.costOfRepairs,
          overallExperience: formData.overallExperience,
          overallRating: formData.overallExperience,
          detailedReview: formData.detailedReview,
        },
        submitAnonymously: !!formData.isAnonymous,
      };
      // If not authenticated, save to localStorage and redirect
      if (!isAuthenticated) {
        const pendingData = {
          ...payload,
          submitAnonymously: !!formData.isAnonymous,
          stayDetails: {
            ...payload.stayDetails,
            appliancesFixtures: Array.isArray(formData.appliances)
              ? formData.appliances
              : [],
            buildingFacilities: mapValidBuildingFacilities(
              Array.isArray(formData.buildingFacilities)
                ? formData.buildingFacilities
                : []
            ),
            landlordLanguages: Array.isArray(formData.landlordLanguages)
              ? formData.landlordLanguages
              : [],
          },
        };
        localStorage.setItem("pendingReviewData", JSON.stringify(pendingData));
        handleAuthRedirect(pendingData as unknown as PendingReviewData);
        return;
      }
      // Submit to API
      mutate(payload, {
        onSuccess: (response) => {
          clearPendingData();
          localStorage.removeItem("pendingReviewData");
          toast.success(response?.message || "Review submitted successfully!");
          router.push("/reviewsPage");
        },
        onError: (err: { message?: string } | unknown) => {
          const error = err as { message?: string };
          if (error?.message?.includes("login")) {
            toast.error("Session expired. Please log in again.");
            handleAuthRedirect(payload as unknown as PendingReviewData);
          } else {
            toast.error(
              error?.message || "Failed to submit review. Please try again."
            );
          }
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
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
                  <h3 className="text-lg font-medium text-gray-900">
                    Stay Details
                  </h3>
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
                          dispatch(setField({ key: "numberOfRooms", value }));
                          console.log("Number of Rooms:", value);
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
                          dispatch(
                            setField({ key: "numberOfOccupants", value })
                          );
                          console.log("Number of Occupants:", value);
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
                      onRentTypeChange={(val) =>
                        dispatch(setField({ key: "rentType", value: val }))
                      }
                      onYearlyRentChange={(val) =>
                        dispatch(setField({ key: "yearlyRent", value: val }))
                      }
                    />
                    <SecurityDepositToggle
                      securityDepositRequired={formData.securityDepositRequired}
                      onSecurityDepositChange={(val) =>
                        dispatch(
                          setField({
                            key: "securityDepositRequired",
                            value: val,
                          })
                        )
                      }
                    />
                    <AgentBrokerFeesToggle
                      agentFeeRequired={formData.agentFeeRequired}
                      onAgentFeeChange={(val) =>
                        dispatch(
                          setField({ key: "agentFeeRequired", value: val })
                        )
                      }
                    />
                    <FixedUtilityCostsToggle
                      fixedUtilityCost={formData.fixedUtilityCost}
                      centralHeating={formData.centralHeating}
                      furnished={formData.furnished}
                      julySummerUtilities={formData.julySummerUtilities}
                      januaryWinterUtilities={formData.januaryWinterUtilities}
                      onFixedUtilityCostChange={(val) =>
                        dispatch(
                          setField({ key: "fixedUtilityCost", value: val })
                        )
                      }
                      onCentralHeatingChange={(val) =>
                        dispatch(
                          setField({ key: "centralHeating", value: val })
                        )
                      }
                      onFurnishedChange={(val) =>
                        dispatch(setField({ key: "furnished", value: val }))
                      }
                      onJulySummerUtilitiesChange={(val) =>
                        dispatch(
                          setField({ key: "julySummerUtilities", value: val })
                        )
                      }
                      onJanuaryWinterUtilitiesChange={(val) =>
                        dispatch(
                          setField({
                            key: "januaryWinterUtilities",
                            value: val,
                          })
                        )
                      }
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
                      onAppliancesChange={(val) =>
                        dispatch(setField({ key: "appliances", value: val }))
                      }
                      onBuildingFacilitiesChange={(val) =>
                        dispatch(
                          setField({ key: "buildingFacilities", value: val })
                        )
                      }
                      onCostOfRepairsCoverageChange={(val) =>
                        dispatch(
                          setField({ key: "costOfRepairsCoverage", value: val })
                        )
                      }
                      landlordLanguages={formData.landlordLanguages}
                      onLandlordLanguagesChange={(val) =>
                        dispatch(
                          setField({ key: "landlordLanguages", value: val })
                        )
                      }
                    />
                    <Accessibility
                      accessibility={{
                        nearestGroceryStore: formData.nearestGroceryStore,
                        nearestPark: formData.nearestPark,
                        nearestRestaurant: formData.nearestRestaurant,
                      }}
                      onInputChange={(field, value) =>
                        dispatch(setField({ key: field, value }))
                      }
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
              onAnonymousChange={(val) =>
                dispatch(setField({ key: "isAnonymous", value: val }))
              }
              onTermsChange={(val) =>
                dispatch(setField({ key: "agreeToTerms", value: val }))
              }
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
