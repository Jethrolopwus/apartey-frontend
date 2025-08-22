"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useUpdateAdminProfileMutation } from '@/Hooks/use-updateAdminProfile.mutation';

export default function AdminSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { mutate: updateProfile, isLoading, error } = useUpdateAdminProfileMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Please select a valid image file");
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    updateProfile(formData, {
      onSuccess: (response) => {
        setUploadSuccess("Profile picture updated successfully!");
        setUploadError(null);
        
        // Save the profile picture URL to localStorage for the header
        if (response.profilePicture) {
          localStorage.setItem('adminProfilePicture', response.profilePicture);
        }
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
        setPreviewUrl(null);
      },
      onError: (error) => {
        setUploadError(error.message || "Failed to update profile picture");
        setUploadSuccess(null);
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Settings</h1>
          <button 
            type="button" 
            className="bg-[#C85212] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a63e0a] transition-colors"
          >
            Save all settings
          </button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile & Company Info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
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
              ) : (
                <span className="text-4xl text-gray-400">●</span>
              )}
            </div>
            <button
              type="button"
              className="px-4 py-1 rounded border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Change photo'}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, or GIF. Max size 2MB</span>
            
            {/* Success/Error Messages */}
            {uploadSuccess && (
              <div className="mt-2 text-xs text-green-600 font-medium">{uploadSuccess}</div>
            )}
            {uploadError && (
              <div className="mt-2 text-xs text-red-600 font-medium">{uploadError}</div>
            )}
            {error && (
              <div className="mt-2 text-xs text-red-600 font-medium">{error.message}</div>
            )}
            
            {/* Upload Button */}
            {selectedFile && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="mt-2 px-4 py-1 bg-[#C85212] text-white text-sm font-medium rounded hover:bg-[#a63e0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading...' : 'Upload Photo'}
              </button>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">Platform Configuration</h3>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Platform Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50" defaultValue="Apartey" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Admin Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50" defaultValue="admin@apartey.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Support Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50" defaultValue="support@apartey.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Contact Phone</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50" defaultValue="+234 800 123 4567" />
              </div>
            </form>
          </div>
        </div>
        {/* Right: System Preference & Notifications */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6 h-fit">
          <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">System Preference</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Currency</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50">
              <option>NGN - Nigerian Naira</option>
              <option>USD - US Dollar</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">Timezone</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-gray-50">
              <option>GMT +0 (West African Time)</option>
              <option>GMT +1 (Central European Time)</option>
            </select>
          </div>
          
          <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">Notification Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">Admin Email Alerts</div>
                <div className="text-xs text-gray-500">Receive email notifications for admin actions</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">User Activity Notifications</div>
                <div className="text-xs text-gray-500">Get notified about user registrations and activities</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">System Alerts</div>
                <div className="text-xs text-gray-500">Receive alerts for system issues and updates</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button type="button" className="text-red-600 text-sm font-medium hover:text-red-700">
              Change Password
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 