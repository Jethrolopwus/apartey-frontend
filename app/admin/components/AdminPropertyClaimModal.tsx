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
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold  mb-4">Property Claim Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Property Information</h3>
            <p className="text-sm">
              <span className="font-semibold">Title:</span>{" "}
              <span className="text-gray-500">{claim.propertyDescription}</span>
            </p>
            <p className="text-sm ">
              <span className="font-semibold">Address:</span>{" "}
              <span className="text-gray-500">{claim.address}</span>
            </p>
            {/* <p className="text-sm ">
              <span className="font-semibold">Current Owner:</span> [Not
              Available]
            </p> */}
          </div>
          <div>
            <h3 className="text-sm font-medium  mb-2">Claim Details</h3>
            <p className="text-sm ">
              <span className="font-semibold">Claimant:</span>{" "}
              <span className="text-gray-500">{claim.claimant}</span>
            </p>
            <p className="text-sm ">
              <span className="font-semibold">Reason:</span>{" "}
              <span className="text-gray-500">{claim.message}</span>
            </p>
          </div>
          <div>
            <p className="text-sm ">
              Attached:{" "}
              {claim.proof ? (
                <p>cadastralNumber: {claim.proof}</p>
              ) : (
                <p>No file attachement</p>
              )}
            </p>
          </div>
        </div>
        <button
          className="text-white cursor-pointer bg-[#C85212] hover:bg-[#a7440f] text-sm float-right mt-10 rounded-[8px] px-4 py-1.5"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
