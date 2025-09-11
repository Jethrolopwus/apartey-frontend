"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => void;
  isLoading?: boolean;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!currentPassword.trim()) {
      tempErrors.currentPassword = "Current password is required";
    }
    if (!newPassword.trim()) {
      tempErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = "New password must be at least 6 characters";
    }
    if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(currentPassword, newPassword);
      setCurrentPassword("");
      setConfirmPassword("");
      setNewPassword("");
    }
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    error?: string
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C85212]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderPasswordInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            setShowCurrent,
            errors.currentPassword
          )}

          {renderPasswordInput(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            setShowNew,
            errors.newPassword
          )}

          {renderPasswordInput(
            "Confirm Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            setShowConfirm,
            errors.confirmPassword
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 cursor-pointer bg-[#C85212] hover:bg-[#a63e0a] text-white rounded-lg disabled:bg-orange-300"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdateModal;
