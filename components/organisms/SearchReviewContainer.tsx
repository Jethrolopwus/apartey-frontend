"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import SearchInput from "@/components/atoms/Buttons/SearchInput";
import { useSearchParams } from "next/navigation";
import { useSearchReviewsQuery } from "@/Hooks/use-searchReviews.query";
import { Star, Filter, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Location {
  lat?: number;
  lng?: number;
  apartment?: string;
  apartmentUnitNumber?: string;
  country?: string;
  countryCode?: string;
  stateOrRegion?: string;
  street?: string;
  district?: string;
  streetAddress?: string;
  fullAddress?: string;
  postalCode?: string;
}

interface Reviewer {
  _id?: string;
  firstName?: string;
  lastName?: string;
}

interface Review {
  id?: string;
  _id?: string;
  location: Location;
  linkedProperty?: {
    media?: {
      coverPhoto?: string;
    };
  } | null;
  overallRating?: number;
  reviewCount?: number;
  detailedReview?: string;
  isLinkedToDatabaseProperty?: boolean;
  author?: {
    name?: string;
    avatar?: string;
  };
  createdAt?: string;
  submitAnonymously?: boolean;
  reviewer?: Reviewer | null;
  valueForMoney?: number;
  costOfRepairsCoverage?: string;
  overallExperience?: number;
}

interface SearchResponse {
  matchedReviews: Review[];
  suggestedReviews: Review[];
  noSearchFound: boolean;
  currentSearch: string;
  apartmentNumbers: string[];
  message?: string;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const ReviewSearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [apartment, setApartment] = useState<string>(
    searchParams.get("apartment") || "all"
  );
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );

  const { data, isLoading } = useSearchReviewsQuery(
    searchQuery,
    apartment !== "all" ? apartment : undefined
  ) as { data: SearchResponse | undefined; isLoading: boolean };
  const reviews: Review[] = useMemo(() => {
    if (data?.noSearchFound) {
      return data?.suggestedReviews || [];
    }
    return data?.matchedReviews || [];
  }, [data]);

  const lastValidQuery = useRef({ searchQuery, apartment });

  const searchInputValue = useMemo(() => {
    if (data?.matchedReviews && data.matchedReviews.length > 0) {
      return searchQuery;
    }
    return data?.currentSearch || searchQuery;
  }, [data, searchQuery]);

  const getDisplayAddress = (loc: Location) => {
    if (loc?.fullAddress && loc.fullAddress.trim() !== "")
      return loc.fullAddress;
    const parts = [
      loc?.street || loc?.streetAddress || "",
      loc?.apartment || loc?.apartmentUnitNumber || "",
      loc?.district || "",
      loc?.stateOrRegion || "",
      loc?.country || "",
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No Address";
  };

  const getReviewId = (review: Review) => {
    return review._id || review.id;
  };

  const getReviewerName = (review: Review) => {
    if (review.submitAnonymously) return "Anonymous";
    if (review.reviewer) {
      return (
        `${review.reviewer.firstName || ""} ${
          review.reviewer.lastName || ""
        }`.trim() || "Anonymous"
      );
    }
    return review.author?.name || "Anonymous";
  };

  const handleReviewClick = (review: Review) => {
    const reviewId = getReviewId(review);
    if (reviewId) {
      router.push(`/reviewsPage/${reviewId}`);
    } else {
      toast.error("Unable to view review details");
    }
  };

  // Handle keyboard navigation for accessibility
  const handleReviewKeyDown = (e: React.KeyboardEvent, review: Review) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleReviewClick(review);
    }
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            size={16}
            className="fill-yellow-400 text-yellow-400 opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    if (!isLoading && (searchQuery || apartment !== "all")) {
      if (reviews.length === 0 && !data?.noSearchFound) {
        toast.error("No reviews found for this address or apartment.");
        lastValidQuery.current = { searchQuery, apartment };
      } else {
        lastValidQuery.current = { searchQuery, apartment };
      }
    }
  }, [isLoading, reviews, searchQuery, apartment, data?.noSearchFound]);

  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  const handleDropdownFilter = (selectedApartment: string) => {
    setApartment(selectedApartment);
    if (selectedApartment === "all") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (review) =>
          (
            review.location?.apartment ||
            review.location?.apartmentUnitNumber ||
            ""
          ).toLowerCase() === selectedApartment.toLowerCase()
      );
      setFilteredReviews(filtered);
      if (filtered.length === 0) {
        toast.error("No reviews found for this apartment.");
      }
    }
  };

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

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  const sortOptions = [
    { label: "Recent", value: "recent" },
    { label: "Highest Rating", value: "highest_rating" },
    { label: "Lowest Rating", value: "lowest_rating" },
  ];

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 py-8"
      aria-label="Property reviews"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-teal-800 mb-2">
          Read Trusted Reviews from Verified Tenants
        </h1>
        {data?.noSearchFound && data?.message && (
          <p className="text-sm md:text-base text-red-600 mb-4">
            {data.message}
          </p>
        )}

        {/* Sort Dropdown */}
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
                {sortOptions.find((option) => option.value === sortBy)?.label ||
                  "Recent"}
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

        {/* Filter Section */}
        <div className="flex justify-between items-center gap-8 bg-white py-4 px-2 shadow-sm rounded-md">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="text-md font-medium text-gray-700">
              Filter Reviews:
            </span>
          </div>

          <SearchInput
            placeholder="Search by home address e.g 62 Peiga Epime Road, Peiga, Kwara"
            initialValue={searchInputValue}
            onPlaceSelect={(place: PlacePrediction) => {
              setSearchQuery(place.description);
            }}
            onChange={(value: string) => {
              setSearchQuery(value);
            }}
            onSubmit={(value: string) => {
              if (value) {
                setSearchQuery(value);
              }
            }}
            onLocationSelect={() => {}}
            className="flex-1 max-w-full"
          />

          <select
            value={apartment}
            onChange={(e) => handleDropdownFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Apartments</option>
            {data?.apartmentNumbers.map((apt) => (
              <option key={apt} value={apt}>
                {apt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 && !data?.noSearchFound ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No reviews found.</p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <article
              key={getReviewId(review) || index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleReviewClick(review)}
              tabIndex={0}
              role="button"
              aria-label={`View details for review at ${getDisplayAddress(
                review.location
              )}`}
              onKeyDown={(e) => handleReviewKeyDown(e, review)}
            >
              {/* Property Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={
                    review.linkedProperty?.media?.coverPhoto ||
                    "/placeholder-property.jpg"
                  }
                  alt={`Property at ${
                    review.location.street ||
                    review.location.streetAddress ||
                    "Unknown"
                  }`}
                  fill
                  className="object-cover"
                />
                {review.isLinkedToDatabaseProperty && (
                  <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  {getDisplayAddress(review.location)}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {renderStars(review.overallRating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {review.overallRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({review.reviewCount || 0} reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {review.detailedReview || "No review details provided."}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    {review.author?.avatar ? (
                      <Image
                        src={review.author.avatar}
                        alt={getReviewerName(review)}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">
                        {getReviewerName(review).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">
                      {getReviewerName(review)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default ReviewSearchContainer;
