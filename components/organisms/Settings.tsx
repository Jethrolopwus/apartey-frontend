"use client";
import React, { useState } from "react";

export default function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          Account Settings
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Notification Preferences */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#C85212] border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Email Notifications
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#C85212] border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    SMS Notifications
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingUpdates}
                    onChange={(e) => setMarketingUpdates(e.target.checked)}
                    className="w-4 h-4 text-[#C85212] border-gray-300 rounded focus:ring-[#C85212] focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Marketing updates
                  </span>
                </label>
              </div>
            </div>

            {/* Privacy & Security */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Privacy & Security
              </h2>
              <div className="space-y-2">
                <button className="block text-sm text-[#C85212] hover:text-[#A64310] transition-colors">
                  Change Password
                </button>
                <button className="block text-sm text-[#C85212] hover:text-[#A64310] transition-colors">
                  Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#C85212] text-sm font-medium text-white rounded-md hover:bg-[#A64310] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C85212] transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
