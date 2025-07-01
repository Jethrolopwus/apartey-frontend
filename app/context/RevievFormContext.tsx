"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface LocationPayload {
  country?: string;
  countryCode?: string;
  stateOrRegion?: string;
  district?: string;
  street?: string;
  streetNumber?: string;
  apartment?: string;
  postalCode?: string;
  fullAddress?: string;
  city?: string;
  streetAddress?: string;
  numberOfRooms?: string;
  numberOfOccupants?: string;
  moveOutDate?: string;
  rentType?: string;
  yearlyRent?: string;
  securityDepositRequired?: boolean;
  agentFeeRequired?: boolean;
  appliancesFixtures?: string[];
  landlordLanguages?: string[];
  buildingFacilities?: string[];
  nearestGroceryStore?: string;
  nearestPark?: string;
  nearestRestaurant?: string;
  valueForMoney?: number;
  costOfRepairs?: string;
  overallExperience?: number;
  detailedReview?: string;
  isAnonymous?: boolean;
  agreeToTerms?: boolean;
  furnished?: boolean;
  fixedUtilityCost?: boolean;
  centralHeating?: boolean;
  julySummerUtilities?: string;
  januaryWinterUtilities?: string;
}

interface FormContextType {
  location: LocationPayload | null;
  setLocation: (loc: LocationPayload) => void;
}

const ReviewFormContext = createContext<FormContextType | null>(null);

export const ReviewFormProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage if available
  const getInitialLocation = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pendingReviewData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge contextLocation, location, and ratingsAndReviews for full restore
          return {
            ...(parsed.contextLocation || {}),
            ...(parsed.location || {}),
            ...(parsed.ratingsAndReviews || {}),
          };
        } catch {}
      }
    }
    return null;
  };
  const [location, setLocationState] = useState<LocationPayload | null>(getInitialLocation);

  const setLocation = (loc: LocationPayload) => {
    setLocationState(loc);
    console.log("location", loc);
  };

  return (
    <ReviewFormContext.Provider value={{ location, setLocation }}>
      {children}
    </ReviewFormContext.Provider>
  );
};

export const useReviewForm = () => {
  const ctx = useContext(ReviewFormContext);
  if (!ctx)
    throw new Error("useReviewForm must be used within ReviewFormProvider");
  return ctx;
};
