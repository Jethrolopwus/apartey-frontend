export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalProperties: number;
  activeListings: number;
  dailyRevenue: any;
  growth: any;
  completed: any;
  trends: any;
}

export interface RecentCompleted {
  _id: string;
  lister: {
    _id: string;
    firstName: string;
    email: string;
  };
  category: "Sale" | "Rent" | "Swap" | string;
  propertyType: string;
  location: {
    fullAddress: string;
  };
  propertyDetails: {
    price: {
      currency: string;
      salePrice?: number;
      rentPrice?: number;
    };
    description: string;
  };
  deactivationMeta: {
    reason: string;
    location: string | null;
    customNote: string | null;
    date: string;
  };
}

export interface monthlyCompletedCategoryTrend {
  month: string;
  Swap: number;
  Rent: number;
  Sale: number;
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
  userDistributionByMonth: any;
  completionDistribution: any;
  recentCompleted: any;
  monthlyCompletedCategoryTrend: any;
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
  category: string;
  location: string;
  price: string;
  status: string;
  claimed: string;
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
  joinDate?: string;
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
  status?: "verified" | "flagged";
  rating?: string;
  reviewer?: string;
  property?: string;
  startDate?: string;
  endDate?: string;
}

type Reasons = {
  reason: string;
  otherText: string;
  count: number;
};
export interface AdminReviews {
  id: string;
  property: string | undefined;
  reviewer: string | undefined;
  rating: string | undefined;
  status: "verified" | "flagged" | undefined;
  comment: string | undefined;
  date: string | undefined;
  flaggedByCount?: number;
  likedByCount?: number;
  flaggingReasons?: Reasons[];
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
  cadastralNumber?: string;
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
  cadastralNumber?: string;
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
  page: number;
  limit: number;
  sortBy: string | "newest" | "oldest";
  search?: string;
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
  revenue: {
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

export interface AdminPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    firstName: string;
  };
  category:
    | "Renting"
    | "Selling"
    | "Buying"
    | "Investment"
    | "Maintenance"
    | "Tips"
    | "News";
  views: number;
  archived: boolean;
  likes: string[];
  tags: string[];
  status: "draft" | "published";
  likesCount: number;
  publishedAt: Date;
  draftedAt: Date;
  archivedAt: Date;
  image: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  sortBy?: string; // e.g. "createdAt", "likes", etc.
  order?: "asc" | "desc";
  status?: "published" | "draft";
}

export interface useGetAdminAllPropertiesQueryParams {
  limit?: number;
  byId?: number;
  page?: number;
  search?: string;
  sortBy?: "newest" | "oldest";
}

export interface CreateAdminPostData {
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published";
  excerpt?: string;
  category:
    | "Renting"
    | "Selling"
    | "Buying"
    | "Investment"
    | "Maintenance"
    | "Tips"
    | "News";
  imageUrl?: string;
  image?: File;
}

export interface UpdateAdminPostData extends Partial<CreateAdminPostData> {
  id: string;
}
