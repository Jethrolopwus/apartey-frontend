"use client";
import React, { useState, useEffect } from "react";
import ClaimPropertyDetailsForm from "@/components/molecules/ClaimPropertyDetailsForm";
import ClaimPropertyVerificationForm from "../molecules/ClaimPropertyVerificationForm";
import ClaimPropertyConfirmForm from "../molecules/ClaimPropertyConfirmForm";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetListingsByIdQuery } from "@/Hooks/use-getAllListingsById.query";
import { useClaimPropertyMutation } from "@/Hooks/use-claimProperty.mutation";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";





interface User {
  _id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface UserData {
  currentUser: User;
}

const ClaimProperty = () => {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  // Fetch user profile and property details
  const { data: userData } = useGetUserProfileQuery() as { data?: UserData };
  const { data: propertyData, isLoading: propertyLoading, error: propertyError } = useGetListingsByIdQuery(propertyId);

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
    if (propertyData?.property) {
      const property = propertyData.property;
      setForm({
        streetAddress: property.location?.streetAddress || property.location?.fullAddress || "",
        district: property.location?.district || "",
        state: property.location?.stateOrRegion || "",
        postalCode: property.location?.zipCode || property.location?.postalCode || "",
        propertyType: property.propertyType || "Residential",
      });
    }
  }, [propertyData]);

  // Prepopulate verification form with user data
  useEffect(() => {
    if (userData?.currentUser) {
      const user = userData.currentUser;
      
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      
      setVerificationForm((prev) => {
        const newForm = {
          ...prev,
          email: user.email || "",
          fullName: fullName || "",
          phone: user.phone || "",
        };
        return newForm;
      });
    }
  }, [userData]);

  // Claim property mutation hook
  const {
    mutate: claimProperty,
    error: claimError,
    data: claimData,
    isLoading: claimLoading,
  } = useClaimPropertyMutation();

  // Step state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // Update submitting state based on claim loading
  useEffect(() => {
    setSubmitting(claimLoading);
  }, [claimLoading]);

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
    // Validate required fields
    if (!verificationForm.fullName || !verificationForm.email || !verificationForm.phone) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }

    if (!form.streetAddress || !form.district || !form.state || !form.postalCode || !form.propertyType) {
      toast.error("Please ensure all property details are complete before submitting.");
      return;
    }

    setSubmitting(true);
    
    // Create FormData for the claim property request
    const formData = new FormData();
    formData.append("fullName", verificationForm.fullName);
    formData.append("phoneNumber", verificationForm.phone);
    formData.append("country", form.state);
    formData.append("stateOrRegion", form.state);
    formData.append("district", form.district);
    formData.append("postalCode", form.postalCode);
    formData.append("street", form.streetAddress);
    formData.append("additionalInfo", verificationForm.additionalDetails);
    formData.append("email", verificationForm.email);
    formData.append("propertyId", propertyId);
    
    claimProperty({ formData, propertyId }, {
      onSuccess: () => {
        setSubmitting(false);
        toast.success("Property claim submitted successfully! Your claim is under review.");
        // Optionally redirect after successful submission
        setTimeout(() => {
          router.push("/homeowner-profile");
        }, 2000);
      },
      onError: (error) => {
        setSubmitting(false);
        toast.error(error?.message || "Failed to submit property claim. Please try again.");
        console.error("Claim submission failed:", error);
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
        No property ID provided in the URL. Please select a property to claim.
      </div>
    );
  }

  if (propertyLoading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">Loading property details...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212] mx-auto"></div>
      </div>
    );
  }

  if (propertyError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading property details: {propertyError.message}
      </div>
    );
  }

  if (!propertyData?.property) {
    return (
      <div className="p-8 text-center text-red-600">
        Property not found. Please check the property ID and try again.
      </div>
    );
  }

  // Check if the current user owns this property
  const currentUserId = userData?.currentUser?._id;
  const propertyOwnerId = propertyData.property.owner?._id || propertyData.property.userId;
  
  if (currentUserId && propertyOwnerId && currentUserId !== propertyOwnerId) {
    return (
      <div className="p-8 text-center text-red-600">
        <div className="text-xl font-semibold mb-4">Access Denied</div>
        <div className="text-gray-600 mb-4">
          You can only claim properties that you own. This property belongs to another user.
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-[#C85212] text-white rounded-lg hover:bg-[#A64310] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white py-10">
      <h1 className="text-4xl font-bold text-teal-800 mb-2">
        Claim Your Property
      </h1>
      <p className="text-gray-500 mb-8">Claim your home</p>
      
      {/* Property Summary */}
      <div className="w-full max-w-2xl mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Address:</span>
            <div className="text-gray-800 mt-1">
              {propertyData.property.location?.streetAddress || propertyData.property.location?.fullAddress || "Address not specified"}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Location:</span>
            <div className="text-gray-800 mt-1">
              {propertyData.property.location?.district && propertyData.property.location?.stateOrRegion 
                ? `${propertyData.property.location.district}, ${propertyData.property.location.stateOrRegion}`
                : "Location not specified"
              }
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Property Type:</span>
            <div className="text-gray-800 mt-1">
              {propertyData.property.propertyType || "Not specified"}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Property ID:</span>
            <div className="text-gray-800 mt-1 font-mono text-xs">
              {propertyData.property._id}
            </div>
          </div>
        </div>
      </div>
      {claimLoading && (
        <div className="text-orange-600 mb-4">Submitting claim...</div>
      )}
      {claimError && (
        <div className="text-red-600 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-800">Claim Submission Failed</div>
          <div className="text-red-700 text-sm mt-1">
            {claimError.message || "An error occurred while submitting your claim. Please try again."}
          </div>
        </div>
      )}
      {claimData && (
        <div className="text-green-600 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="font-semibold text-green-800">Claim Submitted Successfully!</div>
          <div className="text-green-700 text-sm mt-1">
            Your property claim has been submitted and is under review. You will be notified once the verification is complete.
          </div>
        </div>
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
