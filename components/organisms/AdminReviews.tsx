"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Eye,
  Star,
  Power,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useGetAllAdminReviewsQuery } from "@/Hooks/use-getAllAdminReviews.query";
import AdminViewReviewModal from "@/app/admin/components/AdminViewReviewModal";
import AdminDeleteReviewModal from "@/app/admin/components/AdminDeleteReviewModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Reasons = {
  reason: string;
  otherText: string;
  count: number;
};
interface AdminReviews {
  id: string;
  property: string | undefined;
  reviewer: string | undefined;
  rating: string | undefined;
  status: "verified" | "flagged" | undefined;
  comment: string | undefined;
  date: string | undefined;
  flaggedByCount?: number;
  likedByCount?: number;
  flaggingReasons?: Reasons[];
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  flagged: "bg-red-100 text-red-600",
};

function renderStars(rating: number, max: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      ))}
      {halfStar && (
        <Star key="half" className="w-4 h-4 text-yellow-400" fill="none" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-200"
          fill="none"
        />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 
  const [selectedDeleteReviewId, setSelectedDeleteReviewId] = useState<
    string | null
  >(null);
  const [selectedDeleteReviewProperty, setSelectedDeleteReviewProperty] =
    useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // reset page on sort change
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const { data, isLoading, error } = useGetAllAdminReviewsQuery({
    page,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    sortBy,
  });

  const reviews = data?.reviews || [];
  const pagination = data?.pagination;

  // Handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };


  const handleViewReview = (id: string) => setSelectedReviewId(id);

  const handleDeleteReview = (id: string, property: string) => {
    setSelectedDeleteReviewId(id);
    setSelectedDeleteReviewProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedDeleteReviewId(null);
    setSelectedDeleteReviewProperty(null);
    setIsDeleteModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setSelectedReviewId(null);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-sm md:text-base">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A]">Reviews</h2>

      {/* Search + Sort */}
      <div className="flex items-center justify-between p-2 rounded-md w-full bg-white mt-3">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search Reviews"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-sm md:text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs md:text-sm">Sort by</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-[#2D3A4A] font-semibold text-base">
              <th className="py-4 px-4">PROPERTY</th>
              <th className="py-4 px-4">REVIEWER</th>
              <th className="py-4 px-4">RATING</th>
              <th className="py-4 px-4">COMMENT</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review: AdminReviews, idx: number) => {
                const ratingValue =
                  typeof review.rating === "string"
                    ? parseFloat(review.rating.split("/")[0])
                    : review.rating || 0;

                const status =
                  review.status?.toLowerCase() === "flagged"
                    ? "flagged"
                    : "active";

                return (
                  <tr key={`${review.id}-${idx}`} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-[#2D3A4A] truncate max-w-[150px]">
                      {review.property}
                    </td>
                    <td className="py-3 px-4 truncate max-w-[120px]">
                      {review.reviewer}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {renderStars(ratingValue, 5)}
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
                          statusColors[status] || statusColors["active"]
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <Eye
                          className="w-5 h-5 text-gray-400 hover:text-[#2D3A4A] cursor-pointer"
                          onClick={() => handleViewReview(review?.id)}
                        />
                        <Power
                          className="w-5 h-5 text-gray-400 hover:text-red-600 cursor-pointer"
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AdminViewReviewModal
        reviewId={selectedReviewId}
        onClose={handleCloseViewModal}
      />
      <AdminDeleteReviewModal
        reviewId={isDeleteModalOpen ? selectedDeleteReviewId : null}
        reviewProperty={isDeleteModalOpen ? selectedDeleteReviewProperty : null}
        onClose={handleCloseDeleteModal}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded disabled:opacity-50 flex items-center text-sm"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </button>

          {/* Page numbers with ellipsis */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (p === 1 || p === pagination.totalPages) return true;
              if (p >= page - 1 && p <= page + 1) return true;
              return false;
            })
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx] - arr[idx - 1] > 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded text-sm cursor-pointer ${
                    page === p
                      ? "bg-[#C85212] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}

          {/* Next button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
