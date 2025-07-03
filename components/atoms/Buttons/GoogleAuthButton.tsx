'use client'

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GoogleAuthButtonProps } from '@/types/generated';
import { useGoogleAuthMutation } from '@/Hooks/use.googleAuth.mutation';
import { useGetOnboardingStatusQuery } from '@/Hooks/get-onboardingStatus.query';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  mode, 
  onClick,
  callbackUrl = '/profile' 
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google';
  
  const { mutate: googleAuth, isLoading: isGoogleAuthLoading } = useGoogleAuthMutation();
  const { data: onboardingStatus, isLoading: isOnboardingLoading, refetch: refetchOnboarding } = useGetOnboardingStatusQuery();
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'authenticated' && session?.user) {
        // Only set isAuthenticated if backend token is present
        const hasToken = TokenManager.hasToken();
        console.log('User is authenticated:', session.user);
        console.log('Has token:', hasToken);
        setIsAuthenticated(hasToken);
        if (!hasToken) {
          console.log('No token found, user needs to complete backend authentication');
          return;
        }
        // Refetch onboarding status to get the latest data
        await refetchOnboarding();
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [status, session, refetchOnboarding]);
  
  // Handle redirect after authentication and onboarding check
  useEffect(() => {
    // Only redirect if authenticated and token is present
    if (isAuthenticated && TokenManager.hasToken() && !isOnboardingLoading && onboardingStatus !== undefined) {
      console.log('Checking onboarding status:', onboardingStatus);
      if (onboardingStatus?.currentUserStatus?.isOnboarded) {
        if (localStorage.getItem("pendingReviewData")) {
          console.log('Found pending review data, redirecting to write-reviews/unlisted');
          router.push("/write-reviews/unlisted");
        } else {
          console.log('No pending data, redirecting to profile');
          router.push(callbackUrl);
        }
      } else {
        console.log('User needs onboarding, redirecting to onboarding page');
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isOnboardingLoading, onboardingStatus, router, callbackUrl]);
  
  // Ensure backend sync if authenticated with Google but no backend token
  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user &&
      !TokenManager.hasToken()
    ) {
      const googleData = {
        email: session.user.email || '',
        avatar: session.user.image || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      };
      console.log('Calling googleAuth mutation with:', googleData);
      googleAuth(googleData, {
        onSuccess: (response) => {
          console.log('Google backend response (auto-sync):', response);
          if (response?.token) {
            TokenManager.setToken(response.token, 'token');
            setIsAuthenticated(true);
            console.log('Token set in localStorage:', response.token);
            router.push('/profile');
          } else {
            console.error('No token in backend response (auto-sync):', response);
          }
          if (response?.user?.email) {
            localStorage.setItem('email', response.user.email);
          }
        },
        onError: (error) => {
          console.error('Google Auth mutation error:', error);
        }
      });
    }
  }, [status, session, onboardingStatus, googleAuth]);
  
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      if (onClick) {
        onClick();
      }
      console.log('Starting Google authentication...');
      const result = await signIn('google');
      console.log("Resultss",result);
      if (result?.ok) {
        console.log('Google authentication successful, syncing with backend...');
        const sessionResponse = await fetch('/api/auth/session').then(res => res.json());
        if (sessionResponse?.user) {
          const googleData = {
            email: sessionResponse.user.email || '',
            avatar: sessionResponse.user.image || '',
            firstName: sessionResponse.user.name?.split(' ')[0] || '',
            lastName: sessionResponse.user.name?.split(' ').slice(1).join(' ') || '',
          };
          console.log('Calling googleAuth mutation with:', googleData);
          googleAuth(googleData, {
            onSuccess: (response) => {
              console.log('Google backend response (manual):', response);
              if (response?.token) {
                TokenManager.setToken(response.token, 'token');
                setIsAuthenticated(true);
                console.log('Token set in localStorage:', response.token);
                router.push('/profile');
              } else {
                console.error('No token in backend response (manual):', response);
              }
              if (response?.user?.email) {
                localStorage.setItem('email', response.user.email);
              }
            },
            onError: (error) => {
              console.error('Google Auth mutation error:', error);
            }
          });
        } else {
          setIsAuthenticated(false);
          console.error('No session data available');
          toast.error('Authentication failed. Please try again.');
        }
      } else if (result?.error) {
        setIsAuthenticated(false);
        console.error('Authentication failed:', result.error);
        toast.error(`Authentication failed: ${result.error}`);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error('Authentication error:', error);
      toast.error('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
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