"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";
import { Star, ChevronDown, Maximize } from "lucide-react"; // Removed unused 'Navigation' import
import { ReviewsSectionProps, SortOption } from "@/types/generated";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { Review, SortComponentProps, ReviewLocation } from "@/types/generated";
import Image from "next/image";

interface Coordinates {
  lat: number;
  lng: number;
}

function hasLatLng(location: unknown): location is ReviewLocation {
  return (
    location !== null &&
    typeof location === "object" &&
    "lat" in location &&
    "lng" in location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
  );
}

const SortComponent: React.FC<SortComponentProps> = ({
  sortOptions,
  currentSort,
  onSortChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSortChange = (option: SortOption) => {
    onSortChange(option);
    setIsDropdownOpen(false);
    router.push(`/reviewsPage?sort=${option.value}`);
  };

  return (
    <div className="flex justify-end mb-4 z-10">
      <div className="relative">
        <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
          <span className="text-gray-600 text-sm">Sort by</span>
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-800"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              {currentSort}
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <ul
                className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20"
                role="listbox"
              >
                {sortOptions.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                    onClick={() => handleSortChange(option)}
                    role="option"
                    aria-selected={currentSort === option.label}
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
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  initialSortOption = "Recent",
}) => {
  const [sortOption, setSortOption] = useState<string>(initialSortOption);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 6.5244,
    lng: 3.3792,
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sortOptions: SortOption[] = useMemo(
    () => [
      { label: "Recent", value: "recent" },
      { label: "Highest Rating", value: "highest_rating" },
    ],
    []
  );

  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    limit: 2,
    sortBy: "mostRecent",
    sortOrder: "highestRating",
  });

  const reviews: Review[] = useMemo(() => data?.reviews || [], [data?.reviews]);

  // Initialize Google Map
  useEffect(() => {
    // Capture the current ref value at the start of the effect
    const currentMapRef = mapRef.current;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error(
        "Error: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing in .env"
      );
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader
      .load()
      .then((google) => {
        if (currentMapRef) {
          const map = new google.maps.Map(currentMapRef, {
            center: mapCenter,
            zoom: 12,
          });

          // Add markers for reviews with valid coordinates
          const validReviews = reviews.filter((review: Review) =>
            hasLatLng(review.location)
          );
          validReviews.forEach((review) => {
            // Removed unused 'index' parameter
            if (hasLatLng(review.location)) {
              new google.maps.Marker({
                position: {
                  lat: review.location.lat,
                  lng: review.location.lng,
                },
                map,
                title: getDisplayAddress(
                  review.location as typeof review.location & {
                    fullAddress?: string;
                  }
                ),
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                },
              });
            }
          });

          // Update map center based on valid reviews
          if (validReviews.length > 0) {
            const totalLat = validReviews.reduce(
              (sum, review) =>
                sum + (hasLatLng(review.location) ? review.location.lat : 0),
              0
            );
            const totalLng = validReviews.reduce(
              (sum, review) =>
                sum + (hasLatLng(review.location) ? review.location.lng : 0),
              0
            );
            const centerLat = totalLat / validReviews.length;
            const centerLng = totalLng / validReviews.length;

            if (centerLat !== mapCenter.lat || centerLng !== mapCenter.lng) {
              setMapCenter({ lat: centerLat, lng: centerLng });
              map.setCenter({ lat: centerLat, lng: centerLng });
            }
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load Google Maps:", error);
      });

    // Cleanup to prevent memory leaks - using captured ref value
    return () => {
      if (currentMapRef) {
        currentMapRef.innerHTML = "";
      }
    };
  }, [reviews, mapCenter]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="fill-gray-400 text-gray-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            size={16}
            className="fill-gray-400 text-gray-400 opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option.label);
    router.push(`/reviewsPage?sort=${option.value}`);
  };

  const getDisplayAddress = (
    loc: Review["location"] & { fullAddress?: string }
  ) => {
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

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 py-8"
      aria-label="Property reviews"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
            REVIEWS
          </p>
          <h2 className="text-teal-700 text-3xl font-medium">
            Explore Reviews Near You
          </h2>
        </div>
        <div className="mt-4 md:mt-0">
          <SortComponent
            sortOptions={sortOptions}
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
              REVIEWS
            </p>
            <h3 className="text-gray-700 text-2xl font-medium">
              Recent Reviews
            </h3>
          </div>
          <div className="space-y-10">
            {reviews.length > 0 ? (
              reviews.map(
                (
                  review // Removed unused 'index' parameter
                ) => (
                  <article
                    key={review._id} // Use review._id as key instead of index
                    className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => router.push(`/reviewsPage/${review._id}`)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for review at ${getDisplayAddress(
                      review.location as typeof review.location & {
                        fullAddress?: string;
                      }
                    )}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(`/reviewsPage/${review._id}`);
                      }
                    }}
                  >
                    <div className="w-[180px] h-[120px] flex-shrink-0 rounded-md overflow-hidden relative">
                      <Image
                        src={
                          review.linkedProperty?.media?.coverPhoto ||
                          "/placeholder-property.jpg"
                        }
                        alt={`Property at ${review.location.streetAddress}`}
                        width={180}
                        height={120}
                        className="object-cover w-full h-full"
                      />
                      {review.isLinkedToDatabaseProperty && (
                        <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-gray-800 font-medium text-lg">
                        {getDisplayAddress(
                          review.location as typeof review.location & {
                            fullAddress?: string;
                          }
                        )}
                      </h1>
                      <div className="flex items-center gap-2 my-1">
                        <div className="flex">
                          {renderStars(review.overallRating)}
                        </div>
                        <span className="text-gray-700">
                          {review.overallRating}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {review.detailedReview}
                      </p>
                    </div>
                  </article>
                )
              )
            ) : (
              <p className="text-gray-500">No reviews found.</p>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          {!isLoading && reviews.length > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded-md px-3 py-2 shadow-md">
              <p className="text-sm text-gray-700">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-[380px] bg-gray-200 mt-16 rounded-lg overflow-hidden relative min-h-[300px]"
          />
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Open in Google Maps"
              onClick={() => {
                if (mapCenter.lat !== 0 && mapCenter.lng !== 0) {
                  window.open(
                    `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`,
                    "_blank"
                  );
                }
              }}
            >
              <Maximize size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
