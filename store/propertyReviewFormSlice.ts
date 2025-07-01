import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the form state
export interface PropertyReviewFormState {
  // Property details
  propertyType: string;
  propertyName: string;
  propertyDescription: string;
  rentType: 'actual' | 'range';
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
  numberOfRooms: number;
  numberOfOccupants: number;
  nearestGroceryStore: string;
  nearestPark: string;
  nearestRestaurant: string;
  landlordLanguages: string[];
  // Address/location
  country: string;
  countryCode: string;
  stateOrRegion: string;
  street: string;
  district: string;
  apartment: string;
  postalCode: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number } | null;
  // Move out date
  moveOutDate: string | null;
  // Ratings & reviews
  valueForMoney: number;
  costOfRepairs: string;
  overallExperience: number;
  detailedReview: string;
}

// Helper to load from localStorage
function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper to save to localStorage
function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const initialState: PropertyReviewFormState = {
  propertyType: loadFromLocalStorage('propertyReviewForm_propertyType', ''),
  propertyName: loadFromLocalStorage('propertyReviewForm_propertyName', ''),
  propertyDescription: loadFromLocalStorage('propertyReviewForm_propertyDescription', ''),
  rentType: loadFromLocalStorage('propertyReviewForm_rentType', 'actual'),
  yearlyRent: loadFromLocalStorage('propertyReviewForm_yearlyRent', ''),
  securityDepositRequired: loadFromLocalStorage('propertyReviewForm_securityDepositRequired', false),
  agentFeeRequired: loadFromLocalStorage('propertyReviewForm_agentFeeRequired', false),
  fixedUtilityCost: loadFromLocalStorage('propertyReviewForm_fixedUtilityCost', false),
  centralHeating: loadFromLocalStorage('propertyReviewForm_centralHeating', false),
  furnished: loadFromLocalStorage('propertyReviewForm_furnished', false),
  julySummerUtilities: loadFromLocalStorage('propertyReviewForm_julySummerUtilities', ''),
  januaryWinterUtilities: loadFromLocalStorage('propertyReviewForm_januaryWinterUtilities', ''),
  appliances: loadFromLocalStorage('propertyReviewForm_appliances', []),
  buildingFacilities: loadFromLocalStorage('propertyReviewForm_buildingFacilities', []),
  costOfRepairsCoverage: loadFromLocalStorage('propertyReviewForm_costOfRepairsCoverage', []),
  isAnonymous: loadFromLocalStorage('propertyReviewForm_isAnonymous', false),
  agreeToTerms: loadFromLocalStorage('propertyReviewForm_agreeToTerms', false),
  numberOfRooms: loadFromLocalStorage('propertyReviewForm_numberOfRooms', 1),
  numberOfOccupants: loadFromLocalStorage('propertyReviewForm_numberOfOccupants', 1),
  nearestGroceryStore: loadFromLocalStorage('propertyReviewForm_nearestGroceryStore', ''),
  nearestPark: loadFromLocalStorage('propertyReviewForm_nearestPark', ''),
  nearestRestaurant: loadFromLocalStorage('propertyReviewForm_nearestRestaurant', ''),
  landlordLanguages: loadFromLocalStorage('propertyReviewForm_landlordLanguages', []),
  country: loadFromLocalStorage('propertyReviewForm_country', ''),
  countryCode: loadFromLocalStorage('propertyReviewForm_countryCode', ''),
  stateOrRegion: loadFromLocalStorage('propertyReviewForm_stateOrRegion', ''),
  street: loadFromLocalStorage('propertyReviewForm_street', ''),
  district: loadFromLocalStorage('propertyReviewForm_district', ''),
  apartment: loadFromLocalStorage('propertyReviewForm_apartment', ''),
  postalCode: loadFromLocalStorage('propertyReviewForm_postalCode', ''),
  fullAddress: loadFromLocalStorage('propertyReviewForm_fullAddress', ''),
  coordinates: loadFromLocalStorage('propertyReviewForm_coordinates', null),
  moveOutDate: loadFromLocalStorage('propertyReviewForm_moveOutDate', null),
  valueForMoney: loadFromLocalStorage('propertyReviewForm_valueForMoney', 0),
  costOfRepairs: loadFromLocalStorage('propertyReviewForm_costOfRepairs', ''),
  overallExperience: loadFromLocalStorage('propertyReviewForm_overallExperience', 0),
  detailedReview: loadFromLocalStorage('propertyReviewForm_detailedReview', ''),
};

const propertyReviewFormSlice = createSlice({
  name: 'propertyReviewForm',
  initialState,
  reducers: {
    setField<K extends keyof PropertyReviewFormState>(state: PropertyReviewFormState, action: PayloadAction<{ key: K; value: PropertyReviewFormState[K] }>) {
      state[action.payload.key] = action.payload.value;
      saveToLocalStorage(`propertyReviewForm_${action.payload.key}`, action.payload.value);
    },
    setMultipleFields(state: PropertyReviewFormState, action: PayloadAction<Partial<PropertyReviewFormState>>) {
      Object.entries(action.payload).forEach(([key, value]) => {
        (state as any)[key] = value;
        saveToLocalStorage(`propertyReviewForm_${key}`, value);
      });
    },
    resetForm(state: PropertyReviewFormState) {
      Object.keys(initialState).forEach((key) => {
        (state as any)[key] = (initialState as any)[key];
        saveToLocalStorage(`propertyReviewForm_${key}`, (initialState as any)[key]);
      });
    },
  },
});

export const { setField, setMultipleFields, resetForm } = propertyReviewFormSlice.actions;
export default propertyReviewFormSlice.reducer; 