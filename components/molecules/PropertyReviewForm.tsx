"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useWriteReviewMutation } from "@/Hooks/use.writeReviews.mutation";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import StayDetailsInputs from "@/components/molecules/StayDetailsForm";
import DateLeftInput from "@/components/molecules/DateInput";
import FurnishedCheckbox from "@/components/molecules/FurnishedCheckBox";
import CheckboxGroups from "@/components/molecules/CheckBoxGroup";
import { toast } from "react-hot-toast";
import { ReviewFormData, StayDetails } from "@/types/generated";
import CostDetails from "@/components/molecules/CostDetails";
import Accessibility from "@/components/molecules/Accessibility";
import RatingsAndReviews, { RatingsAndReviewsData } from "./RatingsAndReviews";
import  { forwardRef, useImperativeHandle } from 'react';
import { Star } from 'lucide-react';
import { useReviewForm } from '@/app/context/RevievFormContext';
import { AxiosError } from 'axios';

interface Props {
  id: string;
}

const APPLIANCE_OPTIONS = [
  "Oven",
  "Refrigerator",
  "Washing machine",
  "Dishwasher",
  "Microwave",
  "Air Conditioning",
];
const FACILITY_OPTIONS = [
  "Elevator",
  "Parking lot",
  "Security system",
  "Gym",
  "Pool",
  "Garden",
];
const REPAIR_COVERAGE_OPTIONS = ["Landlord", "Tenant", "Shared"];

