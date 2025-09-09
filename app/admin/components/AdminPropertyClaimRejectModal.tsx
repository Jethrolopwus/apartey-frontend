"use client";
import React, { useState } from "react";

interface AdminPropertyClaimRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (claimId: string | null,propertyId: string | null, reason: string) => void;
  claimId: string | null;
  propertyId: string | null;
  isLoading?: boolean;   
}

export default function AdminPropertyClaimRejectModal({
  isOpen,
  onClose,
  onConfirm,
  claimId,
  propertyId,
  isLoading,
}: AdminPropertyClaimRejectModalProps) {
  const [reason, setReason] = useState("");

  const reasons = [
    "Insufficient documentation provided",
    "Property ownership cannot be verified",
    "Duplicate claim already exists",
    "Information provided is inaccurate",
    "Required legal documents missing",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reject Property Claim
        </h2>
        <p className="text-gray-600 mb-4">
          Please select a reason for rejecting this property claim:
        </p>

        <div className="space-y-3 mb-6">
          {reasons.map((r, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 cursor-pointer text-gray-700"
            >
              <input
                type="radio"
                name="rejectionReason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="text-red-600 focus:ring-red-500"
              />
              {r}
            </label>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
           <button
            disabled={!reason || isLoading}   
            className={`px-4 py-2 rounded-lg text-white ${
              !reason || isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={() => onConfirm(claimId, propertyId, reason)}
          >
            {isLoading ? "Rejecting..." : "Reject Claim"}  
          </button>
        </div>
      </div>
    </div>
  );
}
