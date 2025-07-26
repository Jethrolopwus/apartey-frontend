"use client";

import { useGetAdminUsersByIdQuery } from "@/Hooks/use-getAdminUsersById.query";
import { X } from "lucide-react";

interface AdminViewUserModalProps {
  userId: string | null;
  onClose: () => void;
}

export default function AdminViewUserModal({
  userId,
  onClose,
}: AdminViewUserModalProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useGetAdminUsersByIdQuery(userId || "");

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2D3A4A]">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#2D3A4A]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Error: {(error as Error).message}
          </p>
        ) : user ? (
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-[#2D3A4A]">Name:</span>{" "}
              {user.fullName}
            </div>
            <div>
              <span className="font-semibold text-[#2D3A4A]">Email:</span>{" "}
              {user.email}
            </div>
            <div>
              <span className="font-semibold text-[#2D3A4A]">Role:</span>{" "}
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
            <div>
              <span className="font-semibold text-[#2D3A4A]">Status:</span>{" "}
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
            <div>
              <span className="font-semibold text-[#2D3A4A]">Properties:</span>{" "}
              {user.propertiesCount}
            </div>
            <div>
              <span className="font-semibold text-[#2D3A4A]">Join Date:</span>{" "}
              {user.createdAt}
            </div>
          </div>
        ) : (
          <p className="text-center">No user data found</p>
        )}
      </div>
    </div>
  );
}
