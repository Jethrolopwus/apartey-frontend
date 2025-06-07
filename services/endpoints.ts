import { verify } from "crypto";
import { get } from "http";


export default Object.freeze({
    signin: "/auth/signin",
    signup: "/auth/signup",
    verifyEmail: "/auth/verify-email",
    resendCode: "/auth/resend-token",
    resetPassword: "/auth/reset-password",
    addRoles: "/users/role",
    writeReviews: "reviews/683d5058508fe0ecab1b628e",
    writeUnlistedReview: "/reviews/unlisted",
    searchReviews: "/reviews/search?fullAddress=abuja",
    getAllReviews: "/reviews",
    getReviewById: (id: string) => `/reviews/${id}`,
    getAllListings: "/listings",
    getListingById: (id: string) => `/listings/${id}`,

});