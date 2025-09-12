"use client";
import { useGetReviewByIdQuery } from "@/Hooks/use-GetReviewById.query";
import { useUpdateReviewsToggleLikeMutation } from "@/Hooks/use.reviewLikeToggle.mutation";
import { useUpdateReviewsFlagMutation } from "@/Hooks/use.flagReviews.mutation";
import {
  ArrowLeft,
  Star,
  Home,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Flag,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ListingsButtons from "@/components/atoms/Buttons/ListingButtons";
import { useState, useEffect } from "react";
import FlagModalForm from "@/components/molecules/FlagModalForm";
import toast from "react-hot-toast";

interface Props {
  id: string;
}

// Define a type for the location object
interface ReviewLocation {
  fullAddress?: string;
  streetAddress?: string;
  apartmentUnitNumber?: string;
  district?: string;
  city?: string;
  country?: string;
}

// Helper to get reviewer initial
const getReviewerInitial = (review: { submitAnonymously?: boolean; reviewer?: { firstName?: string } }) => {
  if (review.submitAnonymously) return "A";
  if (review.reviewer?.firstName) {
    return review.reviewer.firstName.charAt(0).toUpperCase();
  }
  return "R";
};

export default function ReviewDetails({ id }: Props) {
  const { data, isLoading, error } = useGetReviewByIdQuery(id);
  const review = data?.review;
  const relatedReviews = data?.relatedReviews || [];

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const {
    toggleLike,
    isLoading: isLiking,
    data: likeData,
  } = useUpdateReviewsToggleLikeMutation();
  const {
    flagReview,
    isLoading: isFlagging,
    error: flagError,
    data: flagData,
  } = useUpdateReviewsFlagMutation();
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagCount, setFlagCount] = useState(0);

  useEffect(() => {
    if (review) {
      setLiked(!!review.liked);
      setLikeCount(review.likeCount || 0);
      setFlagCount(review.flagCount || 0);
    }
  }, [review]);

  useEffect(() => {
    if (likeData && likeData.data && likeData.data.reviewId === review?._id) {
      setLiked(!!likeData.data.liked);
      setLikeCount(likeData.data.likeCount || 0);
    }
  }, [likeData, review]);

  useEffect(() => {
    if (flagData && flagData.success) {
      setFlagOpen(false);
      toast.success(flagData.message || "Review flagged successfully!");
      if (typeof flagData.data?.flagCount === "number") {
        setFlagCount(flagData.data.flagCount);
      } else {
        setFlagCount((prev) => prev + 1);
      }
    }
    if (flagError) {
      toast.error(flagError.message || "Failed to flag review.");
    }
  }, [flagData, flagError]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212]"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <p className="text-lg text-red-600 mb-2">Review not found</p>
            <p className="text-gray-500 text-sm">
              The review you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number, countryCode?: string) => {
    // Default to EUR for Estonia, USD for others
    const currency = countryCode === "EE" ? "EUR" : "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAccessibilityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "very close":
        return "bg-[#C85212]/10 text-[#C85212]";
      case "close":
        return "bg-blue-100 text-blue-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "far":
        return "bg-orange-100 text-orange-800";
      case "very far":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to get the best available address string
  const getDisplayAddress = (loc: ReviewLocation) => {
    if (loc?.fullAddress && loc.fullAddress.trim() !== "")
      return loc.fullAddress;
    const parts = [
      loc?.streetAddress || "",
      loc?.apartmentUnitNumber || "",
      loc?.district || "",
      loc?.city || "",
      loc?.country || "",
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No Address";
  };

  // Handle flag submit
  const handleFlagSubmit = (reason: string, otherText?: string) => {
    const reviewId = review?.id || review?._id;
    if (!reviewId) {
      toast.error("Review not loaded. Please try again.");
      return;
    }
    flagReview({ id: reviewId, reason, otherText });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:flex lg:gap-10">
      {/* Left Column */}
      <div className="flex-1">
        <Link
          href="/reviewsPage"
          className="text-[#C85212] flex items-center gap-2 mb-6 text-sm font-medium hover:underline transition-colors"
        >
          <ArrowLeft size={16} /> Back to Reviews
        </Link>

        {/* Property Image */}
        <div className="relative mb-6">
          <Image
            src={review?.linkedProperty?.media?.coverPhoto || "/Apartment1.png"}
            alt="Review Property"
            width={800}
            height={400}
            className="rounded-lg w-full object-cover"
            priority={false}
          />
          {review?.linkedProperty && (
            <span className="absolute top-4 right-4 bg-[#C85212] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Verified Property
            </span>
          )}
          {/* Like and Flag Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              className={`bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-[#C85212]/10 transition-colors flex items-center justify-center ${
                isLiking ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Like"
              type="button"
              onClick={() => {
                if (!isLiking && review?._id) toggleLike(review._id);
              }}
              disabled={isLiking}
            >
              <Heart
                size={18}
                className={liked ? "fill-red-500 text-red-500" : "text-red-500"}
                fill={liked ? "#ef4444" : "none"}
              />
              <span className="ml-1 text-xs font-semibold text-gray-700 min-w-[16px] text-center">
                {likeCount}
              </span>
            </button>
            <button
              className="bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-red-50 transition-colors flex items-center justify-center"
              aria-label="Flag"
              type="button"
              onClick={() => (review?.id || review?._id) && setFlagOpen(true)}
            >
              <Flag size={18} className="text-red-500" fill="none" />
              <span className="ml-1 text-xs font-semibold text-gray-700 min-w-[16px] text-center">
                {flagCount}
              </span>
            </button>
          </div>
        </div>
        <FlagModalForm
          isOpen={flagOpen}
          onClose={() => setFlagOpen(false)}
          onSubmit={handleFlagSubmit}
          loading={isFlagging}
        />

        <div className="p-4 space-y-3">
          <h1 className="text-gray-800 font-medium text-lg">
            {getDisplayAddress(review.location)}
          </h1>
          
          {/* Property Details */}
          {review.linkedProperty && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {review.linkedProperty.bedrooms && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-semibold text-[#C85212]">{review.linkedProperty.bedrooms}</div>
                  </div>
                )}
                {review.linkedProperty.bathrooms && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-semibold text-[#C85212]">{review.linkedProperty.bathrooms}</div>
                  </div>
                )}
                {review.linkedProperty.propertyType && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold text-[#C85212]">{review.linkedProperty.propertyType}</div>
                  </div>
                )}
                {review.linkedProperty.price && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="font-semibold text-[#C85212]">
                      {formatCurrency(review.linkedProperty.price, review.location.countryCode)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
              {(review.overallRating || 0).toFixed(1)}
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
            {review.costOfRepairsCoverage && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Repairs:</span>
                <span className="text-[#C85212]">{review.costOfRepairsCoverage}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C85212] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {getReviewerInitial(review)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                <p className="font-semibold text-gray-900">
                  {review?.submitAnonymously
                    ? "Anonymous Reviewer"
                    : review?.reviewer?.firstName || "Reviewer"}
                </p>
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stay Details Section */}
        {review?.stayDetails && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home size={20} className="text-[#C85212]" />
              Stay Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {review?.stayDetails?.numberOfRooms && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rooms:</span>
                  <span className="font-medium">
                    {review.stayDetails.numberOfRooms}
                  </span>
                </div>
              )}
              {review?.stayDetails?.numberOfOccupants && (
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Occupants:</span>
                  <span className="font-medium">
                    {review.stayDetails.numberOfOccupants}
                  </span>
                </div>
              )}
              {review?.stayDetails?.dateLeft && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Exit Date:</span>
                  <span className="font-medium">
                    {new Date(review.stayDetails.dateLeft).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Furnished:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review?.stayDetails?.furnished
                      ? "bg-[#C85212]/10 text-[#C85212]"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {review?.stayDetails?.furnished ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Appliances & Fixtures */}
            {review?.stayDetails?.appliancesFixtures &&
              review.stayDetails.appliancesFixtures.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Appliances & Fixtures
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {review.stayDetails.appliancesFixtures.map(
                      (item: string) => (
                        <span
                          key={item}
                          className="text-xs bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-blue-700"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Building Facilities */}
            {review?.stayDetails?.buildingFacilities &&
              review.stayDetails.buildingFacilities.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Building Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {review.stayDetails.buildingFacilities.map(
                      (item: string) => (
                        <span
                          key={item}
                          className="text-xs bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-purple-700"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Landlord Languages */}
            {review?.stayDetails?.landlordLanguages &&
              review.stayDetails.landlordLanguages.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Landlord Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {review.stayDetails.landlordLanguages.map(
                      (lang: string) => (
                        <span
                          key={lang}
                          className="text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-gray-700"
                        >
                          {lang}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Cost Details Section */}
        {review?.costDetails && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-[#C85212]" />
              Cost Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review?.costDetails?.rent && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    Rent ({review?.costDetails?.rentType})
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(review.costDetails.rent)}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Security Deposit:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review?.costDetails?.securityDepositRequired
                        ? "bg-orange-100 text-orange-800"
                        : "bg-[#C85212]/10 text-[#C85212]"
                    }`}
                  >
                    {review?.costDetails?.securityDepositRequired
                      ? "Required"
                      : "Not Required"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Agent/Broker Fee:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review?.costDetails?.agentBrokerFeeRequired
                        ? "bg-orange-100 text-orange-800"
                        : "bg-[#C85212]/10 text-[#C85212]"
                    }`}
                  >
                    {review?.costDetails?.agentBrokerFeeRequired
                      ? "Required"
                      : "Not Required"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Fixed Utility Cost:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review?.costDetails?.fixedUtilityCost
                        ? "bg-blue-100 text-orange-500"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {review?.costDetails?.fixedUtilityCost ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Utility Costs */}
            {(review?.costDetails?.julySummerUtilities ||
              review?.costDetails?.januaryWinterUtilities) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Monthly Utility Costs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {review?.costDetails?.julySummerUtilities && (
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600">Summer (July)</div>
                      <div className="font-bold text-yellow-700">
                        {formatCurrency(review.costDetails.julySummerUtilities)}
                      </div>
                    </div>
                  )}
                  {review?.costDetails?.januaryWinterUtilities && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        Winter (January)
                      </div>
                      <div className="font-bold text-blue-700">
                        {formatCurrency(
                          review.costDetails.januaryWinterUtilities
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Accessibility Section */}
        {review?.accessibility && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#C85212]" />
              Accessibility & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {review?.accessibility?.nearestGroceryStore && (
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">
                    Nearest Grocery Store
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAccessibilityColor(
                      review.accessibility.nearestGroceryStore
                    )}`}
                  >
                    {review.accessibility.nearestGroceryStore}
                  </span>
                </div>
              )}
              {review?.accessibility?.nearestPark && (
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Nearest Park</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAccessibilityColor(
                      review.accessibility.nearestPark
                    )}`}
                  >
                    {review.accessibility.nearestPark}
                  </span>
                </div>
              )}
              {review?.accessibility?.nearestRestaurant && (
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">
                    Nearest Restaurant
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAccessibilityColor(
                      review.accessibility.nearestRestaurant
                    )}`}
                  >
                    {review.accessibility.nearestRestaurant}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ratings Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Rating Breakdown
          </h3>
          <div className="space-y-4">
            {review?.valueForMoney && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Value for Money</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.valueForMoney
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {review.valueForMoney}/5
                  </span>
                </div>
              </div>
            )}

            {review?.overallExperience && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Experience</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.overallExperience
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {review.overallExperience}/5
                  </span>
                </div>
              </div>
            )}

            {review?.costOfRepairsCoverage && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-600">Repairs Coverage</span>
                <span className="font-medium text-[#C85212]">
                  {review.costOfRepairsCoverage}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Detailed Review
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {review?.detailedReview}
          </p>

          {review?.pros && review.pros.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-[#C85212] mb-2">✓ Pros</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 pl-4 space-y-1">
                {review.pros.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {review?.cons && review.cons.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700 mb-2">✗ Cons</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 pl-4 space-y-1">
                {review.cons.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Amenities */}
        {review?.amenities && review.amenities.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Available Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {review.amenities.map((item: string) => (
                <span
                  key={item}
                  className="text-sm bg-[#C85212]/10 border border-[#C85212]/20 px-3 py-2 rounded-lg text-[#C85212]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            Apartely is a community-powered rental platform designed to help
            renters make informed decisions about their next home.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-96 mt-10 lg:mt-0">
        {/* Reviewer Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#C85212] flex items-center justify-center">
              <span className="text-white font-semibold">
                {getReviewerInitial(review)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {review?.submitAnonymously
                  ? "Anonymous Reviewer"
                  : review?.reviewer?.firstName || "Reviewer"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review?.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          {review?.durationOfStay && (
            <p className="text-sm text-gray-600 mb-4">
              Lived here for{" "}
              <span className="font-medium">
                {review.durationOfStay} months
              </span>
            </p>
          )}

          <p className="text-xs text-gray-500 mb-4">
            Status:{" "}
            <span
              className={`font-medium ${
                review?.status === "pending"
                  ? "text-yellow-600"
                  : "text-[#C85212]"
              }`}
            >
              {review?.status || "Unknown"}
            </span>
          </p>
        </div>

        {/* Related Reviews */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-bold mb-4 text-gray-900">Related Reviews</h4>
          {relatedReviews.length > 0 ? (
            <>
              {relatedReviews
                .slice(0, 3)
                .map((relatedReview: unknown) => {
                  // Type guard to ensure relatedReview is an object with expected properties
                  if (
                    !relatedReview ||
                    typeof relatedReview !== "object" ||
                    !("_id" in relatedReview)
                  ) {
                    return null;
                  }

                  const review = relatedReview as {
                    _id: string;
                    propertyReference?: {
                      propertyId?: {
                        media?: {
                          coverPhoto?: string;
                        };
                      };
                    };
                    location?: {
                      streetAddress?: string;
                    };
                    ratingsAndReviews?: {
                      overallRating?: number;
                      detailedReview?: string;
                    };
                    costDetails?: {
                      rentType?: string;
                      rent?: number;
                    };
                  };

                  return (
                    <div
                      key={review._id}
                      className="flex items-center gap-3 mb-4 last:mb-0"
                    >
                      <Image
                        src={
                          review?.propertyReference?.propertyId?.media
                            ?.coverPhoto || "/cleanHouse.png"
                        }
                        alt="Related Property"
                        width={80}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {review?.location?.streetAddress ||
                            "Property Address"}
                        </p>
                        <div className="flex items-center gap-1 mb-1">
                          <Star
                            className="text-yellow-400 fill-current"
                            size={12}
                          />
                          <span className="text-xs text-gray-600">
                            {review?.ratingsAndReviews?.overallRating || 0}.0
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {review?.ratingsAndReviews?.detailedReview ||
                            "No review text available"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {review?.costDetails?.rentType}:{" "}
                          {formatCurrency(review?.costDetails?.rent || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)}{" "}
              {/* Filter out null values */}
            </>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No related reviews available</p>
            </div>
          )}
          <ListingsButtons className="w-full mt-4  flex justify-center items-center text-sm">
            <Link href="/write-reviews/listed">
              Leave a Review
            </Link>
          </ListingsButtons>
        </div>
      </div>
    </div>
  );
}
