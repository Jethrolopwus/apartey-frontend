export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalProperties: number;
  activeListings: number;
  totalRevenue: number;
}

export interface UserDistribution {
  _id: string;
  count: number;
}

export interface PropertyType {
  count: number;
  name: string;
}

export interface CountrySale {
  country: string;
  listings: number;
}

export interface MonthlyUserTrend {
  month: string;
  count: number;
}

export interface AdminTrends {
  userDistribution: UserDistribution[];
  propertyTypes: PropertyType[];
  countrySales: CountrySale[];
  monthlyUserTrend: MonthlyUserTrend[];
}

export interface AdminOverviewResponse {
  stats: AdminStats;
  trends: AdminTrends;
}

export interface AdminProperty {
  id: string;
  title: string;
  addedDate: string;
  type: string;
  location: string;
  price: string;
  status: string;
  lister: string;
}

export interface AdminPropertiesResponse {
  properties: AdminProperty[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  role: string;
  status: string;
  email: string;
  createdAt: string;
  propertiesCount: number;
  Deactivated: boolean;
}
export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface UseGetAllAdminUsersQueryParams {
  limit?: number;
  byId?: number;
}

// ==== ADMIN REVIEWS INTERFACES ====

export interface AdminReviewsResponse {
  reviews: AdminReviews[];
  pagination: Pagination;
}

export interface SearchQueryParams {
  page?: number;
  limit?: number;
  status?: "verified" | "flagged" | "flaaged";
  rating?: string;
  reviewer?: string;
  property?: string;
  startDate?: string;
  endDate?: string;
}
export interface AdminReviews {
  id: string;
  property: string | undefined;
  reviewer: string | undefined;
  rating: string | undefined;
  status: "verified" | "flagged" | "flaaged" | undefined;
  comment: string | undefined;
  date: string | undefined;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminReviewsResponse {
  reviews: AdminReviews[];
  pagination: Pagination;
}

export interface GetAllUserQueryParams {
  page?: number;
  limit?: number;
  reviewer?: string;
  userId?: string;
  byId?: string;
  status?: "verified" | "flagged" | "flaaged";
  rating?: string;
  sortBy?: "date" | "rating" | "reviewer";
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

// ==== ADMIN CLAIM PROPERTY INTERFACES ====//

export interface Location {
  fullAddress: string;
}

export interface PropertyDetails {
  description: string;
}

export interface Property {
  _id: string;
  location: Location;
  propertyDetails: PropertyDetails;
}

export interface Claimant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiClaimResponse {
  _id: string;
  property: Property;
  claimant: Claimant;
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  district: string;
  stateOrRegion: string;
  postalCode: string;
  cadastralNumber: string;
  additionalInfo: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AdminClaimedProperty {
  id: string;
  propertyDescription: string;
  propertyId: string;
  address: string;
  claimant: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  message: string;
  proof?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminClaimedPropertiesResponse {
  claims: AdminClaimedProperty[];
  pagination: Pagination;
}

export interface UseClaimPropertyQueryParams {
  page?: number;
  limit?: number;
}

// ==== ADMIN ANALYTICS INTERFACES ====

export interface AdminAnalyticsTotals {
  totalRevenue: number;
  views: number;
  newUsers: number;
  reviews: number;
}

export interface AdminAnalyticsGrowth {
  registrations: {
    value: number;
    isIncrease: boolean;
  };
  reviews: {
    value: number;
    isIncrease: boolean;
  };
  propertiesListed: {
    value: number;
    isIncrease: boolean;
  };
}

export interface AdminAnalyticsMetrics {
  averageRent: number;
  activeUsers: number;
  responseRate: number;
  customerSatisfaction: number;
  propertiesListed: number;
}

export interface AdminAnalyticsDistribution {
  type: string;
  count: number;
}

export interface AdminAnalyticsTrendData {
  label: string;
  count: number;
}

export interface AdminAnalyticsRevenueData {
  month: string;
  total: number;
}

export interface AdminAnalyticsTrends {
  userGrowth: AdminAnalyticsTrendData[];
  revenue: AdminAnalyticsRevenueData[];
}

export interface AdminAnalyticsResponse {
  totals: AdminAnalyticsTotals;
  growth: AdminAnalyticsGrowth;
  metrics: AdminAnalyticsMetrics;
  distribution: AdminAnalyticsDistribution[];
  trends: AdminAnalyticsTrends;
}

// ==== ADMIN PROFILE UPDATE INTERFACES ====

export interface AdminProfileUpdateData {
  profilePicture?: File;
}

export interface AdminProfileUpdateResponse {
  message: string;
  profilePicture?: string;
}
