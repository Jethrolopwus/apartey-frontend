"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useUpdateUserToggleDeactivateMutation } from "@/Hooks/use-toggleAdminUsersDeactivated.mutation";
import { AdminUser } from "@/types/admin";

interface AdminEditUserModalProps {
  user: AdminUser | null;
  onClose: () => void;
}

interface EditUserForm {
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminEditUserModal({
  user,
  onClose,
}: AdminEditUserModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserForm>({
    defaultValues: user
      ? {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      : undefined,
  });

  const { toggleDeactivate, isLoading, error } =
    useUpdateUserToggleDeactivateMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data: EditUserForm) => {
    if (user?.id) {
      toggleDeactivate(user.id);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2D3A4A]">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#2D3A4A]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2D3A4A]">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full Name is required" })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
              placeholder="Enter Full Name"
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3A4A]">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
              placeholder="Enter Email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3A4A]">
              Role
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
            >
              <option value="agent">Agent</option>
              <option value="renter">Renter</option>
            </select>
            {errors.role && (
              <span className="text-red-500 text-xs">
                {errors.role.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3A4A]">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-xs">
                {errors.status.message}
              </span>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#C85212] text-white rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
