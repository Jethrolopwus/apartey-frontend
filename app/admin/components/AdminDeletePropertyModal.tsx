"use client";
import React from "react";
interface Property {
  id: string;
  title: string;
}

interface AdminDeletePropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AdminDeletePropertyModal: React.FC<AdminDeletePropertyModalProps> = ({
  property,
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-md">
        <h2 className="text-lg font-semibold mb-2">Delete Property</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to Delete {property.title}? This action cannot
          be undone. All associated reviews and bookings will also be removed.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 bg-red-600 text-sm hover:bg-red-700 rounded-lg border cursor-pointer  transition-colors text-white  border-gray-200"
          >
            Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeletePropertyModal;
