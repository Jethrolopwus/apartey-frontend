"use client";
import React from "react";

interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  location: string;
  addedDate: string;
  status: string;
  lister: string;
  description: string;
}

interface AdminViewPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminViewPropertyModal: React.FC<AdminViewPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{property.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <strong>Property Type</strong>
            </p>
            <p>{property.type}</p>
          </div>
          <div>
            <p>
              <strong>Owner</strong>
            </p>
            <p>{property.lister}</p>
          </div>
          <div>
            <p>
              <strong>Price</strong>
            </p>
            <p>{property.price}</p>
          </div>
          <div>
            <p>
              <strong>Date Added</strong>
            </p>
            <p>{property.addedDate}</p>
          </div>
          <div>
            <p>
              <strong>Location</strong>
            </p>
            <p>{property.location}</p>
          </div>
          <div>
            <p>
              <strong>Status</strong>
            </p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
              {property.status}
            </span>
          </div>
        </div>
        <p className="mb-4">
          <strong>Description</strong>
        </p>
        <p>{property.description}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminViewPropertyModal;
