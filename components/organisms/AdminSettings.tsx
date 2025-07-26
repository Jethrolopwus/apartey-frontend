"use client";
import React, { useRef } from 'react';

export default function AdminSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-5xl mx-auto bg-transparent p-0 mt-4">
      <h2 className="text-2xl font-semibold text-[#2D3A4A] mb-8">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile & Company Info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center mb-2">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              {/* Placeholder for profile photo */}
              <span className="text-4xl text-gray-400">●</span>
            </div>
            <button
              className="px-4 py-1 rounded border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} />
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, or GIF. Max size 2MB</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#2D3A4A] mb-4">Company Information</h3>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Company Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none" defaultValue="Apartey" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none" defaultValue="Apartey" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none" defaultValue="Apartey" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Address</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none" defaultValue="Apartey" />
              </div>
              <button type="submit" className="mt-2 bg-[#C85212] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a63e0a] transition-colors self-start">Save Settings</button>
            </form>
          </div>
        </div>
        {/* Right: System Preference */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6 h-fit">
          <h3 className="text-lg font-semibold text-[#C85212] mb-4">System Preference</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Currency</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none">
              <option>NGN - Nigerian Naira</option>
              <option>USD - US Dollar</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Timezone</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none">
              <option>GMT +0 (West African Time)</option>
              <option>GMT +1 (Central European Time)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#C85212]" defaultChecked />
              Email Notifications
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#C85212]" />
              SMS Notifications
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#C85212]" />
              Maintenance Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 