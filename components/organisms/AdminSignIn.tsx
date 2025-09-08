"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SignInForm from "@/components/molecules/SigninForm";
import GoogleAuthButton from "@/components/atoms/Buttons/GoogleAuthButton";
import { FormData } from "@/types/generated";
import { useAdminLoginMutation } from "@/Hooks/use-adminLogin.mutation";
import { useAuthStatusQuery } from "@/Hooks/use-getAuthStatus.query";
import { toast } from "react-hot-toast";

const AdminSignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate, isLoading, error, data } = useAdminLoginMutation();
  const { refetch: refetchAuthStatus } = useAuthStatusQuery();

  useEffect(() => {
    // Check if user is already authenticated
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const isAdminLogin = localStorage.getItem("isAdminLogin") === "true";
    const userRole = localStorage.getItem("userRole");

    if (
      token &&
      isAdminLogin &&
      userRole &&
      userRole.toLowerCase().includes("admin")
    ) {
      // User is already authenticated, redirect to dashboard
      router.push("/admin/dashboard");
      return;
    }

    if (session) {
      // For Google OAuth users, set onboarding completion if they have a role
      if (typeof window !== "undefined" && session.user) {
        localStorage.setItem("authMode", "signin");
        localStorage.setItem("isAdminLogin", "true");

        // For Google OAuth users, assume they have completed onboarding
        // since they already have an account
        localStorage.setItem("hasCompletedOnboarding", "true");

        // Check if user has a role in the session (if available)
        const userWithRole = session.user as { role?: string };
        if (userWithRole.role) {
          localStorage.setItem("userRole", userWithRole.role);
        }

        console.log("NextAuth session user:", session.user);
        console.log("Admin login flags set in session:", {
          authMode: localStorage.getItem("authMode"),
          hasCompletedOnboarding: localStorage.getItem(
            "hasCompletedOnboarding"
          ),
          isAdminLogin: localStorage.getItem("isAdminLogin"),
          userRole: localStorage.getItem("userRole"),
        });
      }

      // Redirect to admin dashboard for admin users
      console.log("Redirecting admin to dashboard after Google OAuth");
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    if (data) {
      console.log("Admin sign in data:", data);
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
        if (data.user?.firstName) {
          localStorage.setItem("adminName", data.user.firstName);
        } else if (data.user?.email) {
          // Use email prefix as name if no name is provided
          const name = data.user.email.split("@")[0];
          localStorage.setItem("adminName", name);
        }
        if (data.user?.role) {
          localStorage.setItem("userRole", data.user.role);
        }
        localStorage.setItem("isAdminLogin", "true");
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

      toast.success("Admin signed in successfully!");
      reset();
      refetchAuthStatus();

      // Redirect to admin dashboard
      console.log("Redirecting admin to dashboard after successful login");
      router.push("/admin/dashboard");
    }
  }, [data, reset, refetchAuthStatus, router]);

  useEffect(() => {
    if (error) {
      console.error("Admin sign in error:", error);
      let errorMessage = "Failed to sign in. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (apiError.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (apiError.response?.status === 404) {
          errorMessage = "Admin account not found";
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
    console.log("Google admin sign in initiated");
    if (typeof window !== "undefined") {
      localStorage.setItem("authMode", "signin");
      localStorage.setItem("hasCompletedOnboarding", "true");
      localStorage.setItem("isAdminLogin", "true");
      console.log("Admin login flags set:", {
        authMode: localStorage.getItem("authMode"),
        hasCompletedOnboarding: localStorage.getItem("hasCompletedOnboarding"),
        isAdminLogin: localStorage.getItem("isAdminLogin"),
      });
    }
    signIn("google", { callbackUrl: "/admin/dashboard" });
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
              width={130}
              height={50}
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Admin Sign In
          </h2>
          <p className="mb-3 text-center text-sm text-gray-600">
            Welcome back! Please sign in to access admin panel
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <SignInForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isSubmitting={isLoading}
              isAdmin={true}
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
            callbackUrl="/admin/dashboard"
            onClick={handleGoogleSignIn}
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-semibold leading-6 text-orange-600 hover:text-orange-500"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignIn;