const SubmitReviewComponent = forwardRef(function SubmitReviewComponent(props, ref) {
  const { location, setLocation } = useReviewForm();
  const isAnonymous = location?.isAnonymous || false;
  const agreeToTerms = location?.agreeToTerms || false;

  const handleAnonymousChange = (checked: boolean) => {
    setLocation({ ...location, isAnonymous: checked });
  };

  const handleTermsChange = (checked: boolean) => {
    setLocation({ ...location, agreeToTerms: checked });
  };

  // This function can be called by the parent to submit the review
  const handleFinalSubmit = async () => {
    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions to continue');
      return false;
    }
    // You can add any additional validation here
    // Return the context data for final submission
    return {
      ...location,
      submittedAt: new Date().toISOString(),
    };
  };

  useImperativeHandle(ref, () => ({ handleFinalSubmit }));

  return (
    <div className={`space-y-6`}>
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        <span className="text-sm text-gray-600">
          Almost there! Just a few more details and you&#39;re done
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Submit your Review
        </h2>
        <p className="text-sm text-gray-600">
          Enter your information to complete your review
        </p>
      </div>

      {/* Anonymous submission checkbox */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => handleAnonymousChange(e.target.checked)}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
          Submit your review Anonymously?
        </label>
      </div>

      {/* Terms and Conditions */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terms and Conditions
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please review and accept our terms
          </p>
        </div>

        {/* Terms content box */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>By submitting this review, you confirm that:</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• You have personally lived at this property</li>
            <li>• Your review is honest and based on your own experience</li>
            <li>• You are not affiliated with the property owner or management</li>
            <li>• All information provided is accurate to the best of your knowledge</li>
          </ul>
        </div>

        {/* Agreement checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => handleTermsChange(e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
            I agree to the terms of use and privacy policy
          </label>
        </div>
      </div>
    </div>
  );
});

function sanitizeReviewPayload(data: ReviewFormData) {
  // Sanitize appliancesFixtures
  const appliancesFixtures = (data.stayDetails.appliancesFixtures || []).map((item) =>
    APPLIANCE_OPTIONS.find((opt) => opt.toLowerCase().replace(/\s/g,"") === item.toLowerCase().replace(/\s/g, "")) || item
  ).filter((item) => APPLIANCE_OPTIONS.includes(item));
  // Sanitize buildingFacilities
  const buildingFacilities = (data.stayDetails.buildingFacilities || []).map((item) =>
    FACILITY_OPTIONS.find((opt) => opt.toLowerCase().replace(/\s/g,"") === item.toLowerCase().replace(/\s/g, "")) || item
  ).filter((item) => FACILITY_OPTIONS.includes(item));
  // Sanitize costOfRepairsCoverage
  let costOfRepairsCoverage = data.ratingsAndReviews.costOfRepairsCoverage;
  costOfRepairsCoverage = REPAIR_COVERAGE_OPTIONS.find((opt) => opt.toLowerCase() === costOfRepairsCoverage.toLowerCase()) as ("Landlord" | "Tenant" | "Shared") || "Landlord";
  // Remove location mapping since ReviewFormData does not have a location property
  return {
    ...data,
    stayDetails: {
      ...data.stayDetails,
      appliancesFixtures,
      buildingFacilities,
    },
    ratingsAndReviews: {
      ...data.ratingsAndReviews,
      costOfRepairsCoverage,
    },
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

const PropertyReviewForm: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { mutate, isLoading, error } = useWriteReviewMutation();

  const {
    isAuthenticated,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    clearPendingData,
    submitPendingReview,
  } = useAuthRedirect();

  const [formData, setFormData] = useState<ReviewFormData>({
    stayDetails: {
      numberOfRooms: 1,
      numberOfOccupants: 1,
      dateLeft: "",
      furnished: false,
      appliancesFixtures: [],
      buildingFacilities: [],
      landlordLanguages: [],
    },
    costDetails: {
      rent: 0,
      rentType: "Monthly",
      securityDepositRequired: false,
      agentBrokerFeeRequired: false,
      fixedUtilityCost: false,
      julySummerUtilities: 0,
      januaryWinterUtilities: 0,
    },
    accessibility: {
      nearestGroceryStore: "Moderate",
      nearestPark: "Moderate",
      nearestRestaurant: "Moderate",
    },
    ratingsAndReviews: {
      valueForMoney: 1,
      costOfRepairsCoverage: "Landlord" as "Landlord" | "Tenant" | "Shared",
      overallExperience: 1,
      overallRating: 1,
      detailedReview: "",
    },

    submitAnonymously: false,
  });

  const {
    register,
    formState: { errors },
  } = useForm<StayDetails>({
    defaultValues: {
      numberOfRooms: 1,
      numberOfOccupants: 1,
    },
  });

  // Check if there is pending review data in local storage
  const checkPendingData = () => {
    try {
      const storedData = localStorage.getItem("pendingReviewData");
      if (storedData) {
        const parsedData: ReviewFormData = JSON.parse(storedData);
        setFormData(parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error("Error checking pending data:", error);
      return null;
    }
  };

  useEffect(() => {
    const pendingData = checkPendingData();
    if (pendingData) {
      setFormData(pendingData);
    }
  }, []);

  useEffect(() => {
    const handlePendingSubmission = async () => {
      if (isAuthenticated && hasPendingData && pendingReviewData) {
        try {
          toast.success("Welcome back! Submitting your review...");
          await submitPendingReview(pendingReviewData);
        } catch (error) {
          toast.error("Failed to submit review. Please try again.");
          console.error("Error submitting pending review:", error);
        }
      }
    };

    handlePendingSubmission();
  }, [
    isAuthenticated,
    hasPendingData,
    pendingReviewData,
    submitPendingReview,
    router,
  ]);

  // Save form data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("pendingReviewData", JSON.stringify(formData));
  }, [formData]);

  const handleCheckboxChange = (
    section: keyof Pick<ReviewFormData, "stayDetails">,
    field: keyof StayDetails,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as StayDetails),
        [field]: checked
          ? [...((prev[section] as StayDetails)[field] as string[]), value]
          : ((prev[section] as StayDetails)[field] as string[]).filter(
              (item) => item !== value
            ),
      },
    }));
  };
  // Handler for ratings and reviews updates
  const handleRatingsAndReviewsChange = (
    field: keyof RatingsAndReviewsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ratingsAndReviews: {
        ...prev.ratingsAndReviews,
        [field]: value,
      },
    }));
  };
  const handleInputChange = (
    section: keyof ReviewFormData,
    field: string,
    value: string | number | boolean | string[] | number[] | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.stayDetails.dateLeft) {
      toast.error("Please select the date you left the property");
      return false;
    }

    if (formData.costDetails.rent <= 0) {
      toast.error("Please enter a valid rent amount");
      return false;
    }

    if (!formData.ratingsAndReviews.detailedReview) {
      toast.error("Please provide a detailed review");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Sanitize payload before submission
    const submissionData = sanitizeReviewPayload(formData);

    try {
      if (!isAuthenticated) {
        toast.loading("Please log in to submit your review");
        handleAuthRedirect(submissionData);
        return;
      }

      mutate(
        { id, data: submissionData },
        {
          onSuccess: (data) => {
            clearPendingData();
            localStorage.removeItem("pendingReviewData");

            setTimeout(() => {
              router.push(`/reviewsPage/${data.review.id}`);
            }, 2000);
            console.log("Review submitted successfully:", data);
          },
          onError: (error: unknown) => {
            if (isAxiosError(error)) {
              console.error("Error submitting review (Axios):", error);
              if (error.response?.status === 401) {
                // handle unauthorized
              }
            } else if (error instanceof Error) {
              console.error("Error submitting review:", error);
            } else {
              console.error("Error submitting review: Unknown error", error);
            }
          },
        }
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Property Review Form</h2>

      <form className="space-y-6">
        {/* Stay Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Stay Details</h3>

          <StayDetailsInputs register={register} errors={errors} />

          <DateLeftInput
            value={formData.stayDetails.dateLeft}
            onChange={(value) =>
              handleInputChange("stayDetails", "dateLeft", value)
            }
          />

          <FurnishedCheckbox
            checked={formData.stayDetails.furnished}
            onChange={(checked) =>
              handleInputChange("stayDetails", "furnished", checked)
            }
          />

          <CheckboxGroups
            appliancesFixtures={formData.stayDetails.appliancesFixtures}
            buildingFacilities={formData.stayDetails.buildingFacilities}
            landlordLanguages={formData.stayDetails.landlordLanguages}
            onApplianceChange={(appliance, checked) =>
              handleCheckboxChange(
                "stayDetails",
                "appliancesFixtures",
                appliance,
                checked
              )
            }
            onFacilityChange={(facility, checked) =>
              handleCheckboxChange(
                "stayDetails",
                "buildingFacilities",
                facility,
                checked
              )
            }
            onLanguageChange={(language, checked) =>
              handleCheckboxChange(
                "stayDetails",
                "landlordLanguages",
                language,
                checked
              )
            }
          />
        </div>

        {/* Cost details section */}
        <CostDetails
          costDetails={formData.costDetails}
          onInputChange={(field, value) =>
            handleInputChange("costDetails", field, value)
          }
        />

        {/* Accessibility Section */}
        <Accessibility
          accessibility={formData.accessibility}
          onInputChange={(field, value) =>
            handleInputChange("accessibility", field, value)
          }
        />

        <RatingsAndReviews
          data={formData.ratingsAndReviews}
          onChange={handleRatingsAndReviewsChange}
          className="mb-6"
        />

        {/* Submit Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.submitAnonymously}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  submitAnonymously: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Submit Anonymously
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md cursor-pointer hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting Review..." : "Submit Review"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error submitting review. Please try again.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

SubmitReviewComponent.displayName = 'SubmitReviewComponent';

export default PropertyReviewForm;
