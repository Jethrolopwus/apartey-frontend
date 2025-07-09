"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddRolesMutation } from "@/Hooks/use.addRoles.mutation";
import { useUpdateOnboardingStatusMutation } from "@/Hooks/use.updateOnboardingStatus.mutation";
import { TokenManager } from "@/utils/tokenManager";
import { toast } from "react-hot-toast";
import { useGetUserRoleQuery } from "@/Hooks/use-getUserRole.query";
// import AuthGuard from "@/components/molecules/AuthStatus";

export default function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState<
    "renter" | "homeowner" | "agent" | null
  >(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const {
    mutate: addRole,
    isLoading: isAddingRole,
    data: addRoleData,
  } = useAddRolesMutation();

  const { mutate: updateOnboardingStatus, isLoading: isUpdatingOnboarding } =
    useUpdateOnboardingStatusMutation();

  const { data, refetch } = useGetUserRoleQuery();

  useEffect(() => {
    if (data) {
      setSelectedRole(data?.currentUserRole?.role);
    }
  }, [addRoleData, data]);

  const handleContinue = () => {
    if (!selectedRole || !agreedToTerms) return;

    // Step 1: Add the role first
    addRole(
      { role: selectedRole },
      {
        onSuccess: (response) => {
          console.log("Role added successfully:", response);

          // Update token if provided
          if (TokenManager.updateFromResponse(response)) {
            console.log("Token updated from role response");
          } else {
            console.warn("No new token received from role API response");
          }

          // Refetch user data
          refetch();

          // Step 2: Update onboarding status after role is successfully added
          updateOnboardingStatus(undefined, {
            onSuccess: (onboardingResponse) => {
              console.log("Onboarding status updated:", onboardingResponse);

              // Update token if provided from onboarding response
              if (TokenManager.updateFromResponse(onboardingResponse)) {
                console.log("Token updated from onboarding response");
              }

              toast.success("Setup completed successfully!");

              // Check if there's pending review data and redirect accordingly
              if (localStorage.getItem("pendingReviewData")) {
                router.push("/write-reviews/unlisted");
              } else {
                router.push("/profile");
              }
            },
            onError: (onboardingError: unknown) => {
              console.error("Onboarding status update error:", onboardingError);

              // Even if onboarding status update fails, we can still navigate
              // since the role was successfully set
              toast.success("Role selected successfully!");
              
              // Check if there's pending review data and redirect accordingly
              if (localStorage.getItem("pendingReviewData")) {
                router.push("/write-reviews/unlisted");
              } else {
                router.push("/profile");
              }
            },
          });
        },
        onError: (error: unknown) => {
          console.error("Role submission error:", error);

          if (error instanceof Error && error.message === "Authentication failed. Please login again.") {
            toast.error("Authentication failed. Please login again.");
            router.push("/signin");
          } else {
            toast.error(
              error instanceof Response ? error.statusText : error instanceof Error ? error.message : "Failed to submit role. Please try again."
            );
          }
        },
      }
    );
  };
  // Show loading state if either operation is in progress
  const isLoading = isAddingRole || isUpdatingOnboarding;

  return (
    
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-2xl text-center px-8 py-12 shadow-md border border-gray-100 bg-white rounded-lg">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="/logo.png"
              alt="Apartey Logo"
              width={140}
              height={45}
              className="mx-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Let&#39;s get started
          </h1>
          <p className="text-base text-gray-600 mb-12 leading-relaxed">
            Tell us a bit about yourself so we can tailor your experience
          </p>

          {/* Role selection */}
          <div className="text-left mb-8 w-[560px]">
            <p className="text-base font-medium text-gray-900 mb-6">I am a</p>

            <div className="grid grid-cols-3 gap-4">
              {/* Renter */}
              <div
                onClick={() => setSelectedRole("renter")}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 h-full ${
                  selectedRole === "renter"
                    ? "border-orange-500 bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "renter"
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedRole === "renter" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    Renter
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    I want to find a home to rent
                  </p>
                </div>
              </div>

              {/* Homeowner */}
              <div
                onClick={() => setSelectedRole("homeowner")}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 h-full ${
                  selectedRole === "homeowner"
                    ? "border-orange-500 bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "homeowner"
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedRole === "homeowner" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    Homeowner
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    I want to sell or rent out my property
                  </p>
                </div>
              </div>

              {/* Developer/Agent */}
              <div
                onClick={() => setSelectedRole("agent")}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 h-full ${
                  selectedRole === "agent"
                    ? "border-orange-500 bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "agent"
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedRole === "agent" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">
                    Developer/Agent
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    I am a real estate professional
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-3 mb-8 text-left">
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className="flex-shrink-0 mt-0.5 cursor-pointer"
            >
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                  agreedToTerms
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {agreedToTerms && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              I agree to the{" "}
              <span className="text-orange-600 hover:text-orange-700 cursor-pointer font-medium">
                terms of use
              </span>{" "}
              and{" "}
              <span className="text-orange-600 hover:text-orange-700 cursor-pointer font-medium">
                privacy policy
              </span>
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole || !agreedToTerms || isLoading}
            className={`w-full py-3 px-6 cursor-pointer rounded-lg font-semibold text-base transition-all duration-200 ${
              selectedRole && agreedToTerms && !isLoading
                ? "bg-orange-500 hover:bg-orange-600 cursor-pointer text-white shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? isAddingRole
                ? "Setting up your role..."
                : "Completing setup..."
              : "Continue"}
          </button>
        </div>
      </div>
    
  );
}
