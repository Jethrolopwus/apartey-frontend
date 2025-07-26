"use client";
import React, { useState, useEffect } from "react";
import ClaimPropertyDetailsForm from "@/components/molecules/ClaimPropertyDetailsForm";
import ClaimPropertyVerificationForm from "../molecules/ClaimPropertyVerificationForm";
import ClaimPropertyConfirmForm from "../molecules/ClaimPropertyConfirmForm";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";
import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { useSearchParams } from "next/navigation";

interface Property {
  id: string;
  location?: {
    streetAddress?: string;
    city?: string;
    country?: string;
  };
  propertyType?: string;
}

interface ListingsData {
  properties: Property[];
}

interface User {
  email?: string;
  name?: string;
  phone?: string;
}

interface UserData {
  currentUser: User;
}

const ClaimProperty = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  // Fetch user profile and listings
  const { data: userData } = useGetUserProfileQuery() as { data?: UserData };
  const { data: listingsData } = useGetAllMyListingsQuery() as {
    data?: ListingsData;
  };

  // Form states
  const [form, setForm] = useState({
    streetAddress: "",
    district: "",
    state: "",
    postalCode: "",
    propertyType: "",
  });

  const [verificationForm, setVerificationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    additionalDetails: "",
  });

  // Prepopulate form with property details
  useEffect(() => {
    if (propertyId && listingsData?.properties) {
      const property = listingsData.properties.find(
        (p: Property) => p.id === propertyId
      );
      if (property) {
        setForm({
          streetAddress: property.location?.streetAddress || "",
          district: property.location?.city || "",
          state: property.location?.country || "",
          postalCode: "",
          propertyType: property?.propertyType || "Residential",
        });
      }
    }
  }, [propertyId, listingsData]);

  // Prepopulate verification form with user data
  useEffect(() => {
    if (userData?.currentUser) {
      const user = userData.currentUser;
      setVerificationForm((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [userData]);

  // Mutation for claim property
  type ClaimPropertyPayload = {
    fullName: string;
    phoneNunber: string;
    country: string;
    stateOrRegion: string;
    district: string;
    postalCode: string;
    street: string;
    additionalInfo: string;
    email: string;
  };

  const {
    mutate: claimProperty,
    error: claimError,
    data: claimData,
    isPending: claimLoading,
  } = useMutation<unknown, Error, ClaimPropertyPayload>({
    mutationFn: (payload: ClaimPropertyPayload) => {
      if (!propertyId) throw new Error("No propertyId provided in URL");
      return http.httpClaimProperty(propertyId, payload);
    },
  });

  // Step state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Handlers for step 1
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const handleCancel = () => {
    setForm({
      streetAddress: "",
      district: "",
      state: "",
      postalCode: "",
      propertyType: "",
    });
  };

  // Handlers for step 2
  const handleVerificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVerificationForm({
      ...verificationForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleVerificationContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  const handleVerificationCancel = () => {
    setVerificationForm({
      fullName: "",
      email: "",
      phone: "",
      additionalDetails: "",
    });
    setStep(1);
  };

  // Handlers for step 3
  const handleBackToVerification = () => {
    setStep(2);
  };
  const handleSubmitClaim = async () => {
    setSubmitting(true);
    const payload: ClaimPropertyPayload = {
      fullName: verificationForm.fullName,
      phoneNunber: verificationForm.phone,
      country: form.state, // Assuming state maps to country for simplicity
      stateOrRegion: form.state,
      district: form.district,
      postalCode: form.postalCode,
      street: form.streetAddress,
      additionalInfo: verificationForm.additionalDetails,
      email: verificationForm.email,
    };
    claimProperty(payload, {
      onSuccess: () => {
        setSubmitting(false);
        alert("Claim submitted!");
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  // Prepare info for confirmation step
  const propertyInfo = {
    address: form.streetAddress,
    location: `${form.district}, ${form.state}`,
    propertyType: form.propertyType,
  };
  const ownerInfo = {
    name: verificationForm.fullName,
    email: verificationForm.email,
    phone: verificationForm.phone,
  };

  // Read-only fields for prepopulated data
  const detailsReadOnlyFields = [
    "streetAddress",
    "district",
    "state",
    "postalCode",
    "propertyType",
  ];
  const verificationReadOnlyFields = ["email", "fullName", "phone"];

  if (!propertyId) {
    return (
      <div className="p-8 text-center text-red-600">
        No propertyId provided in the URL. Please select a property to claim.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white py-10">
      <h1 className="text-4xl font-bold text-teal-800 mb-2">
        Claim Your Property
      </h1>
      <p className="text-gray-500 mb-8">Claim your home</p>
      {claimLoading && (
        <div className="text-orange-600 mb-4">Submitting claim...</div>
      )}
      {claimError && (
        <div className="text-red-600 mb-4">Error: {claimError.message}</div>
      )}
      {claimData !== undefined && (
        <div className="text-green-600 mb-4">Claim submitted successfully!</div>
      )}
      {/* Stepper */}
      <div className="flex items-center justify-center w-full max-w-xl mb-8">
        <div className="flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full ${
              step === 1
                ? "bg-[#C85212] text-white"
                : "bg-gray-200 text-gray-400"
            } flex items-center justify-center font-bold`}
          >
            1
          </div>
          <span
            className={`mt-2 text-sm font-medium ${
              step === 1 ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Property Details
          </span>
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mx-2" />
        <div className="flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full ${
              step === 2
                ? "bg-[#C85212] text-white"
                : "bg-gray-200 text-gray-400"
            } flex items-center justify-center font-bold`}
          >
            2
          </div>
          <span
            className={`mt-2 text-sm font-medium ${
              step === 2 ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Verification
          </span>
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mx-2" />
        <div className="flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full ${
              step === 3
                ? "bg-[#C85212] text-white"
                : "bg-gray-200 text-gray-400"
            } flex items-center justify-center font-bold`}
          >
            3
          </div>
          <span
            className={`mt-2 text-sm font-medium ${
              step === 3 ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Confirmation
          </span>
        </div>
      </div>
      {/* Step 1: Property Details Form */}
      {step === 1 && (
        <ClaimPropertyDetailsForm
          form={form}
          handleChange={handleChange}
          handleContinue={handleContinue}
          handleCancel={handleCancel}
          readOnlyFields={detailsReadOnlyFields}
        />
      )}
      {/* Step 2: Verification Form */}
      {step === 2 && (
        <ClaimPropertyVerificationForm
          form={verificationForm}
          handleChange={handleVerificationChange}
          handleContinue={handleVerificationContinue}
          handleCancel={handleVerificationCancel}
          readOnlyFields={verificationReadOnlyFields}
        />
      )}
      {/* Step 3: Confirmation Form */}
      {step === 3 && (
        <ClaimPropertyConfirmForm
          propertyInfo={propertyInfo}
          ownerInfo={ownerInfo}
          onBack={handleBackToVerification}
          onSubmit={handleSubmitClaim}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default ClaimProperty;
