"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetProfileCompletionQuery } from "@/Hooks/use-getProfileCompletionStat.query";
import { Mail, MapPin, Edit3 } from "lucide-react";
import ProfileCompletionCard from "@/components/molecules/ProfileCompletionCard";
import { useUpdateProfileMutation } from "@/Hooks/use.updateProfile.mutation";
import { useRouter } from "next/navigation";
import { TokenManager } from "@/utils/tokenManager";
import { useAuthToken } from '@/Hooks/useAuthToken';

const ProfilePage = () => {
  const { data, isLoading, isError, error, refetch } = useGetUserProfileQuery();
  const {
    data: completionData,
    isLoading: isLoadingCompletion,
    isError: isErrorCompletion,
    error: completionError,
  } = useGetProfileCompletionQuery();
  const { mutate, isLoading: isUpdating, error: updateError, data: updateData } = useUpdateProfileMutation();
  const router = useRouter();
  const user = data?.currentUser;
  const [form, setForm] = useState<any>(user);
  const token = useAuthToken();


  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  if (!token || isLoading) {
    return <p className="p-4 text-gray-500">Loading profile...</p>;
  }
  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleCancel = () => {
    setForm(user);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: (response) => {
        console.log('Backend sync successful:', response);
        if (response?.token) {
          TokenManager.setToken(response.token, 'token');
        } else {
          console.error('No token in backend response:', response);
        }
        refetch();
      },
    });
  };


  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error fetching profile: {(error as any)?.message}
      </p>
    );
  }

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
                <img
                  src={user?.profilePicture || "/Ellipse-1.png"}
                  alt={`${user?.firstName || "User"}'s avatar`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4 flex flex-col items-center justify-between sm:flex-row sm:items-start">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {user?.firstName || "N/A"} {user?.lastName || ""}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>
                        {user?.address?.street ? user.address.street + ", " : ""}
                        {user?.address?.district ? user.address.district + ", " : ""}
                        {user?.address?.stateOrRegion ? user.address.stateOrRegion + ", " : ""}
                        {user?.address?.country || "Not specified"}
                      </span>
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
                className="inline-flex items-center  rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Website</p>
              <p className="font-medium">
                {user?.website ? (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{user.website}</a>
                ) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
