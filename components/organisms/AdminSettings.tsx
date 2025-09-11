"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUpdateAdminProfileMutation } from "@/Hooks/use-updateAdminProfile.mutation";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PasswordUpdateModal from "@/app/admin/components/AdminPasswordUpdate";
import { useUpdateAdminPasswordMutation } from "@/Hooks/use-updateAdminPassword.mutation copy";

interface AdminUser {
  firstName: string;
  email: string;
  profilePicture?: string;
  role: string;
  phone: string;
  notificationSettings?: {
    adminEmailAlerts: boolean;
    userActivityNotifications: boolean;
  };
}

export default function AdminSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { data: userData } = useGetUserProfileQuery();

  const {
    mutate: updateProfile,
    isLoading,
    error,
  } = useUpdateAdminProfileMutation();

  const { mutate: updatePassword, isLoading: passwordIsLoading } =
    useUpdateAdminPasswordMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData?.currentUser) {
      setAdminUser(userData.currentUser);
    }
  }, [userData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNotificationChange = (
    field: keyof NonNullable<AdminUser["notificationSettings"]>
  ) => {
    setAdminUser((prev) =>
      prev
        ? {
            ...prev,
            notificationSettings: {
              adminEmailAlerts:
                prev.notificationSettings?.adminEmailAlerts ?? false,
              userActivityNotifications:
                prev.notificationSettings?.userActivityNotifications ?? false,
              [field]: !prev.notificationSettings?.[field],
            },
          }
        : prev
    );
  };

  const handlePasswordUpdate = (
    currentPassword: string,
    newPassword: string
  ) => {
    updatePassword(
      { currentPassword, newPassword },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          setModalOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleUpload = () => {
    if (!adminUser) {
      return;
    }

    const formData = new FormData();

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    formData.append("firstName", adminUser.firstName || "");
    formData.append("email", adminUser.email || "");
    formData.append("phone", adminUser.phone || "");
    formData.append("role", adminUser.role || "");

    if (adminUser.notificationSettings) {
      formData.append(
        "notificationSettings",
        JSON.stringify(adminUser.notificationSettings)
      );
    }

    updateProfile(formData, {
      onSuccess: (response) => {
        if (response.profilePicture) {
          setAdminUser((prev) =>
            prev ? { ...prev, profilePicture: response.profilePicture } : prev
          );
        }
        queryClient.invalidateQueries({
          queryKey: ["user-profile"],
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setPreviewUrl(null);

        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleChange = (field: keyof AdminUser, value: string) => {
    setAdminUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleOnClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl font-semibold text-[#2D3A4A]">Settings</h2>
        <button
          type="button"
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-[#C85212] cursor-pointer text-white font-semibold px-6 h-[40px] text-sm rounded-lg hover:bg-[#a63e0a] transition-colors"
        >
          {isLoading ? "Saving..." : "Save all settings"}
        </button>
      </div>
      <div className="flex gap-5">
        {/* Left: Profile & Company Info */}
        <div className="w-full bg-white rounded-[8px] shadow p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center mb-2">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : adminUser?.profilePicture ? (
                <Image
                  src={adminUser.profilePicture}
                  alt={adminUser.firstName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-4xl text-gray-400">●</span>
              )}
            </div>
            <button
              type="button"
              className="px-4 py-1 cursor-pointer rounded border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Change photo"}
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <span className="text-xs text-gray-400 mt-1">
              JPG, PNG, or GIF. Max size 2MB
            </span>

            {error && (
              <div className="mt-2 text-xs text-red-600 font-medium">
                {error.message}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">
              Platform Configuration
            </h3>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Platform Name
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50"
                  defaultValue="Apartey"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Admin Name
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50"
                  value={adminUser?.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Admin Email
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50"
                  value={adminUser?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Support Email
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50"
                  defaultValue="admin@apartey.com"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Contact Phone
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50"
                  value={adminUser?.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right: System Preference & Notifications */}
        <div className="w-full bg-white rounded-[8px] shadow p-8 flex flex-col gap-6 h-fit">
          <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">
            System Preference
          </h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Currency</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50">
              <option>EUR - Euro</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">Timezone</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50">
              <option>GMT +0 (West African Time)</option>
              <option>GMT +1 (Central European Time)</option>
            </select>
          </div>

          <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">
            Notification Settings
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Admin Email Alerts
                </div>
                <div className="text-xs text-gray-500">
                  Receive email notifications for admin actions
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!adminUser?.notificationSettings?.adminEmailAlerts}
                  onChange={() => handleNotificationChange("adminEmailAlerts")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  User Activity Notifications
                </div>
                <div className="text-xs text-gray-500">
                  Get notified about user registrations and activities
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    !!adminUser?.notificationSettings?.userActivityNotifications
                  }
                  onChange={() =>
                    handleNotificationChange("userActivityNotifications")
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  System Alerts
                </div>
                <div className="text-xs text-gray-500">
                  Receive alerts for system issues and updates
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-red-600 cursor-pointer text-sm font-medium hover:text-red-700"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <PasswordUpdateModal
        isOpen={modalOpen}
        onClose={handleOnClose}
        isLoading={passwordIsLoading}
        onSubmit={handlePasswordUpdate}
      />
    </div>
  );
}
