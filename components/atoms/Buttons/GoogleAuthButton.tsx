'use client'

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GoogleAuthButtonProps } from '@/types/generated';
import { useGoogleAuthMutation } from '@/Hooks/use.googleAuth.mutation';
import { useGetOnboardingStatusQuery } from '@/Hooks/get-onboardingStatus.query';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';
import { log } from 'console';

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  mode, 
  onClick,
  callbackUrl = '/profile' 
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google';
  
  const { mutate: googleAuth, isLoading: isGoogleAuthLoading } = useGoogleAuthMutation();
  const { data: onboardingStatus, isLoading: isOnboardingLoading, refetch: refetchOnboarding } = useGetOnboardingStatusQuery();

  // Backend sync if authenticated with Google but no backend token
  useEffect(() => {
    console.log('GoogleAuthButton useEffect:', { status, session, hasToken: TokenManager.hasToken() });
    if (
      status === 'authenticated' &&
      session?.user &&
      !TokenManager.hasToken()
    ) {
      console.log("calling Backend sync for Google auth", session.user);
      const googleData = {
        email: session.user.email || '',
        avatar: session.user.image || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      };
      googleAuth(googleData, {
        onSuccess: (response) => {
          console.log("Backend Response", response);
          if (response?.token) {
            console.log("About to set token in localStorage:", response.token);
            TokenManager.setToken(response.token, 'token');
            console.log("Token In LocalStorage after set (TokenManager):", TokenManager.getToken());
            console.log("Token In LocalStorage after set (direct):", localStorage.getItem('token'));
            if (response?.user?.email) {
              localStorage.setItem('email', response.user.email);

            }
            if(response?.token){
              localStorage.setItem("token", response.token)
            }
            refetchOnboarding();
            // Only redirect after token is set
            if (onboardingStatus?.currentUserStatus?.isOnboarded) {
              if (localStorage.getItem("pendingReviewData")) {
                router.push("/write-reviews/unlisted");
              } else {
                router.push(callbackUrl);
              }
            } else {
              router.push("/onboarding");
            }
          }
        },
        onError: (error) => {
          console.error('Google Auth mutation error:', error);
          toast.error('Backend authentication failed. Please try again.');
        }
      });
    }
  }, [status, session, googleAuth, refetchOnboarding, onboardingStatus, router, callbackUrl]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    await signIn('google');
    setIsLoading(false);
  };

  const isLoadingState = isLoading || isGoogleAuthLoading || isOnboardingLoading;

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={status === 'loading' || isLoadingState}
      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <img
        className="mr-2 h-5 w-5"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
      />
      {isLoadingState ? 'Authenticating...' : buttonText}
    </button>
  );
};

export default GoogleAuthButton;