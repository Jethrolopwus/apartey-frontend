"use client";

import React from "react";
import { useDeactivateAdminUserById } from "@/Hooks/use-deactivateAdminUserById.query";

interface AdminDeleteUserModalProps {
  userId: string | null;
  userName: string | null;
  status: string; 
  onClose: () => void;
}

export default function AdminFlagUserModal({
  userId,
  userName,
  status,
  onClose,
}: AdminDeleteUserModalProps) {
  const { mutate, isPending, error } = useDeactivateAdminUserById();

  const handleAction = () => {
    if (userId) {
      mutate(userId);
      onClose();
    }
  };

  if (!userId || !userName) return null;

  const isActive = status === "active";

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2D3A4A]">
            {isActive ? "Deactivate User" : "Activate User"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            {isActive
              ? `Are you sure you want to suspend ${userName}? This action cannot be undone. All associated reviews and bookings will also be removed.`
              : `Do you want to activate ${userName}? They will regain access to their account.`}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error.message}</p>}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={isPending}
            className={`px-4 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${
              isActive
                ? "border-gray-200 text-white bg-red-600 hover:bg-red-700"
                : "border-gray-200 text-white bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPending
              ? isActive
                ? "Deactivating..."
                : "Activating..."
              : isActive
              ? "Deactivate User"
              : "Activate User"}
          </button>
        </div>
      </div>
    </div>
  );
}
