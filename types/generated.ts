import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";

export interface FormValues {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ReviewLocation {
  streetAddress: any;
  district: string;
  city: string;
  lat: number;
  lng: number;
}
export interface UseGetAllReviewsQueryParams {
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}
export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}


// Add these types to your types/generated.ts file

export interface PropertyLocation {
  displayOnMap: boolean;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  streetAddress: string;
}

export interface PropertyMedia {
  coverPhoto: string;
  uploads: {
    url: string;
    type: 'image' | 'video';
    _id: string;
  }[];
}

export interface PropertyDetails {
  negotiatedPrice: boolean;
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
  location: PropertyLocation;
  media: PropertyMedia;
  propertyDetails: PropertyDetails;
  contactInfo: ContactInfo;
  adPromotion: AdPromotion;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PropertiesResponse {
  message: string;
  properties: Property[];
  currentPage: number;
  totalPages: number;
  totalProperties: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
export interface Review {
  _id: string;
  submitAnonymously: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  location: {
    country: string;
    city: string;
    district: string;
    zipCode?: string;
    streetAddress: string;
    apartmentUnitNumber?: string;
    displayOnMap?: boolean;
  };
  overallRating: number;
  detailedReview: string;
  valueForMoney: number;
  costOfRepairsCoverage: string;
  overallExperience: number;
  linkedProperty: {
    _id: string;
    propertyType: string;
    location: {
      country: string;
      city: string;
      district: string;
      zipCode: string;
      streetAddress: string;
      displayOnMap: boolean;
    };
    price: number;
    bedrooms: number;
    bathrooms: number;
    media: {
      coverPhoto: string;
      videoTourLink: string;
    };
  } | null;
  isLinkedToDatabaseProperty: boolean;
  reviewer: {
    _id: string;
  };
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
  rent: number;
  rentType: "Monthly" | "Yearly";
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