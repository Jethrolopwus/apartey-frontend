"use client";

import React from "react";
import { useToggleListingAvailability } from "@/Hooks/use-toggleListingAvailability.mutation";
import { X } from "lucide-react";

interface PropertyActivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
  propertyId: string | null;
}

const PropertyActivateModal: React.FC<PropertyActivateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle,
  propertyId,
}) => {
  const { mutateAsync, isPending } = useToggleListingAvailability();

  const handleActivate = async () => {
    if (!propertyId) return;

    try {
      // Call the toggle availability endpoint without any payload
      await mutateAsync({
        id: propertyId,
      });

      onConfirm();
    } catch (error) {
      console.error("Error activating property:", error);
      // You might want to show an error toast here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#00000070]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Activate property
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Property Title */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Property:</p>
          <p className="font-medium text-gray-900 truncate" title={propertyTitle}>
            {propertyTitle}
          </p>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to activate this property?
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleActivate}
            disabled={isPending || !propertyId}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#C85212] hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isPending ? "Processing..." : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyActivateModal;
