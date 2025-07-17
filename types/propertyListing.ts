import { LocationPayload } from "@/types/generated";

// Enum types for backend validation
export type CategoryType = 'rent' | 'sell' | 'swap';
export type PropertyTypeType = 'apartment' | 'house' | 'commercial' | 'room' | 'garage';
export type ConditionType = 'Good Condition' | 'New Building' | 'Renovated';
export type PetPolicyType = 'pet-friendly' | 'cats-only' | 'dogs-only' | 'small-pets' | 'no-pets';
export type OfferType = 'private' | 'agent';

export interface PropertyListingPayload {
  // Step 1: Property Type
  category: CategoryType;
  propertyType: PropertyTypeType;
  condition: ConditionType;
  petPolicy: PetPolicyType;

  // Step 2: Location
  searchAddress: string;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  streetAddress: string;
  location: LocationPayload;

  // Step 3: Photos & Videos
  media?: {
    coverPhoto?: File;
    uploads?: File[];
    videoTourLink?: string;
  };

  // Step 4: Property Details
  totalFloors: string;
  floor: string;
  totalArea: string;
  livingArea: string;
  kitchenArea: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  amenities: string[];
  infrastructure: string[];
  description: string;

  // Step 5: Price
  price: string;
  currency: string;
  isMonthly: boolean;
  isNegotiated: boolean;
  typeOfOffer: string; // Required by backend
  offerType: OfferType;
  notAvailableOnCedi: boolean;
  readyToCooperate: boolean;
  possibilityOfExchange: boolean;

  // Step 6: Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  openForTour: boolean;

  // Step 7: Ad Promotion
  adPromotion?: {
    selectedTier: string;
    selectedServices: string[];
    totalPrice: number;
  };
} 