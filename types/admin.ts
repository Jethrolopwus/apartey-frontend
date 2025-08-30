export interface DailyRevenue {
  day: string;
  revenue: number;
}

export interface GrowthData {
  value: number;
  isIncrease: boolean;
}

export interface SwapSaleData {
  count: number;
  change: GrowthData;
}

export interface CompletedData {
  total: number;
  rents: number;
  sales: number;
  swaps: number;
}

export interface GrowthStats {
  totalUsers: GrowthData;
  newUsers: GrowthData;
  totalProperties: GrowthData;
  activeListings: GrowthData;
  swaps: SwapSaleData;
  sales: SwapSaleData;
}

export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalProperties: number;
  activeListings: number;
  dailyRevenue: DailyRevenue[];
  growth: GrowthStats;
  completed: CompletedData;
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

export interface UserDistributionByMonth {
  month: string;
  homeowner: number;
  renter: number;
}

export interface CompletionDistribution {
  type: string;
  count: number;
}

export interface RecentCompleted {
  _id: string;
  lister: {
    _id: string;
    firstName: string;
    email: string;
  };
  category: string;
  propertyType: string;
  condition: string;
  petPolicy: string;
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
    currency: string;
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
  isAvailable: boolean;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deactivationMeta?: {
    reason: string;
    customNote: string | null;
    date: string;
  };
}

export interface AdminTrends {
  userDistribution: UserDistribution[];
  userDistributionByMonth: UserDistributionByMonth[];
  propertyTypes: PropertyType[];
  countrySales: CountrySale[];
  monthlyUserTrend: MonthlyUserTrend[];
  completionDistribution: CompletionDistribution[];
  recentCompleted: RecentCompleted[];
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
  page?: number;
  search?: string;
  sort?: "newest" | "oldest";
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
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
  search?: string;
  sort?: "newest" | "oldest";
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
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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

// ==== ADMIN BLOG POST INTERFACES ====

export interface AdminPostAuthor {
  _id: string;
  firstName: string;
  email: string;
}

export interface AdminPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  views: number;
  likes: string[];
  tags: string[];
  status: "published" | "draft" | "archived";
  archived: boolean;
  author: AdminPostAuthor;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminPostsResponse {
  posts: AdminPost[];
  pagination: Pagination;
}

export interface useGetAdminAllBlogPostQueryParams {
  limit?: number;
  byId?: number;
  page?: number;
  search?: string;
  sort?: "newest" | "oldest" | "most-liked" | "most-viewed";
  status?: "Published" | "Draft" | "Archived";
}

export interface useGetAdminAllPropertiesQueryParams {
  limit?: number;
  byId?: number;
  page?: number;
  search?: string;
  sort?: "newest" | "oldest";
}

export interface CreateAdminPostData {
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  excerpt?: string;
  category: 'Renting' | 'Selling' | 'Buying' | 'Investment' | 'Maintenance' | 'Tips' | 'News';
  imageUrl?: string;
  image?: File;
}

export interface UpdateAdminPostData extends Partial<CreateAdminPostData> {
  id: string;
}


