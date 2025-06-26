"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import SignInForm from "@/components/molecules/SigninForm";
import GoogleAuthButton from "@/components/atoms/Buttons/GoogleAuthButton";
import { FormData } from "@/types/generated";
import { useSignInMutation } from "@/Hooks/use.login.mutation";
import { useGetOnboardingStatusQuery } from "@/Hooks/get-onboardingStatus.query";
import { toast } from "react-hot-toast";
import { useReviewForm } from "@/app/context/RevievFormContext";
import { useAuthStatusQuery } from '@/Hooks/use-getAuthStatus.query';

const SignIn: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate, isLoading, error, data } = useSignInMutation();

  // Onboarding status query (disabled by default)
  const {
    refetch: checkOnboardingStatus,
    data: onboardingData,
    isLoading: isCheckingOnboarding,
  } = useGetOnboardingStatusQuery();

  const { setLocation } = useReviewForm();

  const { refetch: refetchAuthStatus } = useAuthStatusQuery();

  // Handle NextAuth session (Google OAuth)
  useEffect(() => {
    if (session) {
      if (localStorage.getItem("pendingReviewData")) {
        router.push("/write-reviews/unlisted");
        // set location to context using data from local storage
        const pendingReviewData = JSON.parse(localStorage.getItem("pendingReviewData") || "{}");
        setLocation(pendingReviewData.LocationPayload);
      } else {
      // router.push("/profile");
    }
    }
    
  }, [session, router]);

  // Handle onboarding status check result
  useEffect(() => {
    if (onboardingData) {
      const isOnboarded = onboardingData.currentUserStatus?.isOnboarded;

      console.log("Onboarding status:", isOnboarded);

      if (isOnboarded) {
        // User is onboarded, redirect to profile or dashboard
        toast.success("Welcome back!");
        router.push("/profile");
      } else {
        // User is not onboarded, redirect to role selection
        toast.success("Please complete your setup");
        router.push("/onboarding"); // Keep your existing onboarding route
      }
    }
  }, [onboardingData, router]);

  // Handle traditional signin success
  useEffect(() => {
    if (data) {
      console.log("Sign in data:", data);

      // Store tokens
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.user?.email) {
        localStorage.setItem("email", data.user.email);
      }

      toast.success("Signed in successfully!");
      reset();
      refetchAuthStatus();

      // Always redirect to profile after sign in
      router.push("/profile");
    }
  }, [data, reset, refetchAuthStatus, router]);

  // Handle signin error
  useEffect(() => {
    if (error) {
      console.error("Sign in error:", error);

      let errorMessage = "Failed to sign in. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object" && "response" in error) {
        const apiError = error as any;
        if (apiError.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (apiError.response?.status === 404) {
          errorMessage = "Account not found";
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      toast.error(errorMessage);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData: FormData) => {
    mutate(formData);
  });

  const handleGoogleSignIn = () => {
    console.log("Google sign in initiated");
  };

  // Show loading during NextAuth session check
  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Don't render if user is already authenticated via NextAuth
  // if (session) {
  //   return null;
  // }

  // Combined loading state for both sign in and onboarding check
  const isProcessing = isLoading || isCheckingOnboarding;

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 px-6 py-8 shadow-xl bg-white rounded-xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Apartey Logo"
              width={100}
              height={50}
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sign in to your account
          </h2>
          <p className="mb-3 text-center text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <div className="space-y-6">
          {/* Traditional Signin Form */}
          <div>
            <SignInForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isProcessing}
            />
          </div>

          {/* Loading indicator for onboarding check */}
          {isCheckingOnboarding && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                <p className="text-sm text-gray-600">
                  Checking your account status...
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with Google
              </span>
            </div>
          </div>

          {/* Google Auth Button */}
          <GoogleAuthButton
            mode="signin"
            callbackUrl="/onboarding"
            onClick={handleGoogleSignIn}
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold leading-6 text-orange-600 hover:text-orange-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
