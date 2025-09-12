"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AparteyLoader from "@/components/atoms/Loader";
import { useGetOnboardingStatusQuery } from "@/Hooks/get-onboardingStatus.query";
import { TokenManager } from "@/utils/tokenManager";

interface AuthStatusProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ 
  children, 
  requireAuth = true, 
  requireOnboarding = true 
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  const { data: onboardingStatus, isLoading: isOnboardingLoading } = useGetOnboardingStatusQuery();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (status === 'loading' || isOnboardingLoading) {
        return; // Still loading
      }

      if (status === 'unauthenticated') {
        if (requireAuth) {
          console.log('User not authenticated, redirecting to signin');
          router.push('/signin');
          return;
        }
      }

      if (status === 'authenticated' && session?.user) {
        console.log('User authenticated:', session.user);
        
        // Check if user has a valid token
        const hasToken = TokenManager.hasToken();
        console.log('Has token:', hasToken);
        
        if (!hasToken) {
          console.log('No token found, user needs to complete backend authentication');
          router.push('/signin');
          return;
        }

        // Check onboarding status if required
        if (requireOnboarding && onboardingStatus !== undefined) {
          console.log('Onboarding status:', onboardingStatus);
          
          if (!onboardingStatus?.currentUserStatus?.isOnboarded) {
            console.log('User needs onboarding, redirecting to onboarding');
            router.push('/onboarding');
            return;
          }
        }
      }

      setIsChecking(false);
    };

    checkAuthStatus();
  }, [status, session, onboardingStatus, isOnboardingLoading, requireAuth, requireOnboarding, router]);

  // Show loading state while checking authentication
  if (isChecking || status === 'loading' || isOnboardingLoading) {
    return <AparteyLoader />;
  }

  // If authentication is not required or user is authenticated, show children
  if (!requireAuth || (status === 'authenticated' && session?.user)) {
    return <>{children}</>;
  }

  // If we reach here, user is not authenticated and auth is required
  return null;
};

export default AuthStatus;