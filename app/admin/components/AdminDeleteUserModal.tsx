"use client";

import React from "react";
import { X } from "lucide-react";
import { useDeleteAdminUserById } from "@/Hooks/use-deleteAdminUserById.query";

interface AdminDeleteUserModalProps {
  userId: string | null;
  userName: string | null;
  onClose: () => void;
}

export default function AdminDeleteUserModal({
  userId,
  userName,
  onClose,
}: AdminDeleteUserModalProps) {
  const { mutate, isPending, error } = useDeleteAdminUserById();

  const handleDelete = () => {
    if (userId) {
      mutate(userId);
      onClose();
    }
  };

  if (!userId || !userName) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2D3A4A]">Delete User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#2D3A4A]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete {userName}? This action cannot be
          undone. All associated reviews and bookings will also be removed.
        </p>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        <div className="flex justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#C85212] text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
