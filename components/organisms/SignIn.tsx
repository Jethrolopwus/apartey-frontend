"use client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import SignInForm from "@/components/molecules/SigninForm";
import GoogleAuthButton from "@/components/atoms/Buttons/GoogleAuthButton";
import { FormData } from "@/types/generated";
import { useSignInMutation } from "@/Hooks/use.login.mutation";
import { useAuthStatusQuery } from "@/Hooks/use-getAuthStatus.query";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { toast } from "react-hot-toast";
import ErrorHandler from "@/utils/errorHandler";

const SignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate, isLoading, error, data } = useSignInMutation();
  const { refetch: refetchAuthStatus } = useAuthStatusQuery();
  const { handlePostLoginRedirect } = useAuthRedirect();

  const handlePostLoginRedirectRef = useRef(handlePostLoginRedirect);
  handlePostLoginRedirectRef.current = handlePostLoginRedirect;

  useEffect(() => {
    if (session) {
      // For Google OAuth users, let the GoogleAuthButton handle the redirect logic
      // Don't interfere with the onboarding flow here
      if (typeof window !== "undefined" && session.user) {
        
        // Only set authMode if it's not already set by GoogleAuthButton
        if (!localStorage.getItem("authMode")) {
          localStorage.setItem("authMode", "signin");
        }
      }
    }
  }, [session]);

  useEffect(() => {
    if (data) {
      if (typeof window !== "undefined") {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.user?.email) {
          localStorage.setItem("email", data.user.email);
        }
        if (data.user?.role) {
          localStorage.setItem("userRole", data.user.role);
        }
      }
      // Set auth mode for signin (not signup)
      if (typeof window !== "undefined") {
        localStorage.setItem("authMode", "signin");
        
        // If user has a role, they've completed onboarding
        if (data.user?.role) {
          localStorage.setItem("hasCompletedOnboarding", "true");
          localStorage.setItem("userRole", data.user.role);
        }
      }
      
      toast.success("Signed in successfully!");
      reset();
      refetchAuthStatus();
      setTimeout(() => {
        handlePostLoginRedirectRef.current();
      }, 100);
    }
  }, [data, reset, refetchAuthStatus]);

  useEffect(() => {
    if (error) {
      ErrorHandler.handleAuthError(error);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData: FormData) => {
    mutate(formData);
  });

  const handleGoogleSignIn = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authMode", "signin");
      // Don't set hasCompletedOnboarding here - let GoogleAuthButton handle it
    }
    signIn("google", { callbackUrl: "/signin" });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 px-6 py-8 bg-white rounded-xl border border-gray-100">
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
          <div>
            <SignInForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isLoading}
            />
          </div>

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

          <GoogleAuthButton
            mode="signin"
            callbackUrl="/"
            onClick={handleGoogleSignIn}
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
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
