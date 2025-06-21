
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
}

interface FormContextType {
  location: LocationPayload | null;
  setLocation: (loc: LocationPayload) => void;
}

const ReviewFormContext = createContext<FormContextType | null>(null);

export const ReviewFormProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocationState] = useState<LocationPayload | null>(null);

  // const [location, setLocationState] = useState<LocationPayload>({
  //   country: "",
  //   countryCode: "",
  //   stateOrRegion: "",
  //   district: "",
  //   street: "",
  //   streetNumber: "",
  //   apartment: "",
  //   postalCode: "",
  //   fullAddress: "",
  //   numberOfRooms: "",
  //   numberOfOccupants: "",
  // });

  const setLocation = (loc: LocationPayload) => {
    setLocationState(loc);
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
