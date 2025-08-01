"use client";
import Image from "next/image";
import { Star, ChevronDown, Filter } from "lucide-react";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { useLocation } from "@/app/userLocationContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { Review, AllReviewsProps } from "@/types/generated";
import SearchInput, { PlacePrediction } from "../atoms/Buttons/SearchInput";
import { toast } from "react-hot-toast";

// Sort options configuration
const sortOptions = [
  { label: "Recent", value: "recent" },
  { label: "Highest Rating", value: "highest_rating" },
  { label: "Lowest Rating", value: "lowest_rating" },
];

// Define a type for the location object
interface ReviewLocation {
  fullAddress?: string;
  streetAddress?: string;
  apartmentUnitNumber?: string;
  apartment?: string;
  district?: string;
  city?: string;
  country?: string;
}

// Helper to get the best available address string
const getDisplayAddress = (loc: ReviewLocation) => {
  if (loc?.fullAddress && loc.fullAddress.trim() !== "") return loc.fullAddress;
  const parts = [
    loc?.streetAddress || "",
    loc?.apartmentUnitNumber || loc?.apartment || "",
    loc?.district || "",
    loc?.city || "",
    loc?.country || "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No Address";
};

const AllReviews: React.FC<AllReviewsProps> = ({
  className = "",
  showHeader = true,
  maxItems,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedCountryCode } = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [apartment, setApartment] = useState<string>(
    decodeURIComponent(searchParams.get("apartment") || "all")
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    decodeURIComponent(searchParams.get("q") || "")
  );
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [apartmentNumbers, setApartmentNumbers] = useState<string[]>([]);
  const lastValidQuery = useRef({ searchQuery, apartment });

  // Use the query hook without apartment parameter to fetch all reviews
  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: maxItems || 10,
    countryCode: selectedCountryCode,
    page: Number(searchParams.get("page")) || 1,
    searchQuery: searchQuery || undefined,
  });

  // Compute searchInputValue for SearchInput component
  const searchInputValue = useMemo(() => {
    return searchQuery;
  }, [searchQuery]);

  // Extract unique apartment numbers and set reviews
  useEffect(() => {
    if (data) {
      console.log("API Response:", data);
      // Extract unique apartment numbers
      const uniqueApts = Array.from(
        new Set(
          (data.reviews || [])
            .map(
              (review) =>
                review.location?.apartmentUnitNumber ||
                review.location?.apartment ||
                ""
            )
            .filter(Boolean)
        )
      );
      setApartmentNumbers(uniqueApts);
      setFilteredReviews(data.reviews || []);

      // Apply apartment filter if one is selected
      if (apartment !== "all") {
        const filtered = (data.reviews || []).filter(
          (review) =>
            (
              review.location?.apartmentUnitNumber ||
              review.location?.apartment ||
              ""
            ).toLowerCase() === apartment.toLowerCase()
        );
        setFilteredReviews(filtered);
        if (filtered.length === 0) {
          toast.error(`No reviews found for apartment ${apartment}.`);
          setApartment("all");
        }
      }

      if (data.reviews?.length === 0 && searchQuery) {
        toast.error("No reviews found for this address.");
        lastValidQuery.current = { searchQuery, apartment };
      } else {
        lastValidQuery.current = { searchQuery, apartment };
      }

      // Validate apartment selection
      if (apartment !== "all" && !uniqueApts.includes(apartment)) {
        console.warn(
          `Selected apartment "${apartment}" not in apartmentNumbers:`,
          uniqueApts
        );
        toast.error(`No reviews found for apartment ${apartment}.`);
        setApartment("all");
      }
    }
  }, [data, searchQuery, apartment]);

  // Handle apartment filter
  const handleDropdownFilter = (selectedApartment: string) => {
    setApartment(selectedApartment);
    // Update URL without triggering a new API call
    const params = new URLSearchParams();
    params.set("countryCode", selectedCountryCode || "NG");
    if (selectedApartment !== "all") {
      params.set("apartment", encodeURIComponent(selectedApartment));
    }
    if (searchQuery) {
      params.set("q", encodeURIComponent(searchQuery));
    }
    params.delete("page"); // Reset to page 1
    const url = `/reviewsPage?${params.toString()}`;
    console.log("Navigating to:", url);
    router.push(url, { scroll: false });

    // Apply client-side filtering
    if (selectedApartment === "all") {
      setFilteredReviews(data?.reviews || []);
    } else {
      const filtered = (data?.reviews || []).filter(
        (review) =>
          (
            review.location?.apartmentUnitNumber ||
            review.location?.apartment ||
            ""
          ).toLowerCase() === selectedApartment.toLowerCase()
      );
      setFilteredReviews(filtered);
      if (filtered.length === 0) {
        toast.error(`No reviews found for apartment ${selectedApartment}.`);
      }
    }
  };

  // Handle search input submission
  const handleSearchSubmit = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams();
    params.set("countryCode", selectedCountryCode || "NG");
    if (value) {
      params.set("q", encodeURIComponent(value));
    }
    if (apartment !== "all") {
      params.set("apartment", encodeURIComponent(apartment));
    }
    params.delete("page"); // Reset to page 1
    const url = `/reviewsPage?${params.toString()}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsDropdownOpen(false);
    const sortedReviews = [...filteredReviews];
    if (value === "highest_rating") {
      sortedReviews.sort(
        (a, b) => (b.overallRating || 0) - (a.overallRating || 0)
      );
    } else if (value === "lowest_rating") {
      sortedReviews.sort(
        (a, b) => (a.overallRating || 0) - (b.overallRating || 0)
      );
    } else {
      sortedReviews.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
    setFilteredReviews(sortedReviews);
  };

  // Handle review click
  const handleReviewClick = (review: Review) => {
    if (review._id) {
      console.log("Navigating to review ID:", review._id);
      router.push(`/reviewsPage/${review._id}`);
    } else {
      toast.error("Unable to view review details: Missing review ID");
    }
  };

  // Handle keyboard navigation for accessibility
  const handleReviewKeyDown = (e: React.KeyboardEvent, review: Review) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleReviewClick(review);
    }
  };

  // Render star ratings
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i === Math.floor(rating) && rating % 1 >= 0.5
            ? "fill-yellow-400 text-yellow-400 opacity-50"
            : "text-gray-300"
        }
      />
    ));
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className={`grid gap-6 ${gridCols}`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
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
              <p className="text-gray-500 text-sm">
                {error.message} for {selectedCountryCode}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery(lastValidQuery.current.searchQuery);
                setApartment(lastValidQuery.current.apartment);
                refetch();
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayReviews = maxItems
    ? filteredReviews.slice(0, maxItems)
    : filteredReviews;

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {showHeader && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-teal-800 mb-2 md:mb-0">
                Read Trusted Reviews from Verified Tenants
              </h1>
              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {sortOptions.find((option) => option.value === sortBy)
                        ?.label || "Recent"}
                      <ChevronDown size={16} />
                    </button>
                    {isDropdownOpen && (
                      <ul
                        className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20 border border-gray-200"
                        role="listbox"
                      >
                        {sortOptions.map((option) => (
                          <li
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                            onClick={() => handleSortChange(option.value)}
                            role="option"
                            aria-selected={sortBy === option.value}
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
            <div className="flex items-center gap-4 mb-6 w-full bg-white mt-4 py-4 px-2 shadow-sm rounded-md">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter Reviews:
                </span>
              </div>
              <div className="flex-1">
                <SearchInput
                  placeholder="Search by home address e.g 62 Patigi-Ejebe Road, Patigi, Kwara"
                  initialValue={searchInputValue}
                  onPlaceSelect={(place: PlacePrediction) => {
                    setSearchQuery(place.description);
                    handleSearchSubmit(place.description);
                  }}
                  onChange={(value: string) => setSearchQuery(value)}
                  onSubmit={handleSearchSubmit}
                  onLocationSelect={() => {}}
                  className="w-full"
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={apartment}
                  onChange={(e) => handleDropdownFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2.5 text-sm bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All Apartments</option>
                  {apartmentNumbers.map((apt) => (
                    <option key={apt} value={apt}>
                      {apt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
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
            {displayReviews.map((review, index) => (
              <article
                key={review._id || index}
                onClick={() => handleReviewClick(review)}
                onKeyDown={(e) => handleReviewKeyDown(e, review)}
                className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
                style={{ minHeight: "370px", boxSizing: "border-box" }}
                tabIndex={0}
                role="button"
                aria-label={`View details for review at ${getDisplayAddress(
                  review.location
                )}`}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {review.linkedProperty?.media?.coverPhoto ? (
                    <Image
                      src={
                        review?.linkedProperty.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? review.linkedProperty.media.coverPhoto
                          : "/placeholder.png"
                      }
                      alt={
                        review?.linkedProperty.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? `Property image for ${review.location.streetAddress}`
                          : "Placeholder property image"
                      }
                      width={400}
                      height={270}
                      className="object-cover w-full h-full"
                      priority={false}
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
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    {review.isLinkedToDatabaseProperty && (
                      <span className="bg-teal-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 text-base line-clamp-2 mb-1">
                      {getDisplayAddress(review.location)}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {renderStars(review.overallRating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.overallRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-2">
                      {review.detailedReview || "No review text provided."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Value:</span>
                      <span>{review.valueForMoney || "N/A"}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Experience:</span>
                      <span>{review.overallExperience || "N/A"}/5</span>
                    </div>
                  </div>
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
                            : review?.reviewer?.firstName || "Reviewer"}
                        </p>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {showHeader && data?.totalPages && data.totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button
              className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.hasPreviousPage}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("countryCode", selectedCountryCode || "NG");
                if (apartment !== "all") {
                  params.set("apartment", encodeURIComponent(apartment));
                }
                if (searchQuery) {
                  params.set("q", encodeURIComponent(searchQuery));
                }
                params.set("page", (data.currentPage - 1).toString());
                const url = `/reviews?${params.toString()}`;
                console.log("Navigating to:", url);
                router.push(url);
              }}
            >
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
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("countryCode", selectedCountryCode || "NG");
                  if (apartment !== "all") {
                    params.set("apartment", encodeURIComponent(apartment));
                  }
                  if (searchQuery) {
                    params.set("q", encodeURIComponent(searchQuery));
                  }
                  params.set("page", (i + 1).toString());
                  const url = `/reviews?${params.toString()}`;
                  console.log("Navigating to:", url);
                  router.push(url);
                }}
              >
                {i + 1}
              </button>
            ))}
            {data.totalPages > 10 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button
                  className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("countryCode", selectedCountryCode || "NG");
                    if (apartment !== "all") {
                      params.set("apartment", encodeURIComponent(apartment));
                    }
                    if (searchQuery) {
                      params.set("q", encodeURIComponent(searchQuery));
                    }
                    params.set("page", data.totalPages.toString());
                    const url = `/reviews?${params.toString()}`;
                    console.log("Navigating to:", url);
                    router.push(url);
                  }}
                >
                  {data.totalPages}
                </button>
              </>
            )}
            <button
              className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!data.hasNextPage}
              onClick={() => {
                const params = new URLSearchParams();
                params.set("countryCode", selectedCountryCode || "NG");
                if (apartment !== "all") {
                  params.set("apartment", encodeURIComponent(apartment));
                }
                if (searchQuery) {
                  params.set("q", encodeURIComponent(searchQuery));
                }
                params.set("page", (data.currentPage + 1).toString());
                const url = `/reviews?${params.toString()}`;
                console.log("Navigating to:", url);
                router.push(url);
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
