"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import SearchInput from "@/components/atoms/Buttons/SearchInput";
import { useSearchParams } from "next/navigation";
import { useSearchReviewsQuery } from "@/Hooks/use-searchReviews.query";
import { ChevronDown, Maximize, Navigation, Star, Filter } from "lucide-react";
import { ReviewData, ReviewsSectionProps, SortOption } from "@/types/generated";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

// Add Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface Coordinates {
  lat: number;
  lng: number;
}

const ReviewSearchContainer = () => {
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mapMarkers, setMapMarkers] = useState<
    { id: string; top: string; left: string; coordinates: Coordinates }[]
  >([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: 6.5244, lng: 3.3792 }); 
  const [inputValue, setInputValue] = useState<string>("");
  const [apartment, setApartment] = useState<string>(searchParams.get("apartment") || "all");
  const router = useRouter();

  const fullAddress = searchParams.get("q") || "";
  // Use both fullAddress and apartment for filtering
  const { data, isLoading, error } = useSearchReviewsQuery(fullAddress, apartment !== "all" ? apartment : undefined);
  const reviews = data?.reviews || [];

  // Use a ref to track last successful search to avoid infinite loop
  const lastValidQuery = useRef({ fullAddress, apartment });

  // Memoize marker positions to prevent infinite re-renders
  const markerPositions = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      top: `${20 + (i * 5) % 60}%`,
      left: `${20 + (i * 7) % 60}%`,
    }));
  }, []);

  // Update map markers and center based on reviews data
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const validReviews = reviews.filter((review: any) => 
        review?.location?.lat && review?.location?.lng
      );
      
      if (validReviews.length > 0) {
        // Calculate center point from all valid reviews
        const totalLat = validReviews.reduce((sum: number, review: any) => sum + review.location.lat, 0);
        const totalLng = validReviews.reduce((sum: number, review: any) => sum + review.location.lng, 0);
        const centerLat = totalLat / validReviews.length;
        const centerLng = totalLng / validReviews.length;
        
        // Use functional update to avoid stale closure and unnecessary updates
        setMapCenter(prev => {
          if (prev.lat !== centerLat || prev.lng !== centerLng) {
            return { lat: centerLat, lng: centerLng };
          }
          return prev;
        });

        // Create markers for all reviews with coordinates
        const markers = validReviews.map((review: any, index: number) => ({
          id: `marker-${review.id || index}`,
          top: markerPositions[index % markerPositions.length].top,
          left: markerPositions[index % markerPositions.length].left,
          coordinates: {
            lat: review.location.lat,
            lng: review.location.lng
          }
        }));
        
        setMapMarkers(markers);
      } else {
        // Default markers when no reviews
        const markers = Array.from({ length: 10 }).map((_, i) => ({
          id: `marker-${i + 1}`,
          top: markerPositions[i].top,
          left: markerPositions[i].left,
          coordinates: { lat: 0, lng: 0 }
        }));
        // Only update if different
        if (JSON.stringify(mapMarkers) !== JSON.stringify(markers)) {
          setMapMarkers(markers);
        }
      }
    } else {
      // Default markers when no reviews
      const markers = Array.from({ length: 10 }).map((_, i) => ({
        id: `marker-${i + 1}`,
        top: markerPositions[i].top,
        left: markerPositions[i].left,
        coordinates: { lat: 0, lng: 0 }
      }));
      // Only update if different
      if (JSON.stringify(mapMarkers) !== JSON.stringify(markers)) {
        setMapMarkers(markers);
      }
    }
  }, [reviews, markerPositions]);

  // Generate Google Maps URL with multiple markers
  const generateMapUrl = () => {
    if (mapCenter.lat === 0 && mapCenter.lng === 0) return '';
    
    const validMarkers = mapMarkers.filter((marker: { id: string; top: string; left: string; coordinates: Coordinates }) => 
      marker.coordinates.lat !== 0 && marker.coordinates.lng !== 0
    );
    
    if (validMarkers.length === 0) {
      // Single marker at center
      return `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=13&size=600x500&markers=color:orange%7C${mapCenter.lat},${mapCenter.lng}&key=AIzaSyC_mwAjirr_vXt1xL1WlL-entKBwD7FkqY`;
    }
    
    // Multiple markers (limit to 10 to avoid URL length issues)
    const limitedMarkers = validMarkers.slice(0, 10);
    const markersParam = limitedMarkers.map((marker: { id: string; top: string; left: string; coordinates: Coordinates }) => 
      `markers=color:orange%7C${marker.coordinates.lat},${marker.coordinates.lng}`
    ).join('&');
    
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

  const sortOptions: SortOption[] = useMemo(
    () => [
      { label: "Recent", value: "recent" },
      { label: "Highest Rating", value: "highest_rating" },
    ],
    []
  );
  
  const handleSortChange = (option: SortOption) => {
    setSortOption(option.label);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (!isLoading && (fullAddress || apartment !== 'all')) {
      if (reviews.length === 0) {
        toast.error('No reviews found for this address or apartment.');
        // Revert to last valid query if not already there
        if (lastValidQuery.current.fullAddress !== fullAddress || lastValidQuery.current.apartment !== apartment) {
          router.replace(`/reviews?q=${encodeURIComponent(lastValidQuery.current.fullAddress)}${lastValidQuery.current.apartment && lastValidQuery.current.apartment !== 'all' ? `&apartment=${encodeURIComponent(lastValidQuery.current.apartment)}` : ''}`);
        }
      } else {
        lastValidQuery.current = { fullAddress, apartment };
      }
    }
  }, [isLoading, reviews, fullAddress, apartment, router]);

  return (
    <section
      className="w-full h-screen max-w-7xl mx-auto px-4 py-8"
      aria-label="Property reviews"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
              REVIEWS
            </p>
            <h2 className="text-teal-700 text-3xl font-medium">
              Explore Reviews Near you
            </h2>
          </div>
          <h3 className="text-gray-700 text-2xl font-medium"> Reviews</h3>
          <SearchInput
            placeholder="Search by address, neighborhood, or city"
            onPlaceSelect={(place) => {
              setInputValue(place.description);
              router.push(`/reviews?q=${encodeURIComponent(place.description)}${apartment && apartment !== 'all' ? `&apartment=${encodeURIComponent(apartment)}` : ''}`);
            }}
            onChange={(value) => setInputValue(value)}
            onSubmit={(value) => {
              if (value) {
                router.push(`/reviews?q=${encodeURIComponent(value)}${apartment && apartment !== 'all' ? `&apartment=${encodeURIComponent(apartment)}` : ''}`);
              }
            }}
            onLocationSelect={() => {}}
          />
          {/* Filter Bar - below SearchInput */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-4">
            <div className="flex items-center gap-3">
              {/* Filter Icon */}
              <span className="inline-flex items-center cursor-pointer justify-center w-10 h-10 rounded-md bg-gray-100 border border-gray-200">
                <Filter size={20} className="text-gray-500" />
              </span>
              <span className="font-medium text-gray-700 text-base">Filter Reviews:</span>
            </div>
            <div className="flex flex-1 items-center gap-3">
              {/* Filter Input */}
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    router.push(`/reviews?q=${encodeURIComponent(inputValue)}${apartment && apartment !== 'all' ? `&apartment=${encodeURIComponent(apartment)}` : ''}`);
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 bg-white min-w-[260px]"
                placeholder="Search by home address e.g 62 Patigi-Ejebje Road, Patigi, Kwara"
                aria-label="Search reviews by address"
              />
              {/* Apartments Dropdown */}
              <div className="relative">
                <select
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[160px]"
                  aria-label="Select apartment type"
                  value={apartment}
                  onChange={e => {
                    setApartment(e.target.value);
                    router.push(`/reviews?q=${encodeURIComponent(inputValue || fullAddress)}${e.target.value !== 'all' ? `&apartment=${encodeURIComponent(e.target.value)}` : ''}`);
                  }}
                >
                  <option value="all">All Apartments</option>
                  <option value="studio">Studio</option>
                  <option value="1bed">1 Bedroom</option>
                  <option value="2bed">2 Bedroom</option>
                  <option value="3bed">3 Bedroom</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="Flat 2A">Flat 2A</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            {!isLoading && reviews.length === 0 && (
              <p className="text-gray-500">
                No reviews found for this location.
              </p>
            )}
            {isLoading ? (
              <p>Loading reviews...</p>
            ) : (
              reviews?.map((review: any, index: number) => (
                <article
                  key={index}
                  className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-[180px] h-[120px] flex-shrink-0 rounded-md overflow-hidden">
                    <img
                      src={
                        review?.linkedProperty?.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? review.linkedProperty?.media.coverPhoto
                          : "/placeholder.png"
                      }
                      alt="property image"
                      width={180}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p>{review?.location?.country}</p>
                    <h2>{review?.location?.city}</h2>
                    <p>{review?.location?.district}</p>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-gray-800 font-medium text-lg">
                      {review?.location.streetAddress}
                    </h4>
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex">
                        {renderStars(review?.overallRating)}
                      </div>
                      <span className="text-gray-700">
                        {review?.overallRating?.toFixed(1)} (
                        {review?.reviewCount} reviews)
                      </span>
                    </div>
                    <p></p>
                    <p className="text-gray-500 text-sm">
                      {review?.detailedReview}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          {/* Sort Dropdown */}
          <div className="border absolute top-50  right-20 flex justify-end mb-4 z-10">
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
                    {sortOption}
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

          {/* Map Info */}
          {!isLoading && reviews.length > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded-md px-3 py-2 shadow-md">
              <p className="text-sm text-gray-700">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {/* Google Maps Container */}
          <div className="w-full h-[500px] bg-gray-200 mt-20 rounded-lg overflow-hidden relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading map...</p>
                </div>
              </div>
            ) : mapUrl ? (
              <img
                className="w-full h-full object-cover"
                alt="Map of property locations"
                src={mapUrl}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                    fallback.innerHTML = '<p class="text-gray-500">Map unavailable</p>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No location data available</p>
                  <p className="text-gray-400 text-sm">Search for a location to see the map</p>
                </div>
              </div>
            )}

            {/* Overlay markers for reviews with coordinates */}
            {!isLoading && mapMarkers.length > 0 && mapMarkers.some(marker => marker.coordinates.lat !== 0) && (
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
              ))
            )}

            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Fullscreen"
                onClick={() => {
                  if (mapUrl) {
                    window.open(mapUrl, '_blank');
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
                    window.open(`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`, '_blank');
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

export default ReviewSearchContainer;
