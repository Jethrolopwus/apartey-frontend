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

interface Props {
  id: string;
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
    value: any
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

    const submissionData = {
      ...formData,
      stayDetails: {
        ...formData.stayDetails,
        dateLeft: new Date(formData.stayDetails.dateLeft).toISOString(),
      },
    };

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
          onError: (error: any) => {
            console.error("Error submitting review:", error);

            if (error.response?.status === 401) {
              toast.error("Session expired. Please log in again.");
              handleAuthRedirect(submissionData);
            } else {
              toast.error("Failed to submit review. Please try again.");
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

export default PropertyReviewForm;
