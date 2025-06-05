"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWriteReviewMutation } from "@/Hooks/use.writeReviews.mutation";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { toast } from "react-hot-toast";
import { StayDetails, ReviewFormData } from "@/types/generated";

const PropertyReviewForm: React.FC = () => {
  const router = useRouter();
  const { mutate, isLoading, error } = useWriteReviewMutation();

  // Use the auth redirect hook
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
      costOfRepairsCoverage: "Landlord",
      overallExperience: 1,
      overallRating: 1,
      detailedReview: "",
    },
    submitAnonymously: false,
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

  // Handle pending review submission after authentication
  useEffect(() => {
    const handlePendingSubmission = async () => {
      if (isAuthenticated && hasPendingData && pendingReviewData) {
        try {
          toast.success("Welcome back! Submitting your review...");
          await submitPendingReview(pendingReviewData);
          // toast.success("Review submitted successfully!");
          // router.push("/dashboard");
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

  const applianceOptions = [
    "Oven",
    "Refrigerator",
    "Washing machine",
    "Dishwasher",
    "Microwave",
    "Air Conditioning",
  ];

  const facilityOptions = [
    "Elevator",
    "Parking lot",
    "Security system",
    "Gym",
    "Pool",
    "Garden",
  ];

  const languageOptions = [
    "English",
    "Estonian",
    "Russian",
    "Finnish",
    "German",
    "Spanish",
  ];

  const proximityOptions = ["Very Close", "Close", "Moderate", "Far"] as const;

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

  const handleInputChange = (
    section: keyof ReviewFormData,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.stayDetails.dateLeft) {
      toast.error("Please select the date you left the property");
      return false;
    }

    if (formData.costDetails.rent <= 0) {
      toast.error("Please enter a valid rent amount");
      return false;
    }

    if (!formData.ratingsAndReviews.detailedReview.trim()) {
      toast.error("Please provide a detailed review");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Convert date to ISO string for submission
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

      // User is authenticated - submit directly
      mutate(submissionData, {
        onSuccess: (data) => {
          // toast.success("Review submitted successfully!");
          clearPendingData();
          router.push("");
          console.log("Review submitted successfully:", data);
        },
        onError: (error: any) => {
          console.error("Error submitting review:", error);

          // Handle authentication errors
          if (error.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            handleAuthRedirect(submissionData);
          } else {
            toast.error("Failed to submit review. Please try again.");
          }
        },
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (rating: number) => void;
    label: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Property Review Form
      </h1>

      {/* Show pending data notification */}
      {hasPendingData && !isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p className="font-medium">Welcome back!</p>
          <p>
            We found your previous review draft. Please log in to continue
            submitting your review.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Stay Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Stay Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.stayDetails.numberOfRooms}
                onChange={(e) =>
                  handleInputChange(
                    "stayDetails",
                    "numberOfRooms",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Occupants
              </label>
              <input
                type="number"
                min="1"
                value={formData.stayDetails.numberOfOccupants}
                onChange={(e) =>
                  handleInputChange(
                    "stayDetails",
                    "numberOfOccupants",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Left
            </label>
            <input
              type="date"
              value={formData.stayDetails.dateLeft?.slice(0, 10) || ""}
              onChange={(e) =>
                handleInputChange("stayDetails", "dateLeft", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.stayDetails.furnished}
                onChange={(e) =>
                  handleInputChange(
                    "stayDetails",
                    "furnished",
                    e.target.checked
                  )
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Furnished
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appliances & Fixtures
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {applianceOptions.map((appliance) => (
                <label key={appliance} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stayDetails.appliancesFixtures.includes(
                      appliance
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "stayDetails",
                        "appliancesFixtures",
                        appliance,
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{appliance}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building Facilities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {facilityOptions.map((facility) => (
                <label key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stayDetails.buildingFacilities.includes(
                      facility
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "stayDetails",
                        "buildingFacilities",
                        facility,
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Landlord Languages
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {languageOptions.map((language) => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.stayDetails.landlordLanguages.includes(
                      language
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "stayDetails",
                        "landlordLanguages",
                        language,
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Cost Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costDetails.rent}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "rent",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rent Type
              </label>
              <select
                value={formData.costDetails.rentType}
                onChange={(e) =>
                  handleInputChange("costDetails", "rentType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.costDetails.securityDepositRequired}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "securityDepositRequired",
                    e.target.checked
                  )
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Security Deposit Required
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.costDetails.agentBrokerFeeRequired}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "agentBrokerFeeRequired",
                    e.target.checked
                  )
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Agent/Broker Fee Required
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.costDetails.fixedUtilityCost}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "fixedUtilityCost",
                    e.target.checked
                  )
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Fixed Utility Cost
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                July Summer Utilities (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costDetails.julySummerUtilities}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "julySummerUtilities",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                January Winter Utilities (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costDetails.januaryWinterUtilities}
                onChange={(e) =>
                  handleInputChange(
                    "costDetails",
                    "januaryWinterUtilities",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Accessibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Grocery Store
              </label>
              <select
                value={formData.accessibility.nearestGroceryStore}
                onChange={(e) =>
                  handleInputChange(
                    "accessibility",
                    "nearestGroceryStore",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {proximityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Park
              </label>
              <select
                value={formData.accessibility.nearestPark}
                onChange={(e) =>
                  handleInputChange(
                    "accessibility",
                    "nearestPark",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {proximityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Restaurant
              </label>
              <select
                value={formData.accessibility.nearestRestaurant}
                onChange={(e) =>
                  handleInputChange(
                    "accessibility",
                    "nearestRestaurant",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {proximityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ratings and Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <StarRating
              value={formData.ratingsAndReviews.valueForMoney}
              onChange={(rating) =>
                handleInputChange("ratingsAndReviews", "valueForMoney", rating)
              }
              label="Value for Money"
            />

            <StarRating
              value={formData.ratingsAndReviews.overallExperience}
              onChange={(rating) =>
                handleInputChange(
                  "ratingsAndReviews",
                  "overallExperience",
                  rating
                )
              }
              label="Overall Experience"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <StarRating
              value={formData.ratingsAndReviews.overallRating}
              onChange={(rating) =>
                handleInputChange("ratingsAndReviews", "overallRating", rating)
              }
              label="Overall Rating"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost of Repairs Coverage
              </label>
              <select
                value={formData.ratingsAndReviews.costOfRepairsCoverage}
                onChange={(e) =>
                  handleInputChange(
                    "ratingsAndReviews",
                    "costOfRepairsCoverage",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Landlord">Landlord</option>
                <option value="Tenant">Tenant</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Review
            </label>
            <textarea
              value={formData.ratingsAndReviews.detailedReview}
              onChange={(e) =>
                handleInputChange(
                  "ratingsAndReviews",
                  "detailedReview",
                  e.target.value
                )
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your detailed experience with this property..."
              required
            />
          </div>
        </div>

        {/* Submit Options */}
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
      </div>
    </div>
  );
};

export default PropertyReviewForm;
