import { verify } from "crypto";


export default Object.freeze({
    signin: "/auth/signin",
    signup: "/auth/signup",
    verifyEmail: "/auth/verify-email",
    resendCode: "/auth/resend-token",
    resetPassword: "/auth/reset-password",
    searchReviews: "/reviews/search?fullAddress=abuja",
    getAllReviews: "/reviews"
});