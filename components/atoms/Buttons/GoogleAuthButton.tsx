
'use client'

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { GoogleAuthButtonProps } from '@/types/generated';

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  mode, 
  onClick,
  callbackUrl = '/dashboard' 
}) => {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google';
  
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      
      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }
      
      console.log('Starting Google authentication...');
      
      // Trigger Google OAuth flow
      const result = await signIn('google', { 
        callbackUrl,
        redirect: false // Handle redirect manually to show loading state
      });
      
      if (result?.ok) {
        console.log('Authentication successful, redirecting...');
        // Small delay to show success state
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 500);
      } else if (result?.error) {
        console.error('Authentication failed:', result.error);
        alert(`Authentication failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={status === 'loading' || isLoading}
      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <img
        className="mr-2 h-5 w-5"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
      />
      {isLoading ? 'Authenticating...' : buttonText}
    </button>
  );
};

export default GoogleAuthButton;