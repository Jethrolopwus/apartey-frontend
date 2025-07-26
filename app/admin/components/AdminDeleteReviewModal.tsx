import React from "react";
import { X } from "lucide-react";
import { useDeleteAdminReviewsById } from "@/Hooks/use-deleteAdminReviewsById.query";

interface AdminDeleteReviewModalProps {
  reviewId: string | null;
  reviewProperty: string | null;
  onClose: () => void;
}

export default function AdminDeleteReviewModal({
  reviewId,
  reviewProperty,
  onClose,
}: AdminDeleteReviewModalProps) {
  const { mutate, isPending, error } = useDeleteAdminReviewsById();

  const handleDelete = () => {
    if (reviewId) {
      mutate(reviewId, {
        onSuccess: () => {
          console.log(
            "AdminDeleteReviewModal Debug: Review deleted:",
            reviewId
          );
          onClose();
        },
        onError: (err) => {
          console.error("AdminDeleteReviewModal Debug: Delete error:", err);
        },
      });
    }
  };

  if (!reviewId || !reviewProperty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-[8px] shadow-lg">
        <div className="flex justify-between items-center p-[16px] border-b border-gray-200 h-[40px]">
          <h3 className="text-[18px] font-semibold text-[#2D3A4A]">
            Delete Review
          </h3>
          <button
            onClick={onClose}
            className="ml-[8px] text-gray-400 hover:text-[#1E2A38]"
          >
            <X className="w-[24px] h-[24px]" />
          </button>
        </div>
        <div className="p-[16px]">
          <p className="text-[14px] mb-[16px]">
            Are you sure you want to delete the review for{" "}
            <strong>{reviewProperty}</strong>?
          </p>
          {error && (
            <p className="text-[14px] text-red-500 mb-[16px]">
              Error: {(error as Error).message}
            </p>
          )}
          <div className="flex justify-between gap-[24px]">
            <button
              className="w-[100px] h-[40px] text-[14px] text-[#2D3A4A] border border-[#E5E7EB] rounded-[8px] hover:bg-gray-100"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className="w-[80px] h-[40px] text-[14px] text-white bg-[#DC2626] rounded-[8px] hover:bg-red-700 disabled:opacity-50"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
