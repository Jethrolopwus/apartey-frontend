"use client";
import React from "react";
import Image from "next/image";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetProfileCompletionQuery } from "@/Hooks/use-getProfileCompletionStat.query";
import { Mail, MapPin, Edit3 } from "lucide-react";
import ProfileCompletionCard from "@/components/molecules/ProfileCompletionCard";

const ProfilePage = () => {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();
  const {
    data: completionData,
    isLoading: isLoadingCompletion,
    isError: isErrorCompletion,
    error: completionError,
  } = useGetProfileCompletionQuery();

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading profile...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error fetching profile: {(error as any)?.message}
      </p>
    );
  }

  const user = data?.currentUser;

  const handleEditProfile = () => {
    // Add your edit profile logic here
    console.log("Edit profile clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">My profile</h1>

        <div className="mb-6">
          {isLoadingCompletion && (
            <p className="text-gray-500">Loading completion data...</p>
          )}

          {isErrorCompletion && (
            <p className="text-red-500">
              Error loading completion: {(completionError as any)?.message}
            </p>
          )}

          {!isLoadingCompletion && !isErrorCompletion && completionData && (
            <ProfileCompletionCard
              percentage={completionData?.profileCompletion?.percentage || 0}
              missingFields={
                completionData?.profileCompletion?.missingFields || []
              }
            />
          )}

          {!isLoadingCompletion && !isErrorCompletion && !completionData && (
            <p className="text-gray-500">No completion data available</p>
          )}
        </div>

        {/* User Profile Card */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
            {/* Profile Image */}
            <div className="mb-4 flex justify-center sm:mb-0 sm:justify-start">
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src="/Ellipse-1.png"
                  alt={`${user?.firstName}'s avatar`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4 flex flex-col items-center justify-between sm:flex-row sm:items-start">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {user?.firstName || "N/A"}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{user?.location || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="mt-4 flex items-center space-x-2 sm:mt-0">
                  <div className="flex items-center rounded-full bg-orange-100 px-3 py-1">
                    <span className="mr-1 text-orange-600">🏆</span>
                    <span className="text-sm font-medium text-orange-600">
                      {user?.rewards || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                {user?.bio ||
                  "Welcome! You haven't added a bio yet. Tell others about yourself here."}
              </p>

              {/* Edit Profile Button */}
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-700">
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-gray-500">Verified</p>
              <p className="font-medium">{user?.isVerified ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-gray-500">Account Created</p>
              <p className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
