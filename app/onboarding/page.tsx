"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState<"renter" | "homeowner" | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selectedRole) return;
   
    router.push("/next-step"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md text-center px-6">
        <div className="mb-8">
          <Image src="/logo.png" alt="Apartey Logo" width={120} height={40} className="mx-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-black mb-2">Let’s get started</h1>
        <p className="text-sm text-gray-600 mb-8">
          Tell us a bit about yourself so we can tailor your experience
        </p>

        {/* Role selection */}
        <div className="text-left mb-4">
          <p className="text-sm font-medium text-gray-800 mb-2">I am a</p>
          <div className="flex space-x-4">
            {/* Renter */}
            <div
              onClick={() => setSelectedRole("renter")}
              className={`flex-1 cursor-pointer border rounded-lg p-4 ${
                selectedRole === "renter"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === "renter"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    selectedRole === "renter" ? "text-orange-600" : "text-gray-800"
                  }`}
                >
                  Renter
                </span>
              </div>
              <p className="text-sm text-gray-600">I want to find a home to rent</p>
            </div>

            {/* Homeowner */}
            <div
              onClick={() => setSelectedRole("homeowner")}
              className={`flex-1 cursor-pointer border rounded-lg p-4 ${
                selectedRole === "homeowner"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === "homeowner"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    selectedRole === "homeowner" ? "text-orange-600" : "text-gray-800"
                  }`}
                >
                  Homeowner
                </span>
              </div>
              <p className="text-sm text-gray-600">I want to sell or rent out my property</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 mt-4 mb-4">
          By clicking “Continue”, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> and have read our{" "}
          <span className="underline cursor-pointer">Privacy Policy.</span>
        </p>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full bg-orange-500 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 ${
            !selectedRole ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
