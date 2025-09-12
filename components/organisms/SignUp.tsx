"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import SignUpForm from "@/components/molecules/SignupForm";
import GoogleAuthButton from "@/components/atoms/Buttons/GoogleAuthButton";
import { FormData } from "@/types/generated";
import { useSignUPMutation } from "@/Hooks/use.register.mutation";
import { toast } from "react-hot-toast";

const SignUp: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();
  const password = watch("password", "");
  const { mutate, isLoading, error, data } = useSignUPMutation();

  useEffect(() => {
    if (data) {
      localStorage.setItem("email", data?.user?.email);
      localStorage.setItem("authMode", "signup"); // Set auth mode for signup
      localStorage.setItem("pendingVerification", "true"); // Flag to indicate user is in verification process
      toast.success("Account created successfully! Please check your email for verification code.");
      reset();
      router.push("/verifyEmail");
    }
  }, [data, router, reset]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";
      toast.error(errorMessage);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData: FormData) => {
    mutate(formData);
  });

  const handleGoogleSignUp = () => {
    localStorage.setItem("authMode", "signup");
    localStorage.setItem("isGoogleAuth", "true");
    signIn("google", { callbackUrl: "/onboarding" });
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
      <div className="w-full max-w-md space-y-8 px-6 py-8 shadow-xl bg-white rounded-xl border border-gray-100">
        {session && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              You&apos;re already logged in as {session.user?.email}.
              <Link href="/profile" className="underline ml-1">
                Go to profile
              </Link>
            </p>
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/aparteyLogo.png"
              alt="Apartey Logo"
              width={100}
              height={50}
              priority
            />
          </div>
          <h2 className="text-center title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create an account
          </h2>
          <p className="mb-3 text-center text-sm text-gray-600">
            Enter your details to create an account
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <SignUpForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isLoading}
              password={password}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton
            mode="signup"
            callbackUrl="/onboarding"
            onClick={handleGoogleSignUp}
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold leading-6 text-[#C85212] hover:text-orange-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
