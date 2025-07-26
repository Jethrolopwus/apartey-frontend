"use client";
import React from "react";
import { AdminClaimedProperty } from "@/types/admin";

interface AdminPropertyClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim?: AdminClaimedProperty;
}

export default function AdminPropertyClaimModal({
  isOpen,
  onClose,
  claim,
}: AdminPropertyClaimModalProps) {
  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-[#2D3A4A] mb-4">
          Property Claim Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Property Information
            </h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Title:</span>{" "}
              {claim.propertyDescription}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Address:</span> {claim.address}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Current Owner:</span> [Not
              Available]
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Claim Details
            </h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Claimant:</span> {claim.claimant}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Reason:</span> {claim.message}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              Attached: {claim.proof ? "1 file(s)" : "0 file(s)"}
            </p>
            {claim.proof && (
              <button className="mt-2 text-sm text-gray-500 underline hover:text-gray-700">
                Attachment
              </button>
            )}
          </div>
        </div>
        <button
          className="mt-6 w-full bg-[#2D3A4A] text-white py-2 rounded-lg hover:bg-[#1e2735]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
