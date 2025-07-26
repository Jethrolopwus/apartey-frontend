"use client";
import React, { useState } from "react";
import { Eye, Trash2, Star } from "lucide-react";
import { useGetAllAdminReviewsQuery } from "@/Hooks/use-getAllAdminReviews.query";
import AdminViewReviewModal from "@/app/admin/components/AdminViewReviewModal";
import AdminDeleteReviewModal from "@/app/admin/components/AdminDeleteReviewModal";

const statusColors: Record<string, string> = {
  Verified: "bg-green-100 text-green-700",
  Flagged: "bg-red-100 text-red-600",
  flaaged: "bg-red-100 text-red-600",
};

const pageSize = 6;

function renderStars(rating: number, max: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
          fill="currentColor"
        />
      ))}
      {halfStar && (
        <Star
          className="w-4 h-4 text-yellow-400"
          fill="none"
          strokeDasharray="2,2"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={i + fullStars + 1}
          className="w-4 h-4 text-gray-200"
          fill="none"
        />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewProperty, setSelectedReviewProperty] = useState<
    string | null
  >(null);

  const { data, isLoading, error } = useGetAllAdminReviewsQuery({
    limit: pageSize,
    page,
  });

  const reviews = data?.reviews || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleViewReview = (id: string) => {
    console.log("AdminReviews Debug: Viewing review:", id);
    setSelectedReviewId(id);
  };

  const handleDeleteReview = (id: string, property: string) => {
    console.log(
      "AdminReviews Debug: Opening delete modal for review:",
      id,
      property
    );
    setSelectedReviewId(id);
    setSelectedReviewProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("AdminReviews Debug: Closing modals");
    setSelectedReviewId(null);
    setSelectedReviewProperty(null);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A] mb-8">Reviews</h2>
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Reviews"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Eye className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Sort by</span>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr className="text-[#2D3A4A] font-semibold text-base">
              <th className="py-4 px-4">PROPERTY</th>
              <th className="py-4 px-4">REVIEWER</th>
              <th className="py-4 px-4">RATING</th>
              <th className="py-4 px-4">COMMENT</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, idx) => {
              const ratingValue =
                review.rating && typeof review.rating === "string"
                  ? parseFloat(review.rating.split("/")[0])
                  : 0;
              const maxRating = 5;
              return (
                <tr
                  key={review.id || idx}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-semibold text-[#2D3A4A]">
                    {review.property}
                  </td>
                  <td className="py-3 px-4">{review.reviewer}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {renderStars(ratingValue, maxRating)}
                      <span className="text-gray-500 text-xs font-medium">
                        {review.rating}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    {review.comment}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[String(review.status)] ||
                        statusColors["Flagged"]
                      }`}
                    >
                      {review.status === "flaaged" ? "Flagged" : review.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Eye
                        className="w-5 h-5 text-gray-400 hover:text-[#2D3A4A] cursor-pointer"
                        onClick={() => handleViewReview(review?.id)}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-400 hover:text-red-600 cursor-pointer"
                        onClick={() =>
                          handleDeleteReview(
                            review.id,
                            review.property || "N/A"
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AdminViewReviewModal
        reviewId={selectedReviewId}
        onClose={handleCloseModal}
      />
      <AdminDeleteReviewModal
        reviewId={isDeleteModalOpen ? selectedReviewId : null}
        reviewProperty={isDeleteModalOpen ? selectedReviewProperty : null}
        onClose={handleCloseModal}
      />
      <div className="flex items-center justify-between mt-6">
        <button
          className="text-gray-400 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &lt; Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-[#2D3A4A] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="text-gray-400 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
