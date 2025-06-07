"use client";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Review, AllReviewsProps } from "@/types/generated";

// Sort options configuration
const sortOptions = [
  {
    label: "Most Recent",
    value: "mostRecent",
    sortBy: "mostRecent",
    sortOrder: undefined,
  },
  {
    label: "Highest Rating",
    value: "highestRating",
    sortBy: "highestRating",
    sortOrder: "desc",
  },
];

const AllReviews: React.FC<AllReviewsProps> = ({
  className = "",
  showHeader = true,
  maxItems,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Most Recent");

  // Get sort parameters from URL
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;

  // Use the updated query hook with parameters
  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    sortBy,
    sortOrder,
  });
 

  // Update sort option display based on URL parameters
  useEffect(() => {
    if (sortBy) {
      const currentOption = sortOptions.find(
        (option) => option.sortBy === sortBy
      );
      if (currentOption) {
        setSortOption(currentOption.label);
      }
    }
  }, [sortBy]);

  // Handle sort change
  const handleSortChange = (option: (typeof sortOptions)[0]) => {
    setSortOption(option.label);
    setIsDropdownOpen(false);

    // Build query parameters
    const params = new URLSearchParams();
    params.append("sortBy", option.sortBy);
    if (option.sortOrder) {
      params.append("sortOrder", option.sortOrder);
    }

    // Navigate with new sort parameters
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="text-lg text-gray-600">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <p className="text-lg text-red-600 mb-2">Error loading reviews</p>
              <p className="text-gray-500 text-sm">{error.message}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const reviews: Review[] = data?.reviews || [];
  const displayReviews = maxItems ? reviews.slice(0, maxItems) : reviews;

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Sorting */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Property
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">
                    Page 1 of {data?.totalPages || 1}
                  </p>
                  {/* Display current sort status */}
                  {sortBy && (
                    <p className="text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      Sorted by:{" "}
                      {sortBy === "mostRecent"
                        ? "Most Recent"
                        : "Highest Rating"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Total Reviews */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Reviews</p>
                  <p className="text-2xl mr-10 font-semibold text-gray-900">
                    {data?.totalReviews || reviews.length}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
                    <span className="text-gray-600 text-sm">Sort by</span>
                    <div className="relative">
                      <button
                        className="flex items-center gap-2 text-gray-800 min-w-[120px] justify-between"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="listbox"
                      >
                        {sortOption}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <ul
                          className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20 border"
                          role="listbox"
                        >
                          {sortOptions.map((option) => (
                            <li
                              key={option.value}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 ${
                                sortOption === option.label
                                  ? "bg-teal-50 text-teal-700"
                                  : ""
                              }`}
                              onClick={() => handleSortChange(option)}
                              role="option"
                              aria-selected={sortOption === option.label}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-2">No reviews found.</p>
            <p className="text-gray-400">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridCols}`}>
            {displayReviews.map((review: Review) => (
              <article
                key={review._id}
                onClick={() => router.push(`/reviewsPage/${review._id}`)}
                className=" cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {review.linkedProperty?.media?.coverPhoto ? (
                    <img
                      src={
                        review?.linkedProperty.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? review.linkedProperty.media.coverPhoto
                          : "/placeholder.png"
                      }
                      alt="property image"
                      width={180}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-2xl">🏠</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          No Image Available
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status and Verification Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    {/* <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
                        review.status === ""
                          ? "bg-yellow-100/90 text-yellow-800"
                          : "bg-green-100/90 text-green-800"
                      }`}
                    >
                      {review.status.charAt(0).toUpperCase() +
                        review.status.slice(1)}
                    </span> */}

                    {review.isLinkedToDatabaseProperty && (
                      <span className="bg-teal-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-medium text-gray-800 text-base line-clamp-2">
                    {review.location.streetAddress}
                    {review.location.apartmentUnitNumber &&
                      `, ${review.location.apartmentUnitNumber}`}
                    {review.location.district &&
                      `, ${review.location.district}`}
                    , {review.location.city}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(review.overallRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {review.overallRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({review.overallRating.toFixed(0)} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {review.detailedReview}
                  </p>

                  {/* Rating Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Value:</span>
                      <span>{review.valueForMoney}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Experience:</span>
                      <span>{review.overallExperience}/5</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {review.submitAnonymously ? "A" : "R"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {review.submitAnonymously ? "Anonymous" : "Reviewer"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {showHeader && data?.totalPages && data.totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              ← Previous
            </button>

            {[...Array(Math.min(data.totalPages, 10))].map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 text-sm rounded transition-colors ${
                  i + 1 === (data.currentPage || 1)
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {data.totalPages > 10 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  {data.totalPages}
                </button>
              </>
            )}

            <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
