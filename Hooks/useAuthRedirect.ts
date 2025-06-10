
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenManager } from '@/utils/tokenManager'; 

interface PendingReviewData {
  stayDetails: any;
  costDetails: any;
  accessibility: any;
  ratingsAndReviews: any;
  submitAnonymously: boolean;
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
  const [pendingReviewData, setPendingReviewData] = useState<PendingReviewData | null>(null);

  // Function to check authentication status using TokenManager
  const checkAuthentication = (): boolean => {
    try {
      return TokenManager.hasToken();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };


  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const authStatus = checkAuthentication();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    const checkPendingData = () => {
      try {
        const storedData = localStorage.getItem('pendingReviewData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPendingReviewData(parsedData);
          setHasPendingData(true);
          console.log('Found pending review data:', parsedData);
        } else {
          setPendingReviewData(null);
          setHasPendingData(false);
        }
      } catch (error) {
        console.error('Error parsing pending review data:', error);
        // Clear corrupted data
        localStorage.removeItem('pendingReviewData');
        setPendingReviewData(null);
        setHasPendingData(false);
      }
    };

   
    checkAuthStatus();
    checkPendingData();

    const handleStorageChange = (e: StorageEvent) => {
      if (['authToken', 'token', 'accessToken', 'userSession'].includes(e.key || '')) {
        checkAuthStatus();
      }
      if (e.key === 'pendingReviewData') {
        checkPendingData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAuthRedirect = (formData: PendingReviewData) => {
    try {
      console.log('Storing form data and redirecting to login:', formData);
      
      localStorage.setItem('pendingReviewData', JSON.stringify(formData));
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      setPendingReviewData(formData);
      setHasPendingData(true);
      
      router.push('/signin');
    } catch (error) {
      console.error('Error storing form data:', error);
      router.push('/signin');
    }
  };

  // const handlePostLoginRedirect = () => {
  //   try {
  //     const redirectPath = localStorage.getItem('redirectAfterLogin');
      
  //     localStorage.removeItem('redirectAfterLogin');
      
  //     if (redirectPath && redirectPath !== '/signin' && redirectPath !== '/login') {
    
  //       router.push(redirectPath);
  //     } else {
  //       router.push('/dashboard');
  //     }
  //   } catch (error) {
  //     console.error('Error handling post-login redirect:', error);
    
  //     router.push('/dashboard');
  //   }
  // };
  
  const handlePostLoginRedirect = () => {
    try {
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
  
      const finalRedirect = redirectPath && !["/signin", "/login"].includes(redirectPath)
        ? redirectPath
        : "/dashboard";
  
      if (window.location.pathname !== finalRedirect) {
        router.push(finalRedirect);
      }
    } catch (error) {
      console.error("Error handling post-login redirect:", error);
      router.push("/dashboard");
    }
  };
  
  const clearPendingData = () => {
    try {
      localStorage.removeItem('pendingReviewData');
      setPendingReviewData(null);
      setHasPendingData(false);
      console.log('Cleared pending review data');
    } catch (error) {
      console.error('Error clearing pending data:', error);
    }
  };

  const submitPendingReview = async (data: PendingReviewData) => {
    try {
      if (!submitReviewMutation) {
        console.warn('No submit review mutation provided');
        return;
      }

      console.log('Submitting pending review:', data);
      
      await submitReviewMutation.mutateAsync(data);
      
      clearPendingData();
      
      console.log('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting pending review:', error);
      throw error; 
    }
  };

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