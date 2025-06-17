import { verify } from "crypto";
import { get } from "http";

export default Object.freeze({
  signin: "/auth/signin",
  signup: "/auth/signup",
  verifyEmail: "/auth/verify-email",
  resendCode: "/auth/resend-token",
  resetPassword: "/auth/reset-password",
  addRoles: "/user/role",
  getUsersRole: "/user/role",
  getUserProfile: "user/profile",
  getProfileCompletionStat: "/user/profile-completion",
  writeReviews: (id: string) => `reviews/${id}`,
  writeUnlistedReview: "/reviews/unlisted",
  searchReviews: "/reviews/search?fullAddress=abuja",
  getAllReviews: "/reviews",
  getReviewById: (id: string) => `/reviews/${id}`,
  getRelatedReviews: (id: string) => `/reviews/${id}`,
  createListing: "/listings",
  getAllListings: "/listings",
  getListingById: (id: string) => `/listings/${id}`,
  getRelatedListing: (id: string) => `/listings/${id}`,
});
