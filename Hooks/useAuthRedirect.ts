"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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

  // Function to check authentication status using TokenManager
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
        // Clear corrupted data
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

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuthentication]);

  const handleAuthRedirect = useCallback((formData: PendingReviewData) => {
    try {
      console.log("=== handleAuthRedirect called ===");
      console.log("Form data to store:", formData);

      // Structure the data properly for the form
      const structuredData = {
        stayDetails: formData.stayDetails || {},
        costDetails: formData.costDetails || {},
        accessibility: formData.accessibility || {},
        ratingsAndReviews: formData.ratingsAndReviews || {},
        submitAnonymously: formData.submitAnonymously || false,
        location: formData.location || {},
      };

      console.log("Structured data:", structuredData);
      console.log("Current pathname:", window.location.pathname);

      localStorage.setItem("pendingReviewData", JSON.stringify(structuredData));
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setPendingReviewData(structuredData);
      setHasPendingData(true);

      console.log("Data stored in localStorage. Redirecting to signin...");
      router.push("/signin");
    } catch (error) {
      console.error("Error storing form data:", error);
      router.push("/signin");
    }
  }, [router]);

  const handlePostLoginRedirect = useCallback(() => {
    try {
      // Prevent multiple calls
      if (isRedirecting) {
        console.log("Already redirecting, skipping...");
        return;
      }
      
      setIsRedirecting(true);
      console.log("=== handlePostLoginRedirect called ===");
      
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      console.log("Stored redirectPath:", redirectPath);
      localStorage.removeItem("redirectAfterLogin");

      // Check if there's pending review data
      const hasPendingReviewData = localStorage.getItem("pendingReviewData");
      console.log("hasPendingData state:", hasPendingData);
      console.log("hasPendingReviewData from localStorage:", hasPendingReviewData);
      
      let finalRedirect;
      
      if (hasPendingReviewData) {
        try {
          const pendingData = JSON.parse(hasPendingReviewData);
          console.log("Parsed pending data:", pendingData);
          
          // Check if this is a listed property review (has an id in the redirect path)
          if (redirectPath && redirectPath.includes('/write-reviews/listed/')) {
            // Extract the property ID from the redirect path
            const pathParts = redirectPath.split('/');
            const propertyId = pathParts[pathParts.length - 1];
            finalRedirect = `/write-reviews/listed/${propertyId}`;
            console.log("Found pending listed property review data, redirecting to:", finalRedirect);
          } else {
            // Default to unlisted property review
            finalRedirect = "/write-reviews/unlisted";
            console.log("Found pending unlisted property review data, redirecting to write-reviews/unlisted");
          }
        } catch (error) {
          console.error("Error parsing pending review data:", error);
          finalRedirect = "/write-reviews/unlisted";
        }
      } else if (redirectPath && !["/signin", "/login"].includes(redirectPath)) {
        // If there's a specific redirect path and it's not a login page, use it
        finalRedirect = redirectPath;
        console.log("Using stored redirect path:", finalRedirect);
      } else {
        // Default redirect to profile
        finalRedirect = "/profile";
        console.log("No pending data or redirect path, going to profile");
      }

      console.log("Final redirect destination:", finalRedirect);
      console.log("Current pathname:", window.location.pathname);

      if (window.location.pathname !== finalRedirect) {
        console.log("Redirecting to:", finalRedirect);
        router.push(finalRedirect);
      } else {
        console.log("Already on target page, no redirect needed");
      }
      
      // Reset the redirecting flag after a delay
      setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
    } catch (error) {
      console.error("Error handling post-login redirect:", error);
      setIsRedirecting(false);
      router.push("/profile");
    }
  }, [isRedirecting, router]);

  const clearPendingData = useCallback(() => {
    try {
      localStorage.removeItem("pendingReviewData");
      setPendingReviewData(null);
      setHasPendingData(false);
      console.log("Cleared pending review data");
    } catch (error) {
      console.error("Error clearing pending data:", error);
    }
  }, []);

  const submitPendingReview = useCallback(async (data: PendingReviewData) => {
    try {
      if (!submitReviewMutation) {
        console.warn("No submit review mutation provided");
        return;
      }

      console.log("Submitting pending review:", data);

      await submitReviewMutation.mutateAsync(data);

      clearPendingData();

      console.log("Review submitted successfully, redirecting to profile");
      
      // Redirect to profile after successful submission
      router.push("/profile");
    } catch (error) {
      console.error("Error submitting pending review:", error);
      throw error;
    }
  }, [submitReviewMutation, clearPendingData, router]);

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
