"use client";
import React, { useState, useEffect } from "react";
import { Eye, Trash2, Star, Power } from "lucide-react";
import { useGetAllAdminReviewsQuery } from "@/Hooks/use-getAllAdminReviews.query";
import AdminViewReviewModal from "@/app/admin/components/AdminViewReviewModal";
import AdminDeleteReviewModal from "@/app/admin/components/AdminDeleteReviewModal";

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-yellow-100 text-yellow-700",
  Verified: "bg-green-100 text-green-700",
  Flagged: "bg-red-100 text-red-600",
  flaaged: "bg-red-100 text-red-600",
};

// const pageSize = 6; // Removed unused variable

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewProperty, setSelectedReviewProperty] = useState<
    string | null
  >(null);

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  // Get initial data without search for client-side filtering
  const { data: initialData, isLoading: initialLoading, error: initialError } = useGetAllAdminReviewsQuery({
    sort: sortBy as "newest" | "oldest"
  });

  // Get search results
  const { data: searchData, isLoading: searchLoading, error: searchError } = useGetAllAdminReviewsQuery({
    search: debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2 ? debouncedSearchTerm.trim() : undefined,
    sort: sortBy as "newest" | "oldest"
  });

  // Use search results if available, otherwise use initial data for client-side filtering
  const data = debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2 ? searchData : initialData;
  const isLoading = debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2 ? searchLoading : initialLoading;
  const error = debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2 ? searchError : initialError;

  // Client-side filtering as fallback (for debugging)
  const filteredReviews = React.useMemo(() => {
  const reviews = data?.reviews || [];
    
    // Use initial data for client-side filtering when backend search fails
    const reviewsToFilter = debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2 && reviews.length === 0 
      ? (initialData?.reviews || [])
      : reviews;
    
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length < 2) {
      return reviewsToFilter;
    }
    
    const filtered = reviewsToFilter.filter(review => 
      review.reviewer?.toLowerCase().trim().includes(debouncedSearchTerm.toLowerCase().trim())
    );
    
    return filtered;
  }, [data?.reviews, debouncedSearchTerm, initialData?.reviews]);

  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleViewReview = (id: string) => {
    setSelectedReviewId(id);
  };

  const handleDeleteReview = (id: string, property: string) => {
    setSelectedReviewId(id);
    setSelectedReviewProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReviewId(null);
    setSelectedReviewProperty(null);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
          <div className="text-sm md:text-base">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
          <div className="text-red-500 text-sm md:text-base">Error: {(error as Error).message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Reviews</h1>
      
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6 w-full">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search Reviews"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-sm md:text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Eye className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs md:text-sm">Sort by</span>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredReviews.length === 0 && searchTerm && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
            <p className="text-gray-500 text-sm">No reviews found for &ldquo;{searchTerm}&rdquo;</p>
            <p className="text-gray-400 text-xs mt-1">Try searching with the reviewer&apos;s first name</p>
          </div>
        )}
        {filteredReviews.map((review, idx) => {
          const ratingValue =
            review.rating && typeof review.rating === "string"
              ? parseFloat(review.rating.split("/")[0])
              : 0;
          const maxRating = 5;
          return (
            <div key={`${review.id}-${idx}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#2D3A4A] truncate">
                    {review.property}
                  </h3>
                  <p className="text-xs text-gray-500">
                    By {review.reviewer}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => handleViewReview(review?.id)}
                    className="text-gray-400 hover:text-[#2D3A4A] p-1"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id, review.property || "N/A")}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {renderStars(ratingValue, maxRating)}
                  <span className="text-gray-500 font-medium">
                    {review.rating}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Comment:</span>
                  <p className="text-gray-900 mt-1 line-clamp-2">
                    {review.comment}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[String(review.status)] ||
                      statusColors["Flagged"]
                    }`}
                  >
                    {review.status === "flaaged" ? "Flagged" : review.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
            {filteredReviews.length === 0 && searchTerm ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  <div>
                    <p>No reviews found for &ldquo;{searchTerm}&rdquo;</p>
                    <p className="text-sm text-gray-400 mt-1">Try searching with the reviewer&apos;s first name</p>
                  </div>
                </td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              filteredReviews.map((review, idx) => {
              const ratingValue =
                review.rating && typeof review.rating === "string"
                  ? parseFloat(review.rating.split("/")[0])
                  : 0;
              const maxRating = 5;
              return (
                <tr
                  key={`${review.id}-${idx}`}
                  className="hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-semibold text-[#2D3A4A] truncate max-w-[150px]">
                    {review.property}
                  </td>
                  <td className="py-3 px-4 truncate max-w-[120px]">{review.reviewer}</td>
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
                      statusColors["Active"]
                    }`}
                  >
                    {review.status === "flaaged" ? "Flagged" : 
                     review.status === "verified" ? "Active" : 
                     review.status === "flagged" ? "Inactive" : 
                     review.status}
                  </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Eye
                        className="w-5 h-5 text-gray-400 hover:text-[#2D3A4A] cursor-pointer"
                        onClick={() => handleViewReview(review?.id)}
                      />
                      <Power
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
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
            }))
          }
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
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          ← Previous
        </button>
        
        {/* Always show Page 1 */}
        <button
          onClick={() => setPage(1)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            page === 1 
              ? "bg-[#C85212] text-white border border-[#C85212]" 
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          1
        </button>
        
        {/* Show additional pages only when there are multiple pages */}
        {totalPages > 1 && Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              page === number 
                ? "bg-[#C85212] text-white border border-[#C85212]" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page + 1)}
          disabled={totalPages <= 1 || page === totalPages}
        >
          Next →
        </button>
      </div>
      </div>
    </div>
  );
}
