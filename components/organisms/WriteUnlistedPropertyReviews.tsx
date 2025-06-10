"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Calendar, Home, Star, MessageSquare } from "lucide-react";
import RatingComponent from "@/components/molecules/ReviewsRating";
import SubmitReviewComponent from "@/components/organisms/SubmitReviews";
import LocationForm from "../molecules/LocationForm";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { useWriteUnlistedReviewMutation } from "@/Hooks/use.writeUnlistedReviews.mutation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import AddressInput from "@/components/molecules/AddressInput";
import PropertyDetailsSection from "@/components/molecules/PropertyDetailsSection";
import MoveOutDatePicker from "@/components/atoms/MoveOutDatePicker";
import RentInput, { RentData } from "@/components/molecules/RentInput";
import SecurityDepositToggle from "@/components/molecules/SecurityDepositToggle";
import ToggleCard from "@/components/molecules/ToggleCard";
import AgentBrokerFeesToggle, {
  AgentBrokerFeesData,
} from "@/components/molecules/AgentBrokers";
import AmenitiesAccessibility from "../molecules/AmenitiesAccessibility";

export const WriteUnlistedPropertyReview = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const submitReviewRef = useRef(null);
  const [currentSubStep, setCurrentSubStep] = useState(1);

  // Mutations and Auth
  const writeReviewMutation = useWriteUnlistedReviewMutation();
  const {
    isAuthenticated,
    isLoading: authLoading,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    handlePostLoginRedirect,
    clearPendingData,
    submitPendingReview,
    checkAuthentication,
  } = useAuthRedirect(writeReviewMutation);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Step 1 - Property Details
    
    country: "",
    address: "",
    apartmentNumber: "",
    numberOfRooms: "",
    numberOfOccupants: "",
    moveOutDate: "May 2025",
    additionalComments: "",
    propertyCondition: 0,
    landlordResponsiveness: 0,
    reviewText: "",

    // Accessibility Features
    accessibilityFeatures: {
      wheelchairAccessible: false,
      elevator: false,
      brailleSigns: false,
      audioAssistance: false,
    },

    // Step 2A - Cost Details
    nearestPublicTransport: "",
    rentType: "actual" as "actual" | "range",
    yearlyRent: "",

    securityDepositRequired: false,
    agentFeeRequired: false,
    fixedUtilityCost: false,
    centralHeating: false,
    furnished: false,
    julyUtilities: "",
    januaryUtilities: "",

    // Step 2B - Amenities & Accessibility
    appliances: {
      oven: false,
      washingMachine: false,
      refrigerator: false,
      garbageDisposal: false,
      airConditioner: false,
      dryer: false,
      microwave: false,
      others: false,
    },
    landlordLanguages: {
      english: false,
      french: false,
      estonian: false,
      italian: false,
      spanish: false,
      german: false,
      others: false,
      customLanguage: false,
      otherText: "",
      customLanguageText: "",
    },
    buildingFacilities: {
      parkingLot: false as boolean,
      streetParking: false as boolean,
      gymFitness: false as boolean,
      elevator: false as boolean,
      storageSpace: false as boolean,
      childrenPlayArea: false as boolean,
      roofTerrace: false as boolean,
      securitySystem: false as boolean,
      dedicatedParking: false as boolean,
      swimmingPool: false as boolean,
      gardenCourtyard: false as boolean,
      others: false as boolean,
      otherText: "" as string,
    },
    nearestGroceryStore: "",
    nearestPark: "",

    // Step 2C - Ratings & Reviews
    valueForMoney: 0,
    costOfRepairs: "",
    overallExperience: 0,
    detailedReview: "",

    // Step 3 - Submit Review
    submitAnonymously: false,
    agreeToTerms: false,
  });

  // Handle pending data restoration when user returns after login
  useEffect(() => {
    if (isAuthenticated && hasPendingData && pendingReviewData) {
      console.log("Restoring form data after login:", pendingReviewData);

      // Restore the form data from localStorage
      setFormData((prevData) => ({
        ...prevData,
        ...pendingReviewData.stayDetails,
        ...pendingReviewData.costDetails,
        ...pendingReviewData.accessibility,
        ...pendingReviewData.ratingsAndReviews,
        submitAnonymously: pendingReviewData.submitAnonymously,
      }));

      // Navigate to the submit step
      setCurrentStep(3);
      setCanSubmit(true);

      // Optionally show a success message
      console.log("Form data restored successfully");
    }
  }, [isAuthenticated, hasPendingData, pendingReviewData]);

  // Handle authenticated user with pending data on mount
  useEffect(() => {
    if (isAuthenticated && hasPendingData && pendingReviewData) {
      handlePostLoginRedirect();
    }
  }, [isAuthenticated, hasPendingData]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  type FormDataCategory = keyof typeof formData;

  const updateNestedFormData = (
    category: FormDataCategory,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...(typeof prev[category] === "object" ? prev[category] : {}),
        [field]: value,
      },
    }));
  };

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

  // Transform form data to match API format
  const transformFormDataToAPI = (data: typeof formData) => {
    // Get selected appliances
    const selectedAppliances = Object.entries(data.appliances)
      .filter(([key, value]) => value && key !== "others")
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    // Get selected building facilities
    const selectedFacilities = Object.entries(data.buildingFacilities)
      .filter(([key, value]) => value && key !== "others")
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    // Get selected landlord languages
    const selectedLanguages = Object.entries(data.landlordLanguages)
      .filter(
        ([key, value]) =>
          value &&
          key !== "others" &&
          key !== "customLanguage" &&
          key !== "otherText"
      )
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    return {
      location: {
        country: data.country,
        city: "",
        district: "",
        zipCode: "",
        streetAddress: data.address,
      },
      stayDetails: {
        numberOfRooms: parseInt(data.numberOfRooms) || 0,
        numberOfOccupants: parseInt(data.numberOfOccupants) || 0,
        dateLeft: new Date(data.moveOutDate).toISOString(),
        furnished: data.furnished,
        appliancesFixtures: selectedAppliances,
        buildingFacilities: selectedFacilities,
        landlordLanguages: selectedLanguages,
      },
      costDetails: {
        rent: parseFloat(data.yearlyRent.replace(/[^\d.]/g, "")) || 0,
        rentType: data.rentType === "actual" ? "Yearly" : "Range",
        securityDepositRequired: data.securityDepositRequired,
        agentBrokerFeeRequired: data.agentFeeRequired,
        fixedUtilityCost: data.fixedUtilityCost,
        julySummerUtilities:
          parseFloat(data.julyUtilities.replace(/[^\d.]/g, "")) || 0,
        januaryWinterUtilities:
          parseFloat(data.januaryUtilities.replace(/[^\d.]/g, "")) || 0,
      },
      accessibility: {
        nearestGroceryStore: data.nearestGroceryStore || "Not specified",
        nearestPark: data.nearestPark || "Not specified",
        nearestRestaurant: data.nearestPublicTransport || "Not specified",
      },
      ratingsAndReviews: {
        valueForMoney: data.valueForMoney,
        costOfRepairsCoverage: data.costOfRepairs || "Not specified",
        overallExperience: data.overallExperience,
        overallRating: (data.valueForMoney + data.overallExperience) / 2,
        detailedReview:
          data.detailedReview ||
          data.additionalComments ||
          "No detailed review provided",
      },
      submitAnonymously: data.submitAnonymously,
    };
  };

  const handleFinalSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please agree to the terms and conditions to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to signin...");

        // Create the pending review data structure
        const pendingReviewData = {
          stayDetails: apiData.stayDetails,
          costDetails: apiData.costDetails,
          accessibility: apiData.accessibility,
          ratingsAndReviews: apiData.ratingsAndReviews,
          submitAnonymously: apiData.submitAnonymously,
        };

        // Store data and redirect to signin
        handleAuthRedirect(pendingReviewData);
        return;
      }

      // User is authenticated, submit the review directly
      console.log("Submitting review for authenticated user...", apiData);

    //  writeReviewMutation.mutate(apiData);

      console.log("Review submitted successfully!");

      // Clear any pending data
      clearPendingData();

      // Show success message or redirect
      toast.success("Review submitted successfully!");

      // Optionally redirect to a success page or reset form
      router.push("/signin");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("There was an error submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const rentData: RentData = {
    rentType: formData.rentType,
    yearlyRent: formData.yearlyRent,
  };

  const securityDepositData = {
    securityDepositRequired: formData.securityDepositRequired,
  };
  const agentBrokerFeesData: AgentBrokerFeesData = {
    agentFeeRequired: formData.agentFeeRequired,
  };
 
  

  const handleTermsChange = (
    agreed: boolean | ((prevState: boolean) => boolean)
  ) => {
    const newValue = typeof agreed === "function" ? agreed(canSubmit) : agreed;
    setCanSubmit(newValue);
    updateFormData("agreeToTerms", newValue);
  };

  useEffect(() => {
    const handlePendingSubmission = async () => {
      if (isAuthenticated && hasPendingData && pendingReviewData && canSubmit) {
        try {
          console.log("Auto-submitting pending review after login...");
          await submitPendingReview(pendingReviewData);
          alert("Review submitted successfully!");

          // Reset form or redirect as needed
          // router.push('/reviews/success');
        } catch (error) {
          console.error("Error auto-submitting pending review:", error);
          alert("There was an error submitting your review. Please try again.");
        }
      }
    };

    // Add a small delay to ensure all state updates are complete
    const timeoutId = setTimeout(handlePendingSubmission, 100);
    return () => clearTimeout(timeoutId);
  }, [
    isAuthenticated,
    hasPendingData,
    pendingReviewData,
    canSubmit,
    submitPendingReview,
  ]);

  const StarRating = ({
    rating,
    onRatingChange,
    label,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= rating
                ? "fill-orange-400 text-orange-400"
                : "text-gray-300"
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

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
      return "Tell us about the property's amenities and location";
    if (currentStep === 2 && currentSubStep === 3)
      return "Rate your experience with this property";
    if (currentStep === 3)
      return "Almost there! Just a few more details and you're done";
    return "";
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    toast.success("Review submitted successfully!");
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show restoration message if data was restored */}
      {hasPendingData && isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 mt-4">
          <p className="text-green-700 text-sm flex items-center">
            <span className="mr-2">✓</span>
            Welcome back! Your review data has been restored.
          </p>
        </div>
      )}

      {/* Main Content */}
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

        {/* Form Content */}
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
                {/* Location */}
                <LocationForm />
                {/* Address  */}
                <AddressInput
                  value={formData.address}
                  onChange={(val) => updateFormData("address", val)}
                />

                {/* PropertyDetailsSections */}
                <PropertyDetailsSection
                  apartmentNumber={formData.apartmentNumber}
                  numberOfRooms={formData.numberOfRooms}
                  numberOfOccupants={formData.numberOfOccupants}
                  onChange={(field, value) => updateFormData(field, value)}
                />

                {/* Move data */}
                <MoveOutDatePicker
                  value={formData.moveOutDate}
                  onChange={(val) => updateFormData("moveOutDate", val)}
                />
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
                    {/* Rent */}
                    <RentInput
                      data={rentData}
                      onChange={updateFormData}
                      className="mb-6"
                    />
                    {/* Security Deposit */}
                    <SecurityDepositToggle
                      data={securityDepositData}
                      onChange={updateFormData}
                      className="mb-6"
                    />

                    {/* Agent/Broker Fees */}
                    <AgentBrokerFeesToggle
                      data={agentBrokerFeesData}
                      onChange={updateFormData}
                      className="mb-6"
                    />
                    {/* Agent/Broker Fees */}
                    <ToggleCard
                      title="Security Deposit"
                      description="Information about your security deposit"
                      questionText="Was a security deposit required?"
                      fieldName="securityDepositRequired"
                      checked={formData.securityDepositRequired}
                      onChange={updateFormData}
                      className="mb-6"
                    />
                  </div>
                </div>
              )}
              {/* Step 2B: Amenities & Accessibility */}
              {currentSubStep === 2 && (
                <AmenitiesAccessibility
                  formData={formData}
                  updateFormData={updateFormData}
                  updateNestedFormData={updateNestedFormData}
                  getCurrentSubStepTitle={getCurrentSubStepTitle}
                />
              )}
              {/* Step 2C: Ratings & Reviews */}
              {currentSubStep === 3 && (
                <RatingComponent
                  label="Overall Experience"
                  onSubmit={handleSubmit}
                  rating={formData.overallExperience}
                  onRatingChange={(value: any) =>
                    updateFormData("overallExperience", value)
                  }
                />
              )}
            </div>
          )}

          {/* Step 3: Submit Review */}
          {currentStep === 3 &&
           <SubmitReviewComponent />}

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
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition duration-200"
              >
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <Link href="/signin">
                <button
                  onClick={handleFinalSubmit}  disabled={!canSubmit || isSubmitting}
                  className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition duration-200"
                >
                  Submit Review
                </button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
