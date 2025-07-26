"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  location: string;
  status: string;
  lister: string;
  description: string;
  addedDate: string;
}

interface AdminEditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: Property) => void;
}

const AdminEditPropertyModal: React.FC<AdminEditPropertyModalProps> = ({
  property,
  isOpen,
  onCancel,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Property>({
    defaultValues: property || {
      title: "",
      type: "",
      price: "",
      location: "",
      status: "",
      lister: "",
    },
  });

  if (!isOpen || !property) return null;

  const onFormSubmit: SubmitHandler<Property> = (data) => {
    const formattedData = {
      ...data,
      price: data.price,
    };
    console.log("Form submission data:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Property</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Title
            </label>
            <input
              {...register("title", { required: "Property Title is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.title}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              {...register("type", { required: "Property Type is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.type}
            >
              <option value="Apartment">Apartment</option>
              <option value="Monthly Rent">Monthly Rent</option>
              <option value="House">House</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              {...register("location", { required: "Location is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.location}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number" // Use number input for price
              {...register("price", {
                required: "Price is required",
                pattern: {
                  value: /^\d+$/,
                  message: "Price must be a valid number",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.price}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.status}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Pending">Pending</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner
            </label>
            <input
              {...register("lister", { required: "Owner is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              defaultValue={property.lister}
            />
            {errors.lister && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lister.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C85212] text-white rounded hover:bg-orange-600"
            >
              Update Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditPropertyModal;
