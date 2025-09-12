"use client";

import React, { useState } from "react";
import { useToggleListingAvailability } from "@/Hooks/use-toggleListingAvailability.mutation";
import { X } from "lucide-react";

interface PropertyStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: PropertyStatusData) => void;
  propertyTitle: string;
  category: "Rent" | "Swap" | "Sale";
  propertyId: string | null;
}

export interface PropertyStatusData {
  transactionLocation: "onApartey" | "elsewhere" | "notCompleted" | "other";
  otherDetails?: string;
}

const PropertyStatusModal: React.FC<PropertyStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle,
  category,
  propertyId,
}) => {
  const [selectedOption, setSelectedOption] = useState<PropertyStatusData["transactionLocation"] | null>(null);
  const [otherDetails, setOtherDetails] = useState("");
  const { mutateAsync, isPending } = useToggleListingAvailability();

  const handleOptionChange = (option: PropertyStatusData["transactionLocation"]) => {
    setSelectedOption(option);
    if (option !== "other") {
      setOtherDetails("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || !propertyId) return;

    // Map UI selection to backend enum values
    let reason = "";
    let location = "";
    let customNote: string | undefined = undefined;

    if (selectedOption === "onApartey") {
      reason = "Transaction was successful";
      location = "On Platform";
    } else if (selectedOption === "elsewhere") {
      reason = "Transaction was not completed";
      location = "Elsewhere";
    } else if (selectedOption === "notCompleted") {
      reason = "Transaction was not completed";
      location = "Not Sold";
    } else if (selectedOption === "other") {
      reason = "Other";
      location = "Other";
      customNote = otherDetails || undefined;
    }

    await mutateAsync({
      id: propertyId,
      payload: { reason, location, customNote: customNote ?? null },
    });

    onConfirm({
      transactionLocation: selectedOption,
      otherDetails: selectedOption === "other" ? otherDetails : undefined,
    });

    // Reset form
    setSelectedOption(null);
    setOtherDetails("");
  };

  const handleClose = () => {
    setSelectedOption(null);
    setOtherDetails("");
    onClose();
  };

  const getModalTitle = () => {
    switch (category) {
      case "Rent":
        return "Have you rented this home?";
      case "Swap":
        return "Have you swapped this home?";
      case "Sale":
        return "Have you sold this home?";
      default:
        return "Have you rented this home?";
    }
  };

  const getActionText = () => {
    switch (category) {
      case "Rent":
        return "rented";
      case "Swap":
        return "swapped";
      case "Sale":
        return "sold";
      default:
        return "rented";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]  flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#00000070]"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            onClick={handleClose}
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

        {/* Options */}
        <div className="space-y-4 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="transactionLocation"
              value="onApartey"
              checked={selectedOption === "onApartey"}
              onChange={() => handleOptionChange("onApartey")}
              className="w-4 h-4 text-[#C85212] focus:ring-[#C85212] border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Yes, {getActionText()} on Apartey
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="transactionLocation"
              value="elsewhere"
              checked={selectedOption === "elsewhere"}
              onChange={() => handleOptionChange("elsewhere")}
              className="w-4 h-4 text-[#C85212] focus:ring-[#C85212] border-gray-300"
            />
            <span className="text-sm text-gray-700">
              Yes, {getActionText()} elsewhere
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="transactionLocation"
              value="notCompleted"
              checked={selectedOption === "notCompleted"}
              onChange={() => handleOptionChange("notCompleted")}
              className="w-4 h-4 text-[#C85212] focus:ring-[#C85212] border-gray-300"
            />
            <span className="text-sm text-gray-700">
              No, haven&apos;t {getActionText()}
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="transactionLocation"
              value="other"
              checked={selectedOption === "other"}
              onChange={() => handleOptionChange("other")}
              className="w-4 h-4 text-[#C85212] focus:ring-[#C85212] border-gray-300"
            />
            <span className="text-sm text-gray-700">Other</span>
          </label>

          {/* Other Details Input */}
          {selectedOption === "other" && (
            <div className="ml-7 mt-2">
              <textarea
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                placeholder="Please provide details..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C85212] focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || isPending || !propertyId}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#C85212] hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isPending ? "Processing..." : "Mark as Inactive"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatusModal;
