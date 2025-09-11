"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Camera, Calendar } from "lucide-react";
import Image from 'next/image';

interface EditProfileProps {
  userEmail?: string;
  initialData?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      country?: string;
      stateOrRegion?: string;
      district?: string;
      street?: string;
    };
    dateOfBirth?: string;
    bio?: string;
    website?: string;
    avatar?: string;
    profilePicture?: string;
    role?: string;
    roleProfiles?: {
      renter?: { bio?: string; website?: string };
      homeowner?: { bio?: string; website?: string };
      agent?: { bio?: string; website?: string };
      admin?: { bio?: string; website?: string };
    };
  };
  onSave?: (data: FormData) => void;
  onCancel?: () => void;
}

// Define a local interface for the form values
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  website: string;
  avatar?: string;
  country?: string;
  stateOrRegion?: string;
  district?: string;
  street?: string;
}

const EditProfile: React.FC<EditProfileProps> = ({
  userEmail = "example@email.com",
  initialData = {},
  onSave,
  onCancel,
}) => {
  // State for file and url
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(initialData.profilePicture || "");

  // Get bio and website from the user's role profile
  const getUserRoleData = () => {
    const userRole = initialData.role || 'renter';
    const roleProfile = initialData.roleProfiles?.[userRole as keyof typeof initialData.roleProfiles];
    return {
      bio: roleProfile?.bio || "",
      website: roleProfile?.website || "",
    };
  };

  const roleData = getUserRoleData();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: userEmail,
      phone: initialData.phone || "",
      dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.slice(0, 10) : "",
      bio: roleData.bio || "",
      website: roleData.website || "",
      avatar: initialData.profilePicture || "",
      country: initialData.address?.country || "",
      stateOrRegion: initialData.address?.stateOrRegion || "",
      district: initialData.address?.district || "",
      street: initialData.address?.street || "",
    },
  });

  // Calculate completion percentage based on filled fields
  const watchedFields = watch();
  const calculateCompletion = () => {
    // Define the required fields for completion calculation
    const requiredFields = [
      watchedFields.firstName,
      watchedFields.lastName,
      watchedFields.phone,
      watchedFields.dateOfBirth,
      watchedFields.bio,
      watchedFields.country,
      watchedFields.stateOrRegion,
    ];
    
    const filledFields = requiredFields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  // File upload handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      console.log(file)
      setAvatarUrl(imageUrl);
      setValue("avatar", "");
    }
  };

  // On submit, send avatar as file or string
  const onSubmit = (data: ProfileFormValues) => {
    const address = {
      country: data.country || "",
      stateOrRegion: data.stateOrRegion || "",
      district: data.district || "",
      street: data.street || "",
    };
    // Build FormData object
    const formDataObject = new FormData();
    formDataObject.append("firstName", data.firstName);
    formDataObject.append("lastName", data.lastName);
    formDataObject.append("email", data.email);
    formDataObject.append("phone", data.phone);
    formDataObject.append("dateOfBirth", data.dateOfBirth);
    formDataObject.append("bio", data.bio);
    formDataObject.append("website", data.website);
    formDataObject.append("country", address.country);
    formDataObject.append("stateOrRegion", address.stateOrRegion);
    formDataObject.append("district", address.district);
    formDataObject.append("street", address.street);
    // Always append avatar as file if present, else as string
    if (selectedFile) {
      formDataObject.append("avatar", selectedFile);
      console.log("File", selectedFile)
    }
    
    // Log all FormData entries
    for (const pair of formDataObject.entries()) {
      console.log('Data', pair[0], pair[1]);
    }
    onSave?.(formDataObject);
  };

  // Create SVG circle path for progress
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mb-16  rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          My profile
        </h1>

        {/* Completion Status */}
        <div className="flex items-center gap-4 mb-8 bg-[#FFF4EA] p-4 rounded-lg shadow-sm">
          <div className="relative w-16 h-16">
            {/* Background circle */}
            <svg
              className="w-16 h-16 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-orange-500">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Complete your profile</p>
            <ul className="text-sm text-gray-600 mt-1">
              <li>• Add your bio</li>
              <li>• Complete address information</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile Photo and Basic Info */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 bg-gray-300 rounded-full mb-4 overflow-hidden group">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Ellipse-2.png'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                {/* File upload button overlay */}
                <label className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-2 cursor-pointer shadow hover:bg-gray-100 transition-all border border-gray-200">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="email"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email is auto-filled from signup and cannot be changed
                        here
                      </p>
                    </>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: "Invalid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="tel"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-4">
            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  {...control.register("country")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={initialData.address?.country || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
                <input
                  type="text"
                  {...control.register("stateOrRegion")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={initialData.address?.stateOrRegion || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  {...control.register("district")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={initialData.address?.district || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  {...control.register("street")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={initialData.address?.street || ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                  required: "Date of birth is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
                    message: "Please use MM/DD/YYYY format",
                  },
                }}
                render={({ field }) => (
                  <>
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        placeholder="mm/dd/yyyy"
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.dateOfBirth
                            ? "border-red-500"
                            : "border-gray-300"
                        } ${!field.value ? "text-gray-500" : "text-gray-900"}`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <Controller
                name="bio"
                control={control}
                rules={{
                  required: "Bio is required",
                  minLength: {
                    value: 10,
                    message: "Bio must be at least 10 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Bio must not exceed 500 characters",
                  },
                }}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent resize-none ${
                        errors.bio ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {field.value?.length || 0}/500
                    </p>
                  </>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website/Socials
              </label>
              <Controller
                name="website"
                control={control}
                rules={{
                  pattern: {
                    value: /^https?:\/\/.+\..+/,
                    message:
                      "Please enter a valid URL (starting with http:// or https://)",
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="url"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.website ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.website && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.website.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#C85212] cursor-pointer hover:bg-[#C85212] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
