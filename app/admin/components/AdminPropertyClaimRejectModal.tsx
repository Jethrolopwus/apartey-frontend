"use client";
import React from "react";

interface AdminPropertyClaimRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (claimId: string | null) => void;
  claimId: string | null;
}

export default function AdminPropertyClaimRejectModal({
  isOpen,
  onClose,
  onConfirm,
  claimId,
}: AdminPropertyClaimRejectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reject Claim
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to reject this claim? This action cannot be
          undone.
        </p>
        <div className="flex justify-between gap-4">
          <button
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
            onClick={() => onConfirm(claimId)}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}
