"use client";
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, Calendar, Home, Star, MessageSquare } from "lucide-react";
import RatingComponent from "@/components/molecules/ReviewsRating";
import SubmitReviewComponent from "@/components/organisms/SubmitReviews";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { useWriteUnlistedReviewMutation } from "@/Hooks/use.writeUnlistedReviews.mutation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PropertyDetailsSection from "@/components/molecules/PropertyDetailsSection";
import MoveOutDatePicker from "@/components/atoms/MoveOutDatePicker";
import RentInput from "@/components/molecules/RentInput";
import SecurityDepositToggle from "@/components/molecules/SecurityDepositToggle";
import SearchInput, {
  PlacePrediction,
} from "@/components/atoms/Buttons/SearchInput";
import LocationForm, {
  LocationFormRef,
  LocationFields,
} from "../molecules/LocationForm";
import AgentBrokerFeesToggle from "@/components/molecules/AgentBrokers";
import { UnlistedPropertyReview } from "@/types/generated";
import AmenitiesAccessibility from "@/components/molecules/AmenitiesAccessibility";
import AddressForm from "../molecules/AddressForm";
import { ReviewFormProvider, useReviewForm } from "@/app/context/RevievFormContext";

const WriteUnlistedPropertyReviews = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [inputValue, setInputValue] = useState("");

  interface SubmitReviewRef {
    validate: () => boolean;
  }

  const locationFormRef = useRef<LocationFormRef>(null);
  const { location } = useReviewForm();
  const submitReviewRef = useRef<{ handleFinalSubmit: () => Promise<any> }>(null);

  /* -- helper to fetch full place details -- */
  const getPlaceDetails = (
    placeId: string
  ): Promise<google.maps.places.PlaceResult> =>
    new Promise((resolve, reject) => {
      const svc = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
      }

      interface PlaceDetailsCallback {
        (
          result: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ): void;
      }

      svc.getDetails(
        {
          placeId,
          fields: ["address_components", "formatted_address"],
        } as PlaceDetailsRequest,
        ((place, status) =>
          status === window.google.maps.places.PlacesServiceStatus.OK && place
            ? resolve(place)
            : reject(
                new Error("Could not load place details")
              )) as PlaceDetailsCallback
      );
    });
  const mapStateName = (country: string, raw: string): string => {
    if (!raw) return "";

    const mappings: Record<string, Record<string, string>> = {
      nigeria: {
        "federal capital territory": "Abuja FCT",
      },
      ghana: {
        "greater accra": "Greater Accra",
      },
      kenya: {},
      "south-africa": {},
    };

    const key = raw.toLowerCase();
    const mapped = mappings[country]?.[key];
    return mapped ?? raw;
  };

  const parseAddress = (
    comps: google.maps.GeocoderAddressComponent[]
  ): Partial<LocationFields> => {
    const find = (type: string) =>
      comps.find((c) => c.types.includes(type))?.long_name || "";

    const country = find("country").toLowerCase();

    /*  primary components */
    const googleState = find("administrative_area_level_1");
    const googleCity =
      find("locality") ||
      find("administrative_area_level_2") ||
      find("sublocality_level_1");

    /*  small stuff */
    const district =
      find("sublocality_level_2") || find("sublocality_level_1") || googleCity;
    const zipCode = find("postal_code");
    const streetNumber = find("street_number");
    const route = find("route");
    const streetAddress = [streetNumber, route].filter(Boolean).join(" ");

    return {
      country,
      state: mapStateName(country, googleState),
      city: googleCity,
      district,
      zipCode,
      streetAddress,
    };
  };

  const handlePlaceSelect = async (p: PlacePrediction) => {
    try {
      const details = await getPlaceDetails(p.place_id);
      const parsed = parseAddress(details.address_components ?? []);
      locationFormRef.current?.setAddress(parsed);
    } catch (err) {
      console.error(err);
      toast.error("Could not load address details");
    }
  };

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

  const [formData, setFormData] = useState<UnlistedPropertyReview>({
    // Location fields
    country: "",
    city: "",
    state: "",
    district: "",
    zipCode: "",
    address: "",

    // Property details
    apartmentNumber: "",
    numberOfRooms: "",
    numberOfOccupants: "",
    moveOutDate: "",
    furnished: false,

    // Appliances
    appliances: {
      oven: false,
      washingMachine: false,
      refrigerator: false,
      garbageDisposal: false,
      airConditioner: false,
      dryer: false,
      microwave: false,
      others: false,
      otherText: "",
    },

    // Building facilities
    buildingFacilities: {
      parkingLot: false,
      streetParking: false,
      gymFitness: false,
      elevator: false,
      storageSpace: false,
      childrenPlayArea: false,
      roofTerrace: false,
      securitySystem: false,
      dedicatedParking: false,
      swimmingPool: false,
      gardenCourtyard: false,
      others: false,
      otherText: "",
    },

    // Landlord languages
    landlordLanguages: {
      english: false,
      spanish: false,
      french: false,
      german: false,
      portuguese: false,
      others: false,
      otherText: "",
      customLanguage: false,
      customLanguageText: "",
    },

    // Cost details
    rentType: "actual",
    yearlyRent: "",
    securityDepositRequired: false,
    agentFeeRequired: false,
    fixedUtilityCost: false,
    julyUtilities: "",
    januaryUtilities: "",

    // Accessibility
    nearestGroceryStore: "",
    nearestPark: "",
    nearestPublicTransport: "",

    // Ratings
    valueForMoney: 0,
    costOfRepairs: "",
    overallExperience: 0,
    overallRating: 0,
    detailedReview: "",
    additionalComments: "",

    // Submission preferences
    submitAnonymously: false,
    agreeToTerms: false,

    // Required for API (will be populated during transformation)
    location: {
      country: "",
      city: "",
      district: "",
      postalCode: "",
      streetAddress: "",
    },
    stayDetails: {
      numberOfRooms: 0,
      numberOfOccupants: 0,
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
      nearestGroceryStore: "",
      nearestPark: "",
      nearestRestaurant: "",
    },
    ratingsAndReviews: {
      valueForMoney: 0,
      costOfRepairsCoverage: "",
      overallExperience: 0,
      overallRating: 0,
      detailedReview: "",
    },
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (
    category: keyof UnlistedPropertyReview,
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

  interface RentData {
    rentType: "actual" | "range" | undefined;
    yearlyRent: string;
  }

  const rentData: RentData = {
    rentType: (formData.rentType as "actual" | "range") || "actual",
    yearlyRent: formData.yearlyRent || "",
  };

  const securityDepositData = {
    securityDepositRequired: formData.securityDepositRequired,
  };

  interface AgentBrokerFeesData {
    agentFeeRequired: boolean;
  }

  const agentBrokerFeesData: AgentBrokerFeesData = {
    agentFeeRequired: formData.agentFeeRequired ?? false,
  };

  const handleTermsChange = (
    agreed: boolean | ((prevState: boolean) => boolean)
  ) => {
    const newValue = typeof agreed === "function" ? agreed(canSubmit) : agreed;
    setCanSubmit(newValue);
    updateFormData("agreeToTerms", newValue);
  };

  const transformFormDataToAPI = (data: typeof formData) => {
    // Get selected appliances
    const selectedAppliances = Object.entries(data.appliances || {})
      .filter(([key, value]) => value && key !== "others")
      .map(([key]) => {
        const appliances: { [key: string]: string } = {
          oven: "Oven",
          washingMachine: "Washing Machine",
          refrigerator: "Refrigerator",
          garbageDisposal: "Garbage Disposal",
          airConditioner: "Air Conditioner",
          dryer: "Dryer",
          microwave: "Microwave",
        };
        return appliances[key] || key;
      });

    // Add custom appliances if specified
    if (data?.appliances?.others && data.appliances.otherText) {
      selectedAppliances.push(data.appliances.otherText);
    }

    // Get selected building facilities
    const selectedFacilities = Object.entries(data.buildingFacilities || {})
      .filter(([key, value]) => value && key !== "others")
      .map(([key]) => {
        const facilities: { [key: string]: string } = {
          parkingLot: "Parking Lot",
          streetParking: "Street Parking",
          gymFitness: "Gym/Fitness",
          elevator: "Elevator",
          storageSpace: "Storage Space",
          childrenPlayArea: "Children Play Area",
          roofTerrace: "Roof Terrace",
          securitySystem: "Security System",
          dedicatedParking: "Dedicated Parking",
          swimmingPool: "Swimming Pool",
          gardenCourtyard: "Garden/Courtyard",
        };
        return facilities[key] || key;
      });

    if (
      data.buildingFacilities?.others &&
      data?.buildingFacilities?.otherText
    ) {
      selectedFacilities.push(data.buildingFacilities.otherText);
    }

    // Get selected landlord languages
    const selectedLanguages = Object.entries(data.landlordLanguages || {})
      .filter(
        ([key, value]) =>
          value &&
          key !== "others" &&
          key !== "customLanguage" &&
          key !== "otherText" &&
          key !== "customLanguageText"
      )
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    // Add custom languages if specified
    if (data?.landlordLanguages?.others && data.landlordLanguages.otherText) {
      selectedLanguages.push(data.landlordLanguages.otherText);
    }
    if (
      data?.landlordLanguages?.customLanguage &&
      data.landlordLanguages.customLanguageText
    ) {
      selectedLanguages.push(data.landlordLanguages.customLanguageText);
    }

    // Parse rent amount from string (remove currency symbols and commas)
    const rentAmount =
      parseFloat(data.yearlyRent ?? "".replace(/[^\d.]/g, "")) || 0;

    // Parse utility costs
    const julyUtilities =
      parseFloat((data?.julyUtilities ?? "").replace(/[^\d.]/g, "")) || 0;
    const januaryUtilities =
      parseFloat((data?.januaryUtilities ?? "").replace(/[^\d.]/g, "")) || 0;

    // Convert move out date to ISO string
    const moveOutDate = new Date(data?.moveOutDate ?? "");
    if (isNaN(moveOutDate.getTime())) {
      throw new Error("Invalid move out date");
    }

    return {
      location: {
        country: data?.country || "",
        city: "",
        district: "",
        postalCode: "",
        streetAddress: data.address || "",
      },
      stayDetails: {
        numberOfRooms: parseInt(data.numberOfRooms ?? "1") || 1,
        numberOfOccupants: parseInt(data.numberOfOccupants ?? "1") || 1,
        dateLeft: moveOutDate.toISOString(),
        furnished: Boolean(data.furnished),
        appliancesFixtures: selectedAppliances,
        buildingFacilities: selectedFacilities,
        landlordLanguages: selectedLanguages,
      },
      costDetails: {
        rent: rentAmount,
        rentType: (data.rentType === "actual" ? "Monthly" : "Yearly") as
          | "Monthly"
          | "Yearly",
        securityDepositRequired: data.securityDepositRequired ?? false,
        agentBrokerFeeRequired: data.agentFeeRequired ?? false,
        fixedUtilityCost: data.fixedUtilityCost ?? false,
        julySummerUtilities: julyUtilities,
        januaryWinterUtilities: januaryUtilities,
      },
      accessibility: {
        nearestGroceryStore: data.nearestGroceryStore || "Not specified",
        nearestPark: data.nearestPark || "Not specified",
        nearestRestaurant: data.nearestPublicTransport || "Not specified",
      },
      ratingsAndReviews: {
        valueForMoney: data.valueForMoney || 1,
        costOfRepairsCoverage: data.costOfRepairs || "Not specified",
        overallExperience: data.overallExperience || 1,
        overallRating:
          Math.round(
            ((data.valueForMoney ?? 0) + (data.overallExperience ?? 0)) / 2
          ) || 1,
        detailedReview:
          data.detailedReview ||
          data.additionalComments ||
          "No detailed review provided",
      },
      submitAnonymously: data.submitAnonymously ?? false,
    };
  };

  const validateFormData = (data: typeof formData): string[] => {
    const errors: string[] = [];

    // Required fields validation
    if (!data?.country) errors.push("Country is required");
    if (!data.address) errors.push("Address is required");
    if (!data.numberOfRooms) errors.push("Number of rooms is required");
    if (!data.numberOfOccupants) errors.push("Number of occupants is required");
    if (!data.moveOutDate) errors.push("Move out date is required");
    if (!data.yearlyRent) errors.push("Rent amount is required");

    // Validate rent amount
    const rentAmount = parseFloat(
      (data.yearlyRent ?? "").replace(/[^\d.]/g, "")
    );
    if (isNaN(rentAmount) || rentAmount <= 0) {
      errors.push("Please enter a valid rent amount");
    }

    // Validate ratings
    if ((data.valueForMoney ?? 0) <= 0) {
      errors.push("Please provide a value for money rating");
    }
    if ((data.overallExperience ?? 0) <= 0) {
      errors.push("Please provide an overall experience rating");
    }

    // Validate move out date
    const moveOutDate = new Date(data?.moveOutDate ?? "");
    if (isNaN(moveOutDate.getTime())) {
      errors.push("Please provide a valid move out date");
    }

    return errors;
  };

  const transformContextToApiData = (contextData: any): UnlistedPropertyReview & { submitAnonymously: boolean } => {
    return {
      location: {
        country: contextData.country || "",
        city: contextData.city || "",
        district: contextData.district || "",
        postalCode: contextData.postalCode || "",
        streetAddress: contextData.street || "",
      },
      stayDetails: {
        numberOfRooms: Number(contextData.numberOfRooms) || 1,
        numberOfOccupants: Number(contextData.numberOfOccupants) || 1,
        dateLeft: contextData.moveOutDate || "",
        furnished: !!contextData.furnished,
        appliancesFixtures: contextData.appliancesFixtures || [],
        buildingFacilities: contextData.buildingFacilities || [],
        landlordLanguages: contextData.landlordLanguages || [],
      },
      costDetails: {
        rent: Number(contextData.yearlyRent) || 0,
        rentType: contextData.rentType === "range" ? "Yearly" : "Monthly",
        securityDepositRequired: !!contextData.securityDepositRequired,
        agentBrokerFeeRequired: !!contextData.agentFeeRequired,
        fixedUtilityCost: !!contextData.fixedUtilityCost,
        julySummerUtilities: Number(contextData.julyUtilities) || 0,
        januaryWinterUtilities: Number(contextData.januaryUtilities) || 0,
      },
      accessibility: {
        nearestGroceryStore: contextData.nearestGroceryStore || "",
        nearestPark: contextData.nearestPark || "",
        nearestRestaurant: contextData.nearestRestaurant || "",
      },
      ratingsAndReviews: {
        valueForMoney: contextData.valueForMoney || 0,
        costOfRepairsCoverage: contextData.costOfRepairs || "",
        overallExperience: contextData.overallExperience || 0,
        overallRating: Math.round(
          ((contextData.valueForMoney || 0) + (contextData.overallExperience || 0)) / 2
        ),
        detailedReview: contextData.detailedReview || "",
      },
      submitAnonymously: !!contextData.isAnonymous,
      agreeToTerms: !!contextData.agreeToTerms,
    };
  };

  const handleFinalSubmitWithValidation = async () => {
    if (!canSubmit) {
      toast.error("Please agree to the terms and conditions to continue");
      return;
    }

    // Call the child's handleFinalSubmit for validation and data
    let contextData = location;
    if (submitReviewRef.current && submitReviewRef.current.handleFinalSubmit) {
      const result = await submitReviewRef.current.handleFinalSubmit();
      if (!result) return; // Validation failed in child
      contextData = result;
    }

    setIsSubmitting(true);

    try {
      const apiData = transformContextToApiData(contextData);

      if (!isAuthenticated) {
        handleAuthRedirect(apiData);
        return;
      }

      writeReviewMutation.mutate(apiData, {
        onSuccess: (response) => {
          clearPendingData();
          toast.success("Review submitted successfully!");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            handleAuthRedirect(apiData);
          } else {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "There was an error submitting your review. Please try again.";
            toast.error(errorMessage);
          }
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleFinalSubmit = () => {
    console.log("Form submitted:", formData);
    toast.success("Review submitted successfully!");
  };

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

  const handleRatingsChange = (field: string, value: any) => {
    // Update the ratings and reviews section of formData
    setFormData((prev) => ({
      ...prev,
      ratingsAndReviews: {
        ...prev.ratingsAndReviews,
        [field]: value,
      },
    }));

    // If valueForMoney or overallExperience is updated, recalculate overallRating
    if (field === "valueForMoney" || field === "overallExperience") {
      setFormData((prev) => ({
        ...prev,
        ratingsAndReviews: {
          ...prev.ratingsAndReviews,
          overallRating: Math.round(
            (prev.ratingsAndReviews.valueForMoney +
              prev.ratingsAndReviews.overallExperience) /
              2
          ),
        },
      }));
    }
  };
  return (
    <ReviewFormProvider>
      <div className="min-h-screen bg-gray-50">
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
                {/* <SearchInput
                placeholder="Search by address, neighborhood, or city"
                countryRestrictions={["ng", "ee"]}
                onPlaceSelect={handlePlaceSelect}
                onChange={(value) => setInputValue(value)}
                onSubmit={(value) =>
                  value &&
                  router.push(`/searchReview?q=${encodeURIComponent(value)}`)
                }
                onLocationSelect={() => {}}
              /> */}
                <div className="space-y-6">
                  <AddressForm />
                  {/* PropertyDetailsSections */}
                  <PropertyDetailsSection
                    apartmentNumber={formData.apartmentNumber}
                    numberOfRooms={formData.numberOfRooms}
                    numberOfOccupants={formData.numberOfOccupants}
                    onChange={(field, value) => updateFormData(field, value)}
                  />

                  {/* Move data */}
                  <MoveOutDatePicker
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
                    
                      />
                      {/* Security Deposit */}
                      <SecurityDepositToggle
                      />

                      {/* Agent/Broker Fees */}
                      <AgentBrokerFeesToggle
                      />
                    </div>
                  </div>
                )}
                {/* Step 2B: Amenities & Accessibility */}
                {currentSubStep === 2 && (
                  <AmenitiesAccessibility
                  
                  />
                )}
                {/* Step 2C: Ratings & Reviews */}
                {currentSubStep === 3 && (
                  <RatingComponent
                  />
                )}
              </div>
            )}

            {/* Step 3: Submit Review */}
            {currentStep === 3 && <SubmitReviewComponent ref={submitReviewRef} />}

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
                <button
                  onClick={handleFinalSubmitWithValidation}
                  disabled={!canSubmit || isSubmitting}
                  className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </ReviewFormProvider>
  );
};

export default WriteUnlistedPropertyReviews;
