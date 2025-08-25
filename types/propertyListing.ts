// Property Listing Types based on Mongoose Schema
// This file contains all TypeScript types for the property listing form

// ===== ENUMS =====

export const CategoriesEnum = ['Sale', 'Rent', 'Swap'] as const;
export type CategoryType = typeof CategoriesEnum[number];

export const PropertyTypeEnum = ['Apartment', 'House', 'Room', 'Commercial', 'Garage'] as const;
export type PropertyType = typeof PropertyTypeEnum[number];

export const PropertyConditionEnum = ['Good Condition', 'New Building', 'Renovated'] as const;
export type PropertyCondition = typeof PropertyConditionEnum[number];

export const PetPolicyEnum = ['pet-friendly', 'no-pets'] as const;
export type PetPolicy = typeof PetPolicyEnum[number];

export const OfferTypeEnum = ['private', 'agent'] as const;
export type OfferType = typeof OfferTypeEnum[number];

export const PromotionTierEnum = ['Basic', 'Premium', 'Professional'] as const;
export type PromotionTier = typeof PromotionTierEnum[number];

export const ListingStatusEnum = ['active', 'pending'] as const;
export type ListingStatus = typeof ListingStatusEnum[number];

export const CurrencyEnum = ['NGN', 'EUR', 'USD'] as const;
export type Currency = typeof CurrencyEnum[number];

export const QuickSelectEnum = ['1 Month', '3 Months', '6 Months', '1 Year'] as const;
export type QuickSelect = typeof QuickSelectEnum[number];

// ===== AMENITIES & INFRASTRUCTURE ENUMS =====

export const AmenitiesEnum = [
  "TV set",
  "Washing machine",
  "Kitchen",
  "Air conditioning",
  "Separate workplace",
  "Refrigerator",
  "Drying machine",
  "Closet",
  "Patio",
  "Fireplace",
  "Shower cabin",
  "Whirlpool",
  "Security cameras",
  "Balcony",
  "Bar",
] as const;
export type Amenity = typeof AmenitiesEnum[number];

export const InfrastructureEnum = [
  "Schools",
  "Parking lot",
  "Shop",
  "Kindergarten",
  "Sports center",
  "Shopping center",
  "Underground",
  "Beauty salon",
  "Bank",
  "Cinema / theater",
  "Restaurant / cafe",
  "Park / green area",
] as const;
export type Infrastructure = typeof InfrastructureEnum[number];

// ===== COORDINATES =====

export interface Coordinates {
  latitude?: number;
  longitude?: number;
}

// ===== LOCATION =====

export interface LocationData {
  country?: string;
  countryCode?: string;
  stateOrRegion?: string;
  district?: string;
  street?: string;
  streetNumber?: string;
  apartment?: string;
  postalCode?: string;
  fullAddress?: string;
  coordinates?: Coordinates;
  displayOnMap?: boolean;
}

// ===== MEDIA =====

export interface MediaUpload {
  url: string;
  type: 'image' | 'video';
}

export interface MediaData {
  coverPhoto: string;
  uploads?: MediaUpload[];
  videoTourLink?: string;
}

// ===== PRICING =====

export interface SalePrice {
  salePrice: number;
}

export interface RentPrice {
  monthly: number;
  yearly: number;
}

export interface SwapPrice {
  monthly: number;
  yearly: number;
}

export interface PriceData {
  salePrice?: SalePrice;
  rent?: RentPrice;
  swap?: SwapPrice;
  currency: Currency;
}

// ===== PROPERTY DETAILS =====

export interface PropertyDetailsData {
  price: PriceData;
  negotiatedPrice: boolean;
  notForCreditSale: boolean;
  readyToCooperateWithAgents: boolean;
  possibleExchange: boolean;
  totalFloors?: number;
  floor?: number;
  totalAreaSqM?: number;
  livingAreaSqM?: number;
  kitchenAreaSqM?: number;
  livingrooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  amenities?: Amenity[];
  infrastructure?: Infrastructure[];
  description: string;
}

// ===== LISTING DURATION =====

export interface ListingDurationData {
  startDate?: Date;
  endDate?: Date;
  quickSelect?: QuickSelect;
}

// ===== CONTACT INFO =====

export interface ContactInfoData {
  typeOfOffer: OfferType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  openForTourSchedule?: boolean;
}

// ===== AD PROMOTION =====

export interface AdPromotionData {
  selectedTier?: PromotionTier;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  certifiedByFinder?: boolean;
  liftsToTopCount?: number;
  detailedAnalytics?: boolean;
  promotionPrice?: number;
  currency?: string;
}

// ===== DEACTIVATION META =====

