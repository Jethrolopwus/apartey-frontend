import { verify } from "crypto";
import { get } from "http";

export default Object.freeze({
  signin: "/auth/signin",
  signup: "/auth/signup",
  verifyEmail: "/auth/verify-email",
  resendCode: "/auth/resend-token",
  resetPassword: "/auth/reset-password",
  googleAuth: "/auth/google",
  addRoles: "/user/role",
  getUsersRole: "/user/role",
  getUsersActivities: "/user/activities",
  getUsersFavorites: "/user/favorites",
  propertyToggleLike: (id: string) => `/user/favorites/${id}/toggle`,
  getAuthStatus: "/auth",
  getOnboardingStatus: "user/onboarding/status",
  updateOnboardingStatus: "user/onboarding",
  getUserProfile: "user/profile",
  contactUs: "/user/contact",
  getUserLocation: "/user/location",
  getProfileCompletionStat: "/user/profile-completion",
  updateProfile: "/user/profile",
  writeReviews: (id: string) => `reviews/${id}`,
  writeUnlistedReview: "/reviews/unlisted",
  searchReviews: "/reviews/search?fullAddress=abuja",
  getAllReviews: "/reviews",
  getAllProperties: "/listings?category=Swap",
  getAllBlogPost: "/blog",
  searchBlogPosts: "/blog/search",
  getAllNotifications: "/notifications",
  updateAllNotificationsAsRead: "/notifications/mark-all",
  updateNotificationAsRead: (id: string) => `/notifications/${id}/read`,
  deleteNotificationById: (id: string) => `/notifications/${id}`,
  getReviewById: (id: string) => `/reviews/${id}`,
  ReviewLikesToggle: (id: string) => `/reviews/${id}/likes`,
  flagReview: (id: string) => `/reviews/${id}/flag`,
  getBlogPostById: (id: string) => `/blog/${id}`,
  getRelatedReviews: (id: string) => `/reviews/${id}`,
  createListing: "/listings",
  getAllListings: "/listings",
  getAllMyListings: "/listings/user/my-listings",
  getInsightStats: "/stats/insight",
  claimProperties: (id: string) => `/listings/claim/${id}`,
  getClaimStatus: (id: string) => `/listings/claim/${id}`,
  getListingById: (id: string) => `/listings/${id}`,
  toggleListingAvailability: (id: string) => `/listings/${id}/availability`,
  getPropertiesById: (id: string) => `/properties/${id}`,

  getRelatedListing: (id: string) => `/listings/${id}`,

  // ====ADMIN ENDPOINTS=====//
  adminLogin: "/admin/auth/signin",

  getAdminOverviewStatus: "/admin/overview",
  getAdminProperties: "/admin/properties",
  getAdminPropertyById: (id: string) => `/admin/properties/${id}`,
  updateAdminProperty: (id: string) => `/admin/properties/${id}`,
  deleteAdminProperty: (id: string) => `/admin/properties/${id}`,
  // ==ADMINUSERS ENDPOINTS===//
  getAllAdminUsers: "/admin/users",
  getAdminUsersById: (id: string) => `/admin/users/${id}`,
  deactivateAdminUser: (id: string) => `/admin/users/${id}/status`,
  toggleAdminUserDeactivate: (id: string) => `/admin/users/${id}/status`,
  // ==ADMIN REVIEWS ENDPOINTS===//
  getAllAdminReviews: "/admin/reviews",
  getAdminReviewsById: (id: string) => `/admin/reviews/${id}`,
  deleteAdminReviewsById: (id: string) => `/admin/reviews/${id}`,

  // ==ADMIN CLAIM ENDPOINTS===//
  getAllAdminPropertyClaims: "/admin/claims",
  getAdminPropertyClaimDetails: (id: string) => `/admin/claims/${id}`,
  approvePropertyClaim:(claimId: string, propertyId: string) => `/admin/claims/${claimId}/${propertyId}/approve`,
  rejectPropertyClaim: (claimId: string, propertyId: string) =>
    `/admin/claims/${claimId}/${propertyId}/reject`,

  // ==ADMIN ANALYTICS ENDPOINTS===//
  getAdminAnalytics: "/admin/analytics",
  // ==ADMIN STATS ENDPOINTS===//
  updateProfilePic: "/admin/settings",
  // ==ADMIN GET ALL BLOG POSTS ENDPOINTS===//
  getAllAdminBlogPosts: "/admin/blog",
  createAdminBlogPost: "/admin/blog",
  getAdminBlogPostById: (id: string) => `/admin/blog/${id}`,
  archiveAdminBlogPostById: (id: string) => `/admin/blog/${id}/archive`,
  updateAdminBlogPost: (id: string) => `/admin/blog/${id}`,
  deleteAdminBlogPost: (id: string) => `/admin/blog/${id}`,
  // == PAYMENT ENDPOINTS===//
  adsPayment: (id: string) => `/payment/create-checkout-session/${id}`,
});
