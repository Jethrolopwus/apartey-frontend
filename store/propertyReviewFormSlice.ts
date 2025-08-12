import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface PropertyReviewFormState {
  propertyType: string;
  propertyName: string;
  propertyDescription: string;
  rentType: string; // Changed from "actual" | "range" to string
  rent: {
    amount: number;
    currency: string;
  }; // Changed from yearlyRent: string to rent object
  securityDepositRequired: boolean;
  agentFeeRequired: boolean;
  fixedUtilityCost: boolean;
  centralHeating: boolean;
  furnished: boolean;
  julyUtilities: {
    amount: number;
    currency: string;
  };
  januaryUtilities: {
    amount: number;
    currency: string;
  };
  appliances: string[];
  buildingFacilities: string[];
  costOfRepairsCoverage: string[]; // Keep as string[] to avoid type changes
  isAnonymous: boolean;
  agreeToTerms: boolean;
  numberOfRooms: number;
  numberOfOccupants: number;
  nearestGroceryStore: string;
  nearestPark: string;
  nearestRestaurant: string;
  landlordLanguages: string[];
  country: string;
  countryCode: string;
  stateOrRegion: string;
  streetAddress?: string;
  street: string;
  district: string;
  apartment: string;
  postalCode: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number } | null;
  moveOutDate: string | null;
  valueForMoney: number;
  costOfRepairs: string;
  overallExperience: number;
  detailedReview: string;
}

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const initialState: PropertyReviewFormState = {
  propertyType: "",
  propertyName: "",
  propertyDescription: "",
  rentType: "Yearly", // Changed from "actual" to "Yearly"
  rent: {
    amount: 0,
    currency: "NGN"
  }, // Changed from yearlyRent: "" to rent object
  securityDepositRequired: false,
  agentFeeRequired: false,
  fixedUtilityCost: false,
  centralHeating: false,
  furnished: false,
  julyUtilities: {
    amount: 0,
    currency: "NGN"
  },
  januaryUtilities: {
    amount: 0,
    currency: "NGN"
  },
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
  country: "",
  countryCode: "",
  stateOrRegion: "",
  street: "",
  district: "",
  apartment: "",
  postalCode: "",
  fullAddress: "",
  coordinates: null,
  moveOutDate: null,
  valueForMoney: 0,
  costOfRepairs: "",
  overallExperience: 0,
  detailedReview: "",
};

const propertyReviewFormSlice = createSlice({
  name: "propertyReviewForm",
  initialState,
  reducers: {
    setField<K extends keyof PropertyReviewFormState>(
      state: PropertyReviewFormState,
      action: PayloadAction<{ key: K; value: PropertyReviewFormState[K] }>
    ) {
      state[action.payload.key] = action.payload.value;
      saveToLocalStorage(
        `propertyReviewForm_${action.payload.key}`,
        action.payload.value
      );
    },
    setMultipleFields(
      state: PropertyReviewFormState,
      action: PayloadAction<Partial<PropertyReviewFormState>>
    ) {
      Object.entries(action.payload).forEach(([key, value]) => {
        (state as any)[key] = value;
        saveToLocalStorage(`propertyReviewForm_${key}`, value);
      });
    },
    resetForm(state: PropertyReviewFormState) {
      Object.keys(initialState).forEach((key) => {
        (state as any)[key] = (initialState as any)[key];
      });
    },
  },
});

export const { setField, setMultipleFields, resetForm } =
  propertyReviewFormSlice.actions;
export default propertyReviewFormSlice.reducer;
