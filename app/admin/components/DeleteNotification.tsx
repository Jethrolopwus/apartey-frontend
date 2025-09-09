"use client";

import { useDeleteNotificationById } from "@/Hooks/use-deleteNotification";
import React from "react";
import toast from "react-hot-toast";
// import { useDeleteNotificationByIdMutation } from "@/Hooks/use-deleteNotificationById.mutation";

interface DeleteNotificationModalProps {
  notificationId: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteNotificationModal({
  notificationId,
  message,
  isOpen,
  onClose,
  onSuccess,
}: DeleteNotificationModalProps) {
  const { mutate: deleteNotification, isPending } =
    useDeleteNotificationById();

  const handleDelete = () => {
    deleteNotification(notificationId, {
      onSuccess: () => {
        toast.success("Notification deleted successfully");
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete notification");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2D3A4A]">
            Delete Notification
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this notification? <br />
            <span className="italic text-gray-500">
              &ldquo;{message}&rdquo;
            </span>
            <br />
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-white bg-red-600 text-sm hover:bg-red-700 transition-colors"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
