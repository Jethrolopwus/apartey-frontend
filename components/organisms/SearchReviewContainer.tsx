"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import SearchInput from "@/components/atoms/Buttons/SearchInput";
import { useSearchParams } from "next/navigation";
import { useSearchReviewsQuery } from "@/Hooks/use-searchReviews.query";
import { Maximize, Navigation, Star, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

declare global {
  interface Window {
    google: unknown;
  }
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Review {
  id?: string;
  location: {
    lat: number;
    lng: number;
    apartment?: string;
    apartmentUnitNumber?: string;
    country?: string;
    city?: string;
    district?: string;
    streetAddress?: string;
  };
  linkedProperty?: {
    media?: {
      coverPhoto?: string;
    };
  };
  overallRating?: number;
  reviewCount?: number;
  detailedReview?: string;
}

interface Marker {
  id: string;
  top: string;
  left: string;
  coordinates: Coordinates;
}

const ReviewSearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mapMarkers, setMapMarkers] = useState<Marker[]>([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 6.5244,
    lng: 3.3792,
  });
  const [apartment, setApartment] = useState<string>(
    searchParams.get("apartment") || "all"
  );

  const fullAddress = searchParams.get("q") || "";
  const { data, isLoading } = useSearchReviewsQuery(
    fullAddress,
    apartment !== "all" ? apartment : undefined
  );
  const reviews: Review[] = useMemo(() => data?.reviews || [], [data?.reviews]);

  const lastValidQuery = useRef({ fullAddress, apartment });

  const markerPositions = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      top: `${20 + ((i * 5) % 60)}%`,
      left: `${20 + ((i * 7) % 60)}%`,
    }));
  }, []);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const validReviews = reviews.filter(
        (review) => review.location?.lat && review.location?.lng
      );

      if (validReviews.length > 0) {
        const totalLat = validReviews.reduce(
          (sum, r) => sum + r.location.lat,
          0
        );
        const totalLng = validReviews.reduce(
          (sum, r) => sum + r.location.lng,
          0
        );
        const centerLat = totalLat / validReviews.length;
        const centerLng = totalLng / validReviews.length;

        setMapCenter((prev) => {
          if (prev.lat !== centerLat || prev.lng !== centerLng) {
            return { lat: centerLat, lng: centerLng };
          }
          return prev;
        });

        const markers: Marker[] = validReviews.map((review, index) => ({
          id: `marker-${review.id || index}`,
          top: markerPositions[index % markerPositions.length].top,
          left: markerPositions[index % markerPositions.length].left,
          coordinates: {
            lat: review.location.lat,
            lng: review.location.lng,
          },
        }));

        setMapMarkers(markers);
      } else {
        const fallbackMarkers: Marker[] = Array.from({ length: 10 }).map(
          (_, i) => ({
            id: `marker-${i + 1}`,
            top: markerPositions[i].top,
            left: markerPositions[i].left,
            coordinates: { lat: 0, lng: 0 },
          })
        );
        setMapMarkers(fallbackMarkers);
      }
    } else {
      const fallbackMarkers: Marker[] = Array.from({ length: 10 }).map(
        (_, i) => ({
          id: `marker-${i + 1}`,
          top: markerPositions[i].top,
          left: markerPositions[i].left,
          coordinates: { lat: 0, lng: 0 },
        })
      );
      setMapMarkers(fallbackMarkers);
    }
  }, [reviews, markerPositions]);

  const generateMapUrl = (): string => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || mapCenter.lat === 0 || mapCenter.lng === 0) return "";

    const validMarkers = mapMarkers.filter(
      (marker) => marker.coordinates.lat !== 0 && marker.coordinates.lng !== 0
    );

    if (validMarkers.length === 0) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=13&size=600x500&markers=color:orange%7C${mapCenter.lat},${mapCenter.lng}&key=${apiKey}`;
    }

    const limitedMarkers = validMarkers.slice(0, 10);
    const markersParam = limitedMarkers
      .map(
        (marker) =>
          `markers=color:orange%7C${marker.coordinates.lat},${marker.coordinates.lng}`
      )
      .join("&");

    return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=12&size=600x500&${markersParam}&key=${apiKey}`;
  };

  const mapUrl = generateMapUrl();

  const renderStars = (rating: number = 0) => {
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

  useEffect(() => {
    if (!isLoading && (fullAddress || apartment !== "all")) {
      if (reviews.length === 0) {
        toast.error("No reviews found for this address or apartment.");
        if (
          lastValidQuery.current.fullAddress !== fullAddress ||
          lastValidQuery.current.apartment !== apartment
        ) {
          router.replace(
            `/reviews?q=${encodeURIComponent(
              lastValidQuery.current.fullAddress
            )}${
              lastValidQuery.current.apartment &&
              lastValidQuery.current.apartment !== "all"
                ? `&apartment=${encodeURIComponent(
                    lastValidQuery.current.apartment
                  )}`
                : ""
            }`
          );
        }
      } else {
        lastValidQuery.current = { fullAddress, apartment };
      }
    }
  }, [isLoading, reviews, fullAddress, apartment, router]);

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

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  return (
    <section
      className="w-full h-screen max-w-7xl bg-white mx-auto px-4 py-8 overflow-y-auto"
      aria-label="Property reviews"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Review List */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
              REVIEWS
            </p>
            <h2 className="text-teal-700 text-3xl font-medium">
              Explore Reviews Near You
            </h2>
          </div>

          <SearchInput
            placeholder="Search by address, neighborhood, or city"
            onPlaceSelect={(place) => {
              setApartment(place.description);
              router.push(
                `/reviews?q=${encodeURIComponent(place.description)}${
                  apartment && apartment !== "all"
                    ? `&apartment=${encodeURIComponent(apartment)}`
                    : ""
                }`
              );
            }}
            onChange={() => {}}
            onSubmit={(value) => {
              if (value) {
                router.push(
                  `/reviews?q=${encodeURIComponent(value)}${
                    apartment && apartment !== "all"
                      ? `&apartment=${encodeURIComponent(apartment)}`
                      : ""
                  }`
                );
              }
            }}
            onLocationSelect={() => {}}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-gray-600" />
              <label className="text-sm text-gray-700 font-medium">
                Filter by Apartment
              </label>
              <select
                value={apartment}
                onChange={(e) => handleDropdownFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="all">All</option>
                <option value="studio">Studio</option>
                <option value="1bed">1 Bedroom</option>
                <option value="2bed">2 Bedroom</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <p>Loading reviews...</p>
            ) : filteredReviews.length === 0 ? (
              <p className="text-gray-500">No reviews found.</p>
            ) : (
              filteredReviews.map((review, index) => (
                <article
                  key={index}
                  className="p-4 border rounded-md hover:shadow transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {review.location.streetAddress}, {review.location.city}
                  </h3>
                  <div className="flex items-center gap-2 my-2">
                    {renderStars(review.overallRating)}
                    <span className="text-sm text-gray-600">
                      ({review.reviewCount || 0})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.detailedReview}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="lg:w-1/2 relative">
          <div className="w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden relative">
            {mapUrl ? (
              <Image
                src={mapUrl}
                fill
                alt="Map of property locations"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Map not available</p>
              </div>
            )}

            {mapMarkers.map((marker) =>
              marker.coordinates.lat !== 0 ? (
                <div
                  key={marker.id}
                  className="absolute w-6 h-6"
                  style={{
                    top: marker.top,
                    left: marker.left,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow"></div>
                </div>
              ) : null
            )}

            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => mapUrl && window.open(mapUrl, "_blank")}
                className="p-2 bg-white rounded shadow"
              >
                <Maximize size={20} />
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`,
                    "_blank"
                  )
                }
                className="p-2 bg-white rounded shadow"
              >
                <Navigation size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSearchContainer;
