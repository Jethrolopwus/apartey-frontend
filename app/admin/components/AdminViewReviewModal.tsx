import React from "react";
import { X } from "lucide-react";
import { useGetAdminReviewsByIdQuery } from "@/Hooks/use-getAdminReviewsById.query";

interface AdminViewReviewModalProps {
  reviewId: string | null;
  onClose: () => void;
}

export default function AdminViewReviewModal({
  reviewId,
  onClose,
}: AdminViewReviewModalProps) {
  const { data, isLoading, error } = useGetAdminReviewsByIdQuery(
    reviewId || ""
  );

  if (!reviewId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-[8px] shadow-lg">
        <div className="flex justify-between items-center p-[16px] border-b border-gray-200 h-[40px]">
          <h3 className="text-[18px] font-semibold text-[#2D3A4A]">
            Review Details
          </h3>
          <button
            onClick={onClose}
            className="ml-[8px] text-gray-400 hover:text-[#1E2A38]"
          >
            <X className="w-[24px] h-[24px]" />
          </button>
        </div>
        <div className="p-[16px] space-y-[24px] max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p className="text-[14px] text-center">Loading...</p>
          ) : error ? (
            <p className="text-[14px] text-red-500 text-center">
              Error: {(error as Error).message}
            </p>
          ) : data ? (
            <>
              <p>
                <strong className="text-[#2D3A4A]">Property:</strong>{" "}
                <span className="text-[14px]">{data.property || "N/A"}</span>
              </p>
              <p>
                <strong className="text-[#2D3A4A]">Reviewer:</strong>{" "}
                <span className="text-[14px]">{data.reviewer || "N/A"}</span>
              </p>
              <p>
                <strong className="text-[#2D3A4A]">Rating:</strong>{" "}
                <span className="text-[14px]">{data.rating || "N/A"}</span>
              </p>
              <p>
                <strong className="text-[#2D3A4A]">Comment:</strong>{" "}
                <span className="text-[14px]">{data.comment || "N/A"}</span>
              </p>
              <p>
                <strong className="text-[#2D3A4A]">Status:</strong>{" "}
                <span className="text-[14px]">
                  {data.status === "flaaged" ? "Flagged" : data.status || "N/A"}
                </span>
              </p>
              <p>
                <strong className="text-[#2D3A4A]">Date:</strong>{" "}
                <span className="text-[14px]">{data.date || "N/A"}</span>
              </p>
            </>
          ) : (
            <p className="text-[14px] text-center">No review found</p>
          )}
        </div>
      </div>
    </div>
  );
}
