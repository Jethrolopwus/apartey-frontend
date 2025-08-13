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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-md">
        <h2 className="text-lg font-semibold mb-2">Deactivate Property</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to Suspend {property.title}? This action cannot
          be undone. All associated reviews and bookings will also be removed.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Suspend Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeletePropertyModal;
