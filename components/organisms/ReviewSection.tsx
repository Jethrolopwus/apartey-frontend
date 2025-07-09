"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, ChevronDown, Maximize, Navigation } from "lucide-react";
import { ReviewsSectionProps, SortOption } from "@/types/generated";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { Review, SortComponentProps, ReviewLocation } from "@/types/generated";
import Image from "next/image";

// Add Google Maps types
declare global {
  interface Window {
    google: unknown;
  }
}

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

    // Navigate to reviews page with selected sort option
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
  const [mapMarkers, setMapMarkers] = useState<
    { id: string; top: string; left: string; coordinates: Coordinates }[]
  >([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 6.5244,
    lng: 3.3792,
  });
  const router = useRouter();

  const sortOptions: SortOption[] = useMemo(
    () => [
      { label: "Recent", value: "recent" },
      { label: "Highest Rating", value: "highest_rating" },
    ],
    []
  );

  // Memoize marker positions to prevent infinite re-renders
  const markerPositions = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      top: `${20 + ((i * 5) % 60)}%`,
      left: `${20 + ((i * 7) % 60)}%`,
    }));
  }, []);

  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    limit: 2,
    sortBy: "mostRecent",
    sortOrder: "highestRating",
  });

  const reviews: Review[] = useMemo(() => data?.reviews || [], [data?.reviews]);

  // Update map markers and center based on reviews data
  useEffect(() => {
    const validReviews = reviews.filter((review: Review) =>
      hasLatLng(review.location)
    );

    if (validReviews.length > 0) {
      // Calculate center point from all valid reviews
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

      // Only update mapCenter if it has changed
      setMapCenter((prev) => {
        if (prev.lat !== centerLat || prev.lng !== centerLng) {
          return { lat: centerLat, lng: centerLng };
        }
        return prev;
      });

      // Create markers for all reviews with coordinates
      const markers = validReviews
        .map((review, index) =>
          hasLatLng(review.location)
            ? {
                id: `marker-${review._id || index}`,
                top: markerPositions[index % markerPositions.length].top,
                left: markerPositions[index % markerPositions.length].left,
                coordinates: {
                  lat: review.location.lat,
                  lng: review.location.lng,
                },
              }
            : null
        )
        .filter(Boolean) as {
        id: string;
        top: string;
        left: string;
        coordinates: Coordinates;
      }[];
      // Only update mapMarkers if different
      setMapMarkers((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(markers)) {
          return markers;
        }
        return prev;
      });
    } else {
      // Fallback to default markers if no coordinates
      const markers = Array.from({ length: 10 }).map((_, i) => ({
        id: `marker-${i + 1}`,
        top: markerPositions[i].top,
        left: markerPositions[i].left,
        coordinates: { lat: 0, lng: 0 },
      }));
      setMapMarkers((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(markers)) {
          return markers;
        }
        return prev;
      });
    }
  }, [reviews, markerPositions]);

  // Generate Google Maps URL with multiple markers
  const generateMapUrl = () => {
    if (mapCenter.lat === 0 && mapCenter.lng === 0) return "";

    const validMarkers = mapMarkers.filter(
      (marker) => marker.coordinates.lat !== 0 && marker.coordinates.lng !== 0
    );

    if (validMarkers.length === 0) {
      // Single marker at center
      return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=13&size=600x500&markers=color:orange%7C${mapCenter.lat},${mapCenter.lng}&key=AIzaSyC_mwAjirr_vXt1xL1WlL-entKBwD7FkqY`;
    }

    // Multiple markers (limit to 10 to avoid URL length issues)
    const limitedMarkers = validMarkers.slice(0, 10);
    const markersParam = limitedMarkers
      .map(
        (marker) =>
          `markers=color:orange%7C${marker.coordinates.lat},${marker.coordinates.lng}`
      )
      .join("&");

    return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=12&size=600x500&${markersParam}&key=AIzaSyC_mwAjirr_vXt1xL1WlL-entKBwD7FkqY`;
  };

  const mapUrl = generateMapUrl();

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
        {/* SortComponent at top right, same line as heading */}
        <div className="mt-4 md:mt-0">
          <SortComponent
            sortOptions={sortOptions}
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Filter Bar - below heading and sort */}
      {/* REMOVED FILTER BAR (input and apartments dropdown) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Reviews List */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
              REVIEWS
            </p>
            <h3 className="text-gray-700 text-2xl font-medium">
              Recent Reviews
            </h3>
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <article
                  key={index}
                  className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
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
                    <h4 className="text-gray-800 font-medium text-lg">
                      {review.location.streetAddress},{" "}
                      {review.location.district}, {review.location.city}
                    </h4>
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex">
                        {renderStars(review.overallRating)}
                      </div>
                      <span className="text-gray-700">
                        {review.overallRating.toString()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {review.detailedReview}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No reviews found.</p>
            )}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="lg:w-1/2 relative">
          {/* Map Info */}
          {!isLoading && reviews.length > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded-md px-3 py-2 shadow-md">
              <p className="text-sm text-gray-700">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}

          {/* Google Maps Container */}
          <div className="w-full h-[500px] bg-gray-200 mt-16 rounded-lg overflow-hidden relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading map...</p>
                </div>
              </div>
            ) : mapUrl ? (
              <Image
                className="w-full h-full object-cover"
                alt="Map of property locations"
                src={mapUrl}
                fill
                onError={({ currentTarget }) => {
                  currentTarget.style.display = "none";
                }}
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    No location data available
                  </p>
                  <p className="text-gray-400 text-sm">
                    Reviews will appear on the map when available
                  </p>
                </div>
              </div>
            )}

            {/* Overlay markers for reviews with coordinates */}
            {!isLoading &&
              mapMarkers.length > 0 &&
              mapMarkers.some((marker) => marker.coordinates.lat !== 0) &&
              mapMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-6 h-6 flex items-center justify-center"
                  style={{
                    top: marker.top,
                    left: marker.left,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white drop-shadow-md"></div>
                </div>
              ))}

            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Fullscreen"
                onClick={() => {
                  if (mapUrl) {
                    window.open(mapUrl, "_blank");
                  }
                }}
              >
                <Maximize size={20} className="text-gray-700" />
              </button>
              <button
                className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Navigate to current location"
                onClick={() => {
                  if (mapCenter.lat !== 0 && mapCenter.lng !== 0) {
                    window.open(
                      `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`,
                      "_blank"
                    );
                  }
                }}
              >
                <Navigation size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
