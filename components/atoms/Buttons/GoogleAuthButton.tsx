"use client";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoogleAuthButtonProps } from "@/types/generated";
import { useGoogleAuthMutation } from "@/Hooks/use.googleAuth.mutation";
import { useGetOnboardingStatusQuery } from "@/Hooks/get-onboardingStatus.query";
import { TokenManager } from "@/utils/tokenManager";
import toast from "react-hot-toast";
import Image from "next/image";

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
  const { data: onboardingStatus, isLoading: isOnboardingLoading } =
    useGetOnboardingStatusQuery();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user &&
      !TokenManager.hasToken()
    ) {
      console.log("Calling Backend sync for Google auth", session.user);
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
          console.log("Backend Response", response);
          if (response?.token) {
            console.log("Setting token in localStorage:", response.token);
            TokenManager.setToken(response.token, "token");
            if (response?.user?.email) {
              localStorage.setItem("email", response.user.email);
            }
            if (response?.user?.role) {
              localStorage.setItem("userRole", response.user.role);
            }
            const hasCompletedOnboarding = localStorage.getItem(
              "hasCompletedOnboarding"
            );
            const role =
              onboardingStatus?.currentUserStatus?.role ||
              response?.user?.role ||
              localStorage.getItem("userRole") ||
              "renter";
            console.log("User role:", role);

            // For signin users, assume they have completed onboarding
            if (mode === "signin") {
              console.log("Google signin - assuming onboarding is complete");
              localStorage.setItem("authMode", "signin");
              localStorage.setItem("hasCompletedOnboarding", "true");
              
              if (localStorage.getItem("pendingReviewData")) {
                console.log(
                  "Redirecting to /write-reviews/unlisted due to pendingReviewData"
                );
                router.push("/write-reviews/unlisted");
              } else {
                if (role === "homeowner") {
                  console.log("Redirecting to /landlord for homeowner role");
                  router.push("/landlord");
                } else if (role === "agent") {
                  console.log("Redirecting to /agent-profile for agent role");
                  router.push("/agent-profile");
                } else {
                  console.log("Redirecting to /profile for renter or default role");
                  router.push("/profile");
                }
              }
            } else if (mode === "signup" || !hasCompletedOnboarding) {
              console.log(
                "Redirecting to /onboarding for signup or incomplete onboarding"
              );
              localStorage.setItem("authMode", "signup");
              router.push("/onboarding");
            } else {
              if (localStorage.getItem("pendingReviewData")) {
                console.log(
                  "Redirecting to /write-reviews/unlisted due to pendingReviewData"
                );
                router.push("/write-reviews/unlisted");
              } else {
                if (role === "homeowner") {
                  console.log("Redirecting to /landlord for homeowner role");
                  router.push("/landlord");
                } else if (role === "agent") {
                  console.log("Redirecting to /agent for agent role");
                  router.push("/agent");
                } else {
                  console.log("Redirecting to / for renter or default role");
                  router.push("/");
                }
              }
            }
          }
        },
        onError: (error) => {
          console.error("Google Auth mutation error:", error);
          toast.error("Backend authentication failed. Please try again.");
        },
      });
    }
  }, [status, session, googleAuth, onboardingStatus, router, mode]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    localStorage.setItem("authMode", mode);
    if (mode === "signin") {
      localStorage.setItem("hasCompletedOnboarding", "true");
    }
    await signIn("google", { callbackUrl });
    setIsLoading(false);
  };

  const isLoadingState =
    isLoading || isGoogleAuthLoading || isOnboardingLoading;

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
      {isLoadingState ? "Authenticating..." : buttonText}
    </button>
  );
};

export default GoogleAuthButton;
