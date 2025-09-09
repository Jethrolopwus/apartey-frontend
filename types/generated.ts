import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";

export interface FormValues {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface Review {
  _id?: string;
  submitAnonymously?: boolean;
  createdAt?: string;
  updatedAt?: string;
  location: ReviewLocation;
  linkedProperty?: {
    _id?: string;
    propertyType?: string;
    location?: ReviewLocation;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    media?: {
      coverPhoto?: string;
      uploads?: Array<{
        url: string;
        type: string;
        _id: string;
      }>;
    };
  } | null;
  isLinkedToDatabaseProperty?: boolean;
  reviewer?: Reviewer | null;
  overallRating?: number;
  valueForMoney?: number;
  overallExperience?: number;
  detailedReview?: string;
  costOfRepairsCoverage?: string;
}

export interface Reviewer {
  _id?: string;
  firstName?: string;
  lastName?: string;
}

// export interface ReviewLocation {
//   streetAddress: any;
//   district: string;
//   city: string;
//   lat: number;
//   lng: number;
// }

export interface AllReviewsProps {
  className?: string;
  showHeader?: boolean;
  maxItems?: number;
  gridCols?: string;
}
export interface ReviewLocation {
  [x: string]: string | number | boolean | undefined | { latitude: number; longitude: number };
  fullAddress?: string;
  streetAddress?: string;
  apartmentUnitNumber?: string;
  district?: string;
  city?: string;
  country?: string;
  stateOrRegion?: string;
  street?: string;
  postalCode?: string;
  countryCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  displayOnMap?: boolean;
  streetNumber?: string;
  apartment?: string;
}
export interface UseGetAllReviewsQueryParams {
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  countryCode?: string;
  page?: number;
  apartment?: string;
}

export interface ReviewsQueryData {
  message: string;
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  apartmentNumbers: string[];
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}

export interface PropertyLocation {
  displayOnMap: boolean;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  streetAddress: string;
  stateOrRegion: string;
  fullAddress: string;
}

export interface PropertyMedia {
  coverPhoto: string;
  uploads: {
    url: string;
    type: "image" | "video";
    _id: string;
  }[];
}

export interface PropertyDetails {
  period: any;
  negotiatedPrice: boolean;
  currency?: string;
  amenities: string[];
  infrastructure: string[];
  price: number;
  totalFloors: number;
  floor: number;
  totalAreaSqM: number;
  livingAreaSqM: number;
  kitchenAreaSqM: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  description: string;
}

export interface ContactInfo {
  openForTourSchedule: boolean;
  typeOfOffer: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface AdPromotion {
  certifiedByFinder: boolean;
  liftsToTopCount: number;
  detailedAnalytics: boolean;
  selectedTier: string;
}

export interface Property {
  _id: string;
  lister: string;
  propertyType: string;
  condition: string;
  petPolicy: string;
  location: PropertyLocation;
  media: PropertyMedia;
  propertyDetails: PropertyDetails;
  contactInfo: ContactInfo;
  adPromotion: AdPromotion;
  status: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
  __v: number;
  category: PropertyCategory;
}

export interface PropertiesResponse {
  message: string;
  properties: Property[];
  page: number;
  pages: number;
  total: number;
  limit?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface Listing {
  id: string;
  imageUrl: string;
  verified: boolean;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
  size: string;
  oldPrice: string;
  newPrice: string;
}

export interface ReviewData {
  linkedProperty: any;
  isLinkedToDatabaseProperty: any;
  overallRating(overallRating: any): import("react").ReactNode;
  detailedReview: string;
  id: string;
  address: string;
  rating: number;
  reviewCount: number;
  comment: string;
  imageUrl: string;
  location: ReviewLocation;
}

export interface UnlistedPropertyReview {
  // Location details
  location: {
    country: string;
    city: string;
    district: string;
    postalCode: string;
    streetAddress: string;
    apartment: string;
    stateOrRegion: string;
  };

  // Form-specific location fields (for form state management)
  country?: string;
  city?: string;
  state?: string;
  district?: string;
  zipCode?: string;
  address?: string;

  // Stay details
  stayDetails: {
    numberOfRooms: number;
    numberOfOccupants: number;
    dateLeft: string;
    furnished: boolean;
    appliancesFixtures: string[];
    buildingFacilities: string[];
    landlordLanguages: string[];
  };

  // Form-specific property fields
  apartmentNumber?: string;
  numberOfRooms?: string;
  numberOfOccupants?: string;
  moveOutDate?: string;
  furnished?: boolean;

  // Appliances (nested object for form state)
  appliances?: {
    oven?: boolean;
    washingMachine?: boolean;
    refrigerator?: boolean;
    garbageDisposal?: boolean;
    airConditioner?: boolean;
    dryer?: boolean;
    microwave?: boolean;
    others?: boolean;
    otherText?: string;
  };

