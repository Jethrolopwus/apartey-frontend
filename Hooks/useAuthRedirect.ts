"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetOnboardingStatusQuery } from "@/Hooks/get-onboardingStatus.query";
import { TokenManager } from "@/utils/tokenManager";

interface PendingReviewData {
  stayDetails: any;
  costDetails: any;
  accessibility: any;
  ratingsAndReviews: any;
  submitAnonymously: boolean;
  location?: any;
}

interface UseAuthRedirectReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPendingData: boolean;
  pendingReviewData: PendingReviewData | null;
  handleAuthRedirect: (formData: PendingReviewData) => void;
  handlePostLoginRedirect: () => void;
  clearPendingData: () => void;
  submitPendingReview: (data: PendingReviewData) => Promise<void>;
  checkAuthentication: () => boolean;
}

export const useAuthRedirect = (
  submitReviewMutation?: any
): UseAuthRedirectReturn => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingData, setHasPendingData] = useState(false);
  const [pendingReviewData, setPendingReviewData] =
    useState<PendingReviewData | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: onboardingStatus, isLoading: isOnboardingLoading } =
    useGetOnboardingStatusQuery();

  const checkAuthentication = useCallback((): boolean => {
    try {
      return TokenManager.hasToken();
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const authStatus = checkAuthentication();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    const checkPendingData = () => {
      if (typeof window === "undefined") return;
      try {
        const storedData = localStorage.getItem("pendingReviewData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPendingReviewData(parsedData);
          setHasPendingData(true);
        } else {
          setPendingReviewData(null);
          setHasPendingData(false);
        }
      } catch (error) {
        console.error("Error parsing pending review data:", error);
        localStorage.removeItem("pendingReviewData");
        setPendingReviewData(null);
        setHasPendingData(false);
      }
    };

    checkAuthStatus();
    checkPendingData();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        ["authToken", "token", "accessToken", "userSession"].includes(
          e.key || ""
        )
      ) {
        checkAuthStatus();
      }
      if (e.key === "pendingReviewData") {
        checkPendingData();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, [checkAuthentication]);

  const handleAuthRedirect = useCallback(
    (formData: PendingReviewData) => {
      try {
        const structuredData = {
          stayDetails: formData.stayDetails || {},
          costDetails: formData.costDetails || {},
          accessibility: formData.accessibility || {},
          ratingsAndReviews: formData.ratingsAndReviews || {},
          submitAnonymously: formData.submitAnonymously || false,
          location: formData.location || {},
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pendingReviewData",
            JSON.stringify(structuredData)
          );
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
        }
        setPendingReviewData(structuredData);
        setHasPendingData(true);

        router.push("/signin");
      } catch (error) {
        console.error("Error storing form data:", error);
        router.push("/signin");
      }
    },
    [router]
  );

  const handlePostLoginRedirect = useCallback(() => {
    try {
      if (isRedirecting) {
        return;
      }

      setIsRedirecting(true);

      let redirectPath: string | null = null;
      let authMode: string | null = null;
      let hasPendingReviewData: string | null = null;
      let hasCompletedOnboarding: string | null = null;

      if (typeof window !== "undefined") {
        redirectPath = localStorage.getItem("redirectAfterLogin");
        authMode = localStorage.getItem("authMode");
        hasPendingReviewData = localStorage.getItem("pendingReviewData");
        hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
      }

      // Debug information removed for production

      let finalRedirect;

      if (authMode === "signup") {
        finalRedirect = "/onboarding";
      } else if (hasPendingReviewData) {
        try {
          const pendingData = JSON.parse(hasPendingReviewData || "{}");
          if (redirectPath && redirectPath.includes("/write-reviews/listed/")) {
            const pathParts = redirectPath.split("/");
            const propertyId = pathParts[pathParts.length - 1];
            finalRedirect = `/write-reviews/listed/${propertyId}`;
          } else {
            finalRedirect = "/write-reviews/unlisted";
          }
        } catch (error) {
          console.error("Error parsing pending review data:", error);
          finalRedirect = "/write-reviews/unlisted";
        }
      } else if (
        redirectPath &&
        !["/signin", "/login", "/onboarding"].includes(redirectPath)
      ) {
        finalRedirect = redirectPath;
      } else {
        const role =
          typeof window !== "undefined"
            ? localStorage.getItem("userRole") ||
              onboardingStatus?.currentUserStatus?.role ||
              "renter"
            : onboardingStatus?.currentUserStatus?.role || "renter";
        
        // Check if user has completed onboarding
        const hasCompletedOnboardingLocal = hasCompletedOnboarding === "true";
        const hasCompletedOnboardingBackend = onboardingStatus?.currentUserStatus?.isOnboarded === true;
        
        // For signin users (both traditional and Google OAuth), assume they have completed onboarding
        // since they already have an account
        if (authMode === "signin") {
          // Redirect based on user role
          if (role === "homeowner") {
            finalRedirect = "/landlord";
          } else if (role === "agent") {
            finalRedirect = "/agent-profile";
          } else {
            finalRedirect = "/profile";
          }
        } else if (!hasCompletedOnboardingLocal && !hasCompletedOnboardingBackend) {
          finalRedirect = "/onboarding";
        } else {
          // Redirect based on user role
          if (role === "homeowner") {
            finalRedirect = "/landlord";
          } else if (role === "agent") {
            finalRedirect = "/agent-profile";
          } else {
            finalRedirect = "/profile";
          }
        }
      }

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== finalRedirect
      ) {
        // Add a small delay to ensure token is properly set
        setTimeout(() => {
          router.push(finalRedirect);
        }, 200);
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("authMode");
      }
      setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
    } catch (error) {
      console.error("Error handling post-login redirect:", error);
      setIsRedirecting(false);
      router.push("/");
    }
  }, [
    isRedirecting,
    router,
    hasPendingData,
    onboardingStatus,
    isOnboardingLoading,
  ]);

  const clearPendingData = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingReviewData");
      }
      setPendingReviewData(null);
      setHasPendingData(false);
    } catch (error) {
      console.error("Error clearing pending data:", error);
    }
  }, []);

  const submitPendingReview = useCallback(
    async (data: PendingReviewData) => {
      try {
        if (!submitReviewMutation) {
          console.warn("No submit review mutation provided");
          return;
        }
        await submitReviewMutation.mutateAsync(data);
        clearPendingData();
        
        // Redirect based on user role
        const userRole = localStorage.getItem("userRole");
        if (userRole === "homeowner") {
          router.push("/landlord");
        } else if (userRole === "agent") {
          router.push("/agent-profile");
        } else {
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error submitting pending review:", error);
        throw error;
      }
    },
    [submitReviewMutation, clearPendingData, router]
  );

  return {
    isAuthenticated,
    isLoading,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    handlePostLoginRedirect,
    clearPendingData,
    submitPendingReview,
    checkAuthentication,
  };
};
