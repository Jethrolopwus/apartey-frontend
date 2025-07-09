"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ResetPasswordForm from "@/components/molecules/ResetPasswordForm";
import { useResetPasswordMutation } from "@/Hooks/use.resetPassword.mutation";
import { FormValues } from "@/types/generated";

const ResetPassword: React.FC = () => {
  const {
    mutate: resetPassword,
    isLoading,
    error,
  } = useResetPasswordMutation();

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await resetPassword(data, {
        onSuccess: (response) => {
          console.log("Reset password success:", response);
          toast.success(
            "Reset password link sent successfully! Check your email."
          );
          // Optionally redirect to a success page or signin page
          // router.push("/signin");
        },
        onError: (error: Error) => {
          console.error("Reset password error:", error);
          toast.error(
            error.message ||
              "Failed to send reset password link. Please try again."
          );
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-6 py-8 shadow-xl bg-white rounded-xl border border-gray-100">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-12 w-auto mb-8">
            <Image
              src="/logo.png"
              alt="Apartey"
              width={120}
              height={48}
              className="mx-auto"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl title font-semibold text-gray-900 mb-2">
            Reset your password
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mb-8">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>

        {/* Display global error if needed */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600">
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Reusable Form Component */}
        <ResetPasswordForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/signin"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
