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
      console.log("Authentication status changed:", authStatus);
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
          console.log("Found pending review data:", parsedData);
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
        console.log("Token storage changed, rechecking auth status");
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
        console.log("=== handleAuthRedirect called ===");
        console.log("Form data to store:", formData);

        const structuredData = {
          stayDetails: formData.stayDetails || {},
          costDetails: formData.costDetails || {},
          accessibility: formData.accessibility || {},
          ratingsAndReviews: formData.ratingsAndReviews || {},
          submitAnonymously: formData.submitAnonymously || false,
          location: formData.location || {},
        };

        console.log("Structured data:", structuredData);
        console.log(
          "Current pathname:",
          typeof window !== "undefined" ? window.location.pathname : "server"
        );

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pendingReviewData",
            JSON.stringify(structuredData)
          );
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
        }
        setPendingReviewData(structuredData);
        setHasPendingData(true);

        console.log("Data stored in localStorage. Redirecting to signin...");
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
        console.log("Already redirecting, skipping...");
        return;
      }

      setIsRedirecting(true);
      console.log("=== handlePostLoginRedirect called ===");

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

      console.log("=== AUTH REDIRECT DEBUG ===");
      console.log("Stored redirectPath:", redirectPath);
      console.log("authMode:", authMode);
      console.log("hasPendingData state:", hasPendingData);
      console.log(
        "hasPendingReviewData from localStorage:",
        hasPendingReviewData
      );
      console.log("hasCompletedOnboarding from localStorage:", hasCompletedOnboarding);
      console.log("Onboarding Status from backend:", onboardingStatus);
      console.log("isOnboardingLoading:", isOnboardingLoading);
      console.log("=== END DEBUG ===");

      let finalRedirect;

      if (authMode === "signup") {
        console.log("Redirecting to /onboarding for signup");
        finalRedirect = "/onboarding";
      } else if (hasPendingReviewData) {
        try {
          const pendingData = JSON.parse(hasPendingReviewData || "{}");
          console.log("Parsed pending data:", pendingData);
          if (redirectPath && redirectPath.includes("/write-reviews/listed/")) {
            const pathParts = redirectPath.split("/");
            const propertyId = pathParts[pathParts.length - 1];
            finalRedirect = `/write-reviews/listed/${propertyId}`;
            console.log(
              "Found pending listed property review data, redirecting to:",
              finalRedirect
            );
          } else {
            finalRedirect = "/write-reviews/unlisted";
            console.log(
              "Found pending unlisted property review data, redirecting to write-reviews/unlisted"
            );
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
        console.log("Using stored redirect path:", finalRedirect);
      } else {
        const role =
          typeof window !== "undefined"
            ? localStorage.getItem("userRole") ||
              onboardingStatus?.currentUserStatus?.role ||
              "renter"
            : onboardingStatus?.currentUserStatus?.role || "renter";
        console.log("User role:", role);
        
        // Check if user has completed onboarding
        const hasCompletedOnboardingLocal = hasCompletedOnboarding === "true";
        const hasCompletedOnboardingBackend = onboardingStatus?.currentUserStatus?.isOnboarded === true;
        
        console.log("Local onboarding status:", hasCompletedOnboardingLocal);
        console.log("Backend onboarding status:", hasCompletedOnboardingBackend);
        
        if (!hasCompletedOnboardingLocal && !hasCompletedOnboardingBackend) {
          console.log(
            "Redirecting to /onboarding due to incomplete onboarding"
          );
          finalRedirect = "/onboarding";
        } else {
          // Redirect based on user role
          if (role === "homeowner") {
            finalRedirect = "/landlord";
            console.log("Redirecting to /landlord for homeowner role");
          } else if (role === "agent") {
            finalRedirect = "/agent-profile";
            console.log("Redirecting to /agent-profile for agent role");
          } else {
            finalRedirect = "/profile";
            console.log("Redirecting to /profile for renter role");
          }
        }
      }

      console.log("Final redirect destination:", finalRedirect);
      console.log(
        "Current pathname:",
        typeof window !== "undefined" ? window.location.pathname : "server"
      );

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== finalRedirect
      ) {
        console.log("Redirecting to:", finalRedirect);
        router.push(finalRedirect);
      } else {
        console.log("Already on target page, no redirect needed");
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
      console.log("Cleared pending review data");
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
        console.log("Submitting pending review:", data);
        await submitReviewMutation.mutateAsync(data);
        clearPendingData();
        console.log("Review submitted successfully, redirecting to role-specific profile");
        
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
