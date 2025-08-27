"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { useLocation } from "@/app/userLocationContext";
import { useRouter } from "next/navigation";

import type { Review } from "@/types/generated";

// Helper to get the best available address string
const getDisplayAddress = (loc: Review["location"]) => {
  if (loc?.fullAddress && loc.fullAddress.trim() !== "") return loc.fullAddress;
  const parts = [
    loc?.streetAddress || "",
    loc?.apartmentUnitNumber || "",
    loc?.district || "",
    loc?.city || "",
    loc?.country || "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No Address";
};

const FeaturedReviews = () => {
  const router = useRouter();
  const { selectedCountryCode } = useLocation();
  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 3,
    countryCode: selectedCountryCode,
  });

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="text-lg text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[300px] flex-col gap-4">
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
      </section>
    );
  }

  const reviews: Review[] = data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-2 py-10">
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-500 mb-2">No reviews found.</p>
          <p className="text-gray-400">Be the first to leave a review!</p>
        </div>
      </section>
    );
  }

  // Show only the three most recent reviews
  const featuredReviews = reviews.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
            Reviews
          </p>
          <h2 className="text-xl md:text-xl font-semibold text-gray-800">
            Featured reviews ({data?.totalReviews ?? reviews.length})
          </h2>
        </div>
        <Link href="/reviewsPage">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
            <span className="text-sm md:text-base mr-2">See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      {/* Enhanced Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featuredReviews.map((review: Review) => (
          <article
            key={review._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
            onClick={() => router.push(`/reviewsPage/${review._id}`)}
            tabIndex={0}
            role="button"
            aria-label={`View details for review at ${getDisplayAddress(
              review.location
            )}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/reviewsPage/${review._id}`);
              }
            }}
          >
            <div className="relative w-full h-48 overflow-hidden">
              {review.linkedProperty?.media?.coverPhoto ? (
                <Image
                  src={
                    review?.linkedProperty.media?.coverPhoto &&
                    review.linkedProperty?.media?.coverPhoto.trim() !== ""
                      ? review.linkedProperty.media.coverPhoto
                      : "/Reviews.png"
                  }
                  alt={
                    review?.linkedProperty.media?.coverPhoto &&
                    review.linkedProperty?.media?.coverPhoto.trim() !== ""
                      ? `Property image for ${review.location.streetAddress}`
                      : "Reviews placeholder image"
                  }
                  width={400}
                  height={270}
                  className="object-cover w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                  priority={false}
                />
              ) : (
                <div className="w-full h-full">
                  <Image
                    src="/Reviews.png"
                    alt="Reviews placeholder image"
                    width={400}
                    height={270}
                    className="object-cover w-full h-full"
                    style={{ width: 'auto', height: 'auto' }}
                    priority={false}
                  />
                </div>
              )}

              {/* Status and Verification Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                {review.isLinkedToDatabaseProperty && (
                  <span className="bg-teal-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h1 className="text-gray-800 font-medium text-lg">
                {getDisplayAddress(review.location)}
              </h1>
              <h3 className="font-medium text-gray-800 text-base line-clamp-2">
                {review.location.streetAddress}
                {review.location.apartmentUnitNumber &&
                  `, ${review.location.apartmentUnitNumber}`}
                {review.location.city}
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(review.overallRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {review.overallRating || 0}
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
                    <p className="font-semibold text-gray-900">
                      {review?.submitAnonymously
                        ? "Anonymous Reviewer"
                        : review?.reviewer?.firstName || ""}
                    </p>
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt || "").toLocaleDateString("en-US", {
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

      {/* Pagination info */}
      {data?.totalPages && data.totalPages > 1 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {featuredReviews.length} of{" "}
            {data?.totalReviews ?? reviews.length} reviews
          </p>
        </div>
      )}
    </section>
  );
};

export default FeaturedReviews;
