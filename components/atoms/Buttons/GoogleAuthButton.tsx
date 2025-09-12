"use client";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoogleAuthButtonProps } from "@/types/generated";
import { useGoogleAuthMutation } from "@/Hooks/use.googleAuth.mutation";
import { TokenManager } from "@/utils/tokenManager";
import Image from "next/image";
import ErrorHandler from "@/utils/errorHandler";
import AparteyLoader from "@/components/atoms/Loader";

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  mode,
  onClick,
  callbackUrl = mode === "signin" ? "/signin" : "/onboarding",
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const buttonText =
    mode === "signin" ? "Sign in with Google" : "Sign up with Google";

  const { mutate: googleAuth, isLoading: isGoogleAuthLoading } =
    useGoogleAuthMutation();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user &&
      !TokenManager.hasToken()
    ) {
      const googleData: {
        email: string;
        avatar: string;
        firstName: string;
        lastName: string;
      } = {
        email: session.user.email || "",
        avatar: session.user.image || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
      };

      googleAuth(googleData, {
        onSuccess: (response) => {
          if (response?.token) {
            TokenManager.setToken(response.token, "token");
            if (response?.user?.email) {
              localStorage.setItem("email", response.user.email);
            }
            if (response?.user?.role) {
              localStorage.setItem("userRole", response.user.role);
            }

            // Check if this is an admin login
            const isAdminLogin = localStorage.getItem("isAdminLogin") === "true";
            const isAdminCallback = callbackUrl?.includes('/admin/');
            
            if (isAdminLogin || isAdminCallback) {
              console.log("Redirecting to admin dashboard from Google Auth");
              localStorage.setItem("isAdminLogin", "true");
              router.push("/admin/dashboard");
              return;
            }

            // Set Google OAuth flag
            localStorage.setItem("isGoogleAuth", "true");

            // Check if user has completed onboarding from backend response
            const hasCompletedOnboarding = response?.user?.isOnboarded;
            const userRole = response?.user?.role;

            console.log("Google Auth Response:", { 
              hasCompletedOnboarding, 
              userRole, 
              mode,
              response 
            });

            if (hasCompletedOnboarding) {
              // Existing user - redirect based on role
              localStorage.setItem("authMode", "signin");
              localStorage.setItem("hasCompletedOnboarding", "true");
              
              if (localStorage.getItem("pendingReviewData")) {
                router.push("/write-reviews/unlisted");
              } else {
                // Redirect based on role for existing users
                if (userRole === "homeowner") {
                  router.push("/homeowner-profile");
                } else if (userRole === "agent") {
                  router.push("/agent-profile");
                } else {
                  router.push("/profile");
                }
              }
            } else {
              // New user - redirect to onboarding
              localStorage.setItem("authMode", "signup");
              localStorage.removeItem("hasCompletedOnboarding");
              router.push("/onboarding");
            }
            
            // Clear the Google OAuth flag after successful redirect
            localStorage.removeItem("isGoogleAuth");
          }
        },
        onError: (error: unknown) => {
          ErrorHandler.handleAuthError(error);
        },
      });
    }
  }, [status, session, googleAuth, router, mode, callbackUrl]);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      if (onClick) {
        onClick();
      }
      
      // Set basic flags - the actual redirect logic will be handled in useEffect
      localStorage.setItem("authMode", mode);
      localStorage.setItem("isGoogleAuth", "true");
      
      await signIn("google", { callbackUrl });
    } catch (error: unknown) {
      ErrorHandler.handleGoogleOAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingState =
    isLoading || isGoogleAuthLoading;

  // Show loader when authenticating
  if (isLoadingState) {
    return (
      <div className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-8">
        <AparteyLoader />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={status === "loading" || isLoadingState}
      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image
        className="mr-2 h-5 w-5"
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      {buttonText}
    </button>
  );
};

export default GoogleAuthButton;