  // Building facilities (nested object for form state)
  buildingFacilities?: {
    parkingLot?: boolean;
    streetParking?: boolean;
    gymFitness?: boolean;
    elevator?: boolean;
    storageSpace?: boolean;
    childrenPlayArea?: boolean;
    roofTerrace?: boolean;
    securitySystem?: boolean;
    dedicatedParking?: boolean;
    swimmingPool?: boolean;
    gardenCourtyard?: boolean;
    others?: boolean;
    otherText?: string;
  };

  // Landlord languages (nested object for form state)
  landlordLanguages?: {
    english?: boolean;
    spanish?: boolean;
    french?: boolean;
    german?: boolean;
    portuguese?: boolean;
    others?: boolean;
    otherText?: string;
    customLanguage?: boolean;
    customLanguageText?: string;
  };

  // Cost details
  costDetails: {
    rent: {
      amount: number;
      currency: string;
    };
    rentType: string;
    securityDepositRequired: boolean;
    agentBrokerFeeRequired: boolean;
    fixedUtilityCost: boolean;
    julyUtilities?: {
      amount: number;
      currency: string;
    };
    januaryUtilities?: {
      amount: number;
      currency: string;
    };
  };

  // Form-specific cost fields
  rentType?: "actual" | "range";
  yearlyRent?: string;
  securityDepositRequired?: boolean;
  agentFeeRequired?: boolean;
  fixedUtilityCost?: boolean;
  julyUtilities?: string;
  januaryUtilities?: string;

  accessibility: {
    nearestGroceryStore: "Very Close" | "Close" | "Moderate" | "Far" | string;
    nearestPark: "Very Close" | "Close" | "Moderate" | "Far" | string;
    nearestRestaurant: "Very Close" | "Close" | "Moderate" | "Far" | string;
  };

  nearestGroceryStore?: string;
  nearestPark?: string;
  nearestPublicTransport?: string;

  ratingsAndReviews: {
    valueForMoney: number;
    costOfRepairsCoverage: "Landlord" | "Tenant" | "Shared" | string;
    overallExperience: number;
    overallRating: number;
    detailedReview: string;
  };

  valueForMoney?: number;
  costOfRepairs?: string;
  overallExperience?: number;
  overallRating?: number;
  detailedReview?: string;
  additionalComments?: string;