export interface DeactivationMetaData {
  reason?: 'Transaction was successful' | 'Transaction was not completed' | 'Other';
  location?: 'On Platform' | 'Elsewhere' | 'Not Sold' | 'Other' | null;
  customNote?: string | null;
  date?: Date;
}

// ===== COMPLETE PROPERTY LISTING PAYLOAD =====

export interface PropertyListingPayload {
  // Basic Info
  category: CategoryType;
  propertyType: PropertyType;
  condition: PropertyCondition;
  petPolicy: PetPolicy;

  // Location
  location: LocationData;

  // Media
  media: MediaData;

  // Property Details
  propertyDetails: PropertyDetailsData;

  // Listing Duration (only for Swap category)
  listingDuration?: ListingDurationData;

  // Contact Info
  contactInfo: ContactInfoData;

  // Ad Promotion
  adPromotion?: AdPromotionData;

  // Status
  isAvailable?: boolean;
  status?: ListingStatus;
  views?: number;
}

// ===== STEP-BY-STEP FORM TYPES =====

// Step 1: Property Type
export interface PropertyTypeStepData {
  category: CategoryType;
  propertyType: PropertyType;
  condition: PropertyCondition;
  petPolicy: PetPolicy;
}

// Step 2: Location
export interface LocationStepData {
  searchAddress: string;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  streetAddress: string;
  apartment: string;
  countryCode: string;
  state: string;
  location: LocationData;
}

// Step 3: Photos & Videos
export interface PhotosVideosStepData {
  coverPhoto: string;
  uploads?: MediaUpload[];
  videoTourLink?: string;
}

// Step 4: Property Details
export interface PropertyDetailsStepData {
  totalFloors: string;
  floor: string;
  totalAreaSqM: string;
  livingAreaSqM: string;
  bedroomAreaSqM: string;
  listingDuration: string;
  livingRooms: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  amenities: string[];
  infrastructure: string[];
  description: string;
}

// Step 5: Price
export interface PriceStepData {
  price: string;
  currency: Currency;
  isNegotiated: boolean;
  offerType: OfferType;
  rentType?: string;
  notForCreditSale: boolean;
  readyToCooperateWithAgents: boolean;
  possibleExchange: boolean;
}

// Step 6: Contact Info
export interface ContactInfoStepData {
  typeOfOffer: OfferType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  openForTourSchedule?: boolean;
}

// Step 7: Ad Promotion
export interface AdPromotionStepData {
  selectedTier?: PromotionTier;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  certifiedByFinder?: boolean;
  liftsToTopCount?: number;
  detailedAnalytics?: boolean;
  promotionPrice?: number;
  currency?: string;
}

// ===== FORM STATE TYPE =====

export interface PropertyListingFormState {
  // Step 1
  category?: CategoryType;
  propertyType?: PropertyType;
  condition?: PropertyCondition;
  petPolicy?: PetPolicy;

  // Step 2
  searchAddress?: string;
  country?: string;
  city?: string;
  district?: string;
  zipCode?: string;
  streetAddress?: string;
  apartment?: string;
  countryCode?: string;
  state?: string;
  location?: LocationData;

  // Step 3
  coverPhoto?: string | File;
  uploads?: File[];
  videoTourLink?: string;

  // Step 4
  propertyDetails?: PropertyDetailsStepData;

  // Step 5
  price?: string;
  currency?: Currency;
  isNegotiated?: boolean;
  offerType?: OfferType;
  rentType?: string;
  notForCreditSale?: boolean;
  readyToCooperateWithAgents?: boolean;
  possibleExchange?: boolean;

  // Step 6
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  openForTourSchedule?: boolean;

  // Step 7
  selectedTier?: PromotionTier;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  certifiedByFinder?: boolean;
  liftsToTopCount?: number;
  detailedAnalytics?: boolean;
  promotionPrice?: number;
  promotionCurrency?: string;
}

// ===== UTILITY TYPES =====

export type StepProps = {
  onNext: () => void;
  onBack: () => void;
  formData: PropertyListingFormState;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingFormState>>;
};

// Legacy type for backward compatibility with existing components
export type LegacyStepProps = {
  onNext: () => void;
  onBack: () => void;
  formData: PropertyListingPayload | Partial<PropertyListingPayload>;
  setFormData: React.Dispatch<React.SetStateAction<PropertyListingPayload | Partial<PropertyListingPayload>>>;
};

// ===== API RESPONSE TYPES =====

export interface PropertyListingResponse {
  success: boolean;
  data?: PropertyListingPayload;
  message?: string;
  error?: string;
}

// ===== VALIDATION TYPES =====

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
} 