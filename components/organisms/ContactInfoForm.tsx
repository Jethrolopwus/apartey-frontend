"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

export interface ContactInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  openForTour: boolean;
  typeOfOffer: string;
}

interface ContactInfoFormProps {
  formData: ContactInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactInfoFormData>>;
  onNext?: () => void;
  onBack?: () => void;
}

const ContactInfoForm = ({ formData, setFormData, onNext, onBack }: ContactInfoFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<ContactInfoFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      openForTour: formData.openForTour || false,
      typeOfOffer: formData.typeOfOffer || "",
    },
  });

  // Watch individual fields to avoid unstable object references
  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });
  const email = useWatch({ control, name: "email" });
  const phoneNumber = useWatch({ control, name: "phoneNumber" });
  const openForTour = useWatch({ control, name: "openForTour" });
  const typeOfOffer = useWatch({ control, name: "typeOfOffer" });

  // Sync up to parent state as values change, but only when actually different
  useEffect(() => {
    const next = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      openForTour: !!openForTour,
      typeOfOffer: typeOfOffer || "",
    };

    // Shallow compare to prevent unnecessary updates
    const isDifferent =
      next.firstName !== formData.firstName ||
      next.lastName !== formData.lastName ||
      next.email !== formData.email ||
      next.phoneNumber !== formData.phoneNumber ||
      next.openForTour !== formData.openForTour ||
      next.typeOfOffer !== formData.typeOfOffer;

    if (isDifferent) {
      setFormData((prev) => ({ ...prev, ...next }));
    }
  }, [firstName, lastName, email, phoneNumber, openForTour, typeOfOffer, formData, setFormData]);

  const onSubmit = (data: ContactInfoFormData) => {
    const next = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      openForTour: !!data.openForTour,
      typeOfOffer: data.typeOfOffer || "",
    };
    const isDifferent =
      next.firstName !== formData.firstName ||
      next.lastName !== formData.lastName ||
      next.email !== formData.email ||
      next.phoneNumber !== formData.phoneNumber ||
      next.openForTour !== formData.openForTour ||
      next.typeOfOffer !== formData.typeOfOffer;

    if (isDifferent) {
      setFormData((prev) => ({ ...prev, ...next }));
    }
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Contact info</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("firstName", {
              required: "First name is required",
              minLength: { value: 2, message: "Must be at least 2 characters" },
            })}
            type="text"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("lastName", {
              required: "Last name is required",
              minLength: { value: 2, message: "Must be at least 2 characters" },
            })}
            type="text"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            id="phoneNumber"
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            {...register("phoneNumber", {
              required: "Phone number is required",
              minLength: { value: 7, message: "Must be at least 7 digits" },
              pattern: {
                value: /^[+]?\d[\d\s()-]{6,}$/,
                message: "Enter a valid phone number",
              },
            })}
            type="tel"
            placeholder="+__ ___ ___"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      {/* Type of Offer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of offer <span className="text-red-500">*</span>
        </label>
        <select
          {...register("typeOfOffer", { required: "Please select a type of offer" })}
          className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
            errors.typeOfOffer ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select type</option>
          <option value="Private person">Private person</option>
          <option value="Real estate agent">Real estate agent</option>
        </select>
        {errors.typeOfOffer && (
          <p className="mt-1 text-xs text-red-600">{errors.typeOfOffer.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Open for schedule for a tour
        </span>
        <button
          type="button"
          onClick={() => setValue("openForTour", !openForTour, { shouldValidate: false, shouldDirty: true })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            openForTour ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              openForTour ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {(onNext || onBack) && (
        <>
          <div className="border-t-2 border-[#C85212] pt-6 mt-8"></div>
          <div className="flex justify-between">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {onNext && (
              <button
                type="submit"
                disabled={!isValid}
                className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#C85212' }}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default ContactInfoForm;