  submitAnonymously?: boolean;
  agreeToTerms?: boolean;
}
export interface LocationPayload {
  country: string;
  countryCode: string;
  stateOrRegion: string;
  district: string;
  street: string;
  streetNumber: string;
  apartment: string;
  postalCode: string;
  fullAddress: string;
}

export interface AddressInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export interface PropertyDetailsSectionProps {
  apartmentNumber?: string;
  numberOfRooms?: string;
  numberOfOccupants?: string;
  onChange: (
    field: "apartmentNumber" | "numberOfRooms" | "numberOfOccupants",
    value: string
  ) => void;
}
export interface RatingComponentProps {
  data: {
    valueForMoney?: number;
    overallExperience?: number;
    costOfRepairs?: string;
    detailedReview?: string;
  };
  onChange: (field: string, value: any) => void;
  className?: string;
  title?: string;
  description?: string;
}
export interface MoveOutDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export interface ToggleCardProps {
  title: string;
  description: string;
  questionText: string;
  fieldName: string;
  checked?: boolean;
  onChange: (field: string, value: boolean) => void;
  className?: string;
}

export interface AgentBrokerFeesData {
  agentFeeRequired?: boolean;
}

export interface AgentBrokerFeesToggleProps {
  data: AgentBrokerFeesData;
  onChange: (field: string, value: boolean) => void;
  className?: string;
  title?: string;
  description?: string;
  questionText?: string;
}

export interface SecurityDepositData {
  securityDepositRequired?: boolean;
}

export interface SecurityDepositToggleProps {
  data: SecurityDepositData;
  onChange: (field: string, value: boolean) => void;
  className?: string;
  title?: string;
  description?: string;
  questionText?: string;
}

export interface RentData {
  rentType?: "actual" | "range";
  yearlyRent?: string;
}

export interface RentInputProps {
  data: RentData;
  onChange: (field: string, value: string) => void;
  className?: string;
  title?: string;
  description?: string;
  label?: string;
  placeholder?: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface ReviewsSectionProps {
  initialReviews?: ReviewData[];
  initialSortOption?: string;
}

export interface Category {
  id: number;
  title: string;
  image: string;
}
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}
export interface SortComponentProps {
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (option: SortOption) => void;
}
export interface AllReviewsProps {
  className?: string;
  showHeader?: boolean;
  maxItems?: number;
  gridCols?: string;
}

export interface Listing {
  id: string;
  imageUrl: string;
  verified: boolean;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
  size: string;
  oldPrice: string;
  newPrice: string;
}

export interface FeaturedReview {
  id: string;
  searchTerm?: string;
  imageUrl: string;
  verified?: boolean;
  address: string;
  rating: number;
  reviewCount: number;
  comment: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  date: string;
}

export interface SignUpButtonProps {
  isSubmitting: boolean;
}
export interface SignInButtonProps {
  isSubmitting: boolean;
}

export interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
  onClick?: () => void;
  callbackUrl?: string;
}

export interface ResetPasswordFormProps {
  onSubmit: SubmitHandler<FormValues>;
}
export interface RoleSubmissionData {
  role: "renter" | "homeowner" | "agent";
}

export interface RoleSubmissionResponse {
  token?: string;
  authToken?: string;
  accessToken?: string;
  message?: string;
  role?: string;
  [key: string]: any;
}

export interface OnboardingStatusResponse {
  currentUserStatus: {
    role: any;
    _id: string;
    isOnboarded: boolean;
  };
  message: string;
}

export interface SignInResponse {
  user: {
    _id: string;
    firstName: string;
    email: string;
    role?: string;
    isOnboarded?: boolean;
  };
  token?: string;
  accessToken?: string;
  message: string;
}

export interface OnboardingStatusResponse {
  currentUserStatus: {
    role: any;
    _id: string;
    isOnboarded: boolean;
  };
  message: string;
}

export declare type FormData = {
  code: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export interface StayDetails {
  numberOfRooms: number;
  numberOfOccupants: number;
  dateLeft: string;
  furnished: boolean;
  appliancesFixtures: string[];
  buildingFacilities: string[];
  landlordLanguages: string[];
}

export interface CostDetails {
  rent: {
    amount: number;
    currency: string;
  };
  rentType: string;
  securityDepositRequired: boolean;
  agentBrokerFeeRequired: boolean;
  fixedUtilityCost: boolean;
  julySummerUtilities: number;
  januaryWinterUtilities: number;
}

export interface Accessibility {
  nearestGroceryStore: "Very Close" | "Close" | "Moderate" | "Far";
  nearestPark: "Very Close" | "Close" | "Moderate" | "Far";
  nearestRestaurant: "Very Close" | "Close" | "Moderate" | "Far";
}

export interface RatingsAndReviews {
  valueForMoney: number;
  costOfRepairsCoverage: "Landlord" | "Tenant" | "Shared";
  overallExperience: number;
  overallRating: number;
  detailedReview: string;
}

export declare type ReviewFormData = {
  stayDetails: StayDetails;
  costDetails: CostDetails;
  accessibility: Accessibility;
  ratingsAndReviews: RatingsAndReviews;
  submitAnonymously: boolean;
};

export interface SignUpFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isSubmitting: boolean;
  password: string;
}

export interface SignInFormProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: FieldErrors<FormData>;
  isAdmin?: boolean;
}

// types/blog.ts
export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
  slug?: string;
  publishedAt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  readTime?: number;
  tags?: string[];
}

export interface BlogPageProps {
  articles: Article[];
  featuredArticle?: Article;
}

export interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onSubmit?: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
  currentStep?: number;
  totalSteps?: number;
}

export interface userLocationData {
  countryCode: string;
  countryName: string;
}

export type PropertyCategory = "Swap" | "Rent" | "Buy";

export interface FavoriteItem {
  _id: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    displayOnMap: boolean;
    country: string;
    stateOrRegion: string;
    district: string;
    postalCode: string;
    street: string;
    countryCode: string;
    apartment: string;
    fullAddress: string;
  };
  media: {
    coverPhoto: string;
    uploads: Array<{
      url: string;
      type: string;
      _id: string;
    }>;
  };
  propertyDetails: {
    price: number;
    notForCreditSale: boolean;
    readyToCooperateWithAgents: boolean;
    possibleExchange: boolean;
    currency: string;
    negotiatedPrice: boolean;
    amenities: string[];
    infrastructure: string[];
    totalFloors: number;
    floor: number;
    totalAreaSqM: number;
    livingAreaSqM: number;
    kitchenAreaSqM: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpots: number;
    description: string;
  };
  listingDuration: {
    startDate: string;
    quickSelect: string;
    endDate: string;
  };
  contactInfo: {
    openForTourSchedule: boolean;
    typeOfOffer: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  adPromotion: {
    certifiedByFinder: boolean;
    liftsToTopCount: number;
    detailedAnalytics: boolean;
    selectedTier: string;
  };
  deactivationMeta: {
    location: string | null;
    reason: string;
    customNote: string | null;
    date: string;
  };
  lister: string;
  category: "Swap" | "Rent" | "Sale";
  propertyType: string;
  condition: string;
  petPolicy: string;
  isAvailable: boolean;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FavoritesResponse {
  favorites: FavoriteItem[];
  message: string;
}
