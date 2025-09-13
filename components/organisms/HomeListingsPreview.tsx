"use client";
import React, { useState, useEffect } from "react";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";
import { useGetPropertyRatingsQuery } from "@/Hooks/use-getPropertyRatings.query";
import { useLocation } from "@/app/userLocationContext";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, Bed, Bath, SquareDot } from "lucide-react";
import {
  Property,
  PropertiesResponse,
  PropertyCategory,
} from "@/types/generated";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { toast } from "react-hot-toast";

// Component to display property rating with real data
const PropertyRatingDisplay: React.FC<{ propertyId: string; fallbackRating?: number; fallbackReviewCount?: number }> = ({ 
  propertyId, 
  fallbackRating = 0, 
  fallbackReviewCount = 0 
}) => {
  const { data: ratingsData, isLoading } = useGetPropertyRatingsQuery(propertyId);
  
  const rating = ratingsData?.rating ?? fallbackRating;
  const reviewCount = ratingsData?.reviewCount ?? fallbackReviewCount;
  
  if (isLoading) {
    return (
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-2">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center mb-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 ml-2">
        {rating} ({reviewCount} reviews)
      </span>
    </div>
  );
};

const transformPropertyToListing = (property: Property) => {
  const getPropertyTitle = (property: Property) => {
    return (
      property.location?.streetAddress ||
      property.propertyType ||
      "Untitled Property"
    );
  };

  const getPropertyLocation = (property: Property) => {
    const { fullAddress, city, country } = property.location || {};
    
    // Prioritize fullAddress if available, otherwise fall back to city, country
    if (fullAddress) {
      return fullAddress;
    }
    
    return (
      [city, country].filter(Boolean).join(", ") || "Location not specified"
    );
  };

  const getPropertyPrice = (property: Property) => {
    return property.propertyDetails?.price
      ? `${property.propertyDetails.currency || "NGN"}${
          property.propertyDetails.price
        }/Year`
      : "Price on request";
  };

  const getPropertyImage = (property: Property) => {
    return property.media?.coverPhoto || "/Estate2.png";
  };

  return {
    id: property._id || "",
    imageUrl: getPropertyImage(property),
    title: getPropertyTitle(property),
    location: getPropertyLocation(property),
    rating: property.rating || 0,
    reviewCount: property.reviewCount || 0,
    price: getPropertyPrice(property),
    category: property.category as PropertyCategory,
    bedrooms: property.propertyDetails?.bedrooms,
    bathrooms: property.propertyDetails?.bathrooms,
    totalAreaSqM: property.propertyDetails?.totalAreaSqM,
  };
};

const HomeListingsPreview: React.FC = () => {
  const { selectedCountryCode } = useLocation();
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  
  // Convert country code to full country name for listings API
  const getCountryName = (countryCode: string) => {
    switch (countryCode) {
      case "NG":
        return "Nigeria";
      case "EE":
        return "Estonia";
      default:
        return "Nigeria"; // Default fallback
    }
  };
  
  const selectedCountry = getCountryName(selectedCountryCode);
  
  // Debug log to show location-based filtering
  
  // Use user's own listings to show recent properties
  const { data, isLoading, error, refetch } = useGetAllMyListingsQuery({
    limit: 3,
    // No category filter - get most recent properties of ANY category
  }) as {
    data: PropertiesResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  const { toggleLike, isLoading: isToggleLoading } = useUpdatePropertyToggleLikeMutation();
  
  // Fetch user favorites to initialize liked properties state
  const { data: favoritesData } = useGetUserFavoriteQuery();

  // Initialize liked properties from user favorites
  useEffect(() => {
    if (favoritesData?.favorites) {
      const favoriteIds = new Set<string>(favoritesData.favorites.map((favorite: { _id: string }) => favorite._id));
      setLikedProperties(favoriteIds);
    }
  }, [favoritesData]);

  const toggleLikeProperty = (propertyId: string) => {
    if (!propertyId) {
      return;
    }

    // Store the current state before optimistic update
    const wasLiked = likedProperties.has(propertyId);

    setLikedProperties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });

    toggleLike(propertyId, {
      onSuccess: (response: { data?: { isLiked?: boolean }; message?: string }) => {
        // Use the response data or fall back to the optimistic update result
        const isLiked = response.data?.isLiked ?? !wasLiked;
        
        setLikedProperties((prev) => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(propertyId);
          } else {
            newSet.delete(propertyId);
          }
          return newSet;
        });
        toast.success(response?.message || `Property ${isLiked ? "liked" : "unliked"} successfully!`);
      },
      onError: (error: { message?: string }) => {
        // Revert the optimistic update
        setLikedProperties((prev) => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(propertyId);
          } else {
            newSet.delete(propertyId);
          }
          return newSet;
        });
        toast.error(error?.message || "Failed to toggle like.");
      },
    });
  };

  const listings = React.useMemo(
    () =>
      (data?.properties || [])
        .filter((property): property is Property => {
          if (!property || typeof property !== "object") return false;
          if (typeof property._id !== "string") return false;
          if (
            !property.media ||
            typeof property.media !== "object" ||
            property.media === null ||
            typeof property.media.coverPhoto !== "string"
          )
            return false;
          if (
            !property.propertyDetails ||
            typeof property.propertyDetails !== "object" ||
            property.propertyDetails === null
          )
            return false;
          if (
            (property.propertyDetails.price !== null && property.propertyDetails.price !== undefined && typeof property.propertyDetails.price !== "number") ||
            (property.propertyDetails.currency !== null && property.propertyDetails.currency !== undefined && typeof property.propertyDetails.currency !== "string")
          )
            return false;
          if (
            !property.location ||
            typeof property.location !== "object" ||
            property.location === null
          )
            return false;
          return true;
        })
        .map((property: Property) => transformPropertyToListing(property)),
    [data]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Listings
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Recent Properties {selectedCountry && `in ${selectedCountry}`}
          </h2>
        </div>
        <Link
          href="/listings"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          aria-label="View all listings"
        >
          <span className="text-sm md:text-base mr-2">See all</span>
          <span
            className="inline-block transform group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center py-12 text-red-500">
          <p>{error.message || "Failed to load listings."}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {listings.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No properties found.
            </div>
          )}
          {listings.map((listing, index) => {
            const isLiked = listing.id ? likedProperties.has(listing.id) : false;
            
            return (
              <div
                key={`${listing.id}-${index}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Link
                    href={`/listings/${listing.category?.toLowerCase()}/${
                      listing.id
                    }`}
                    className="block group"
                  >
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      width={600}
                      height={270}
                      className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
                      priority={false}
                    />
                  </Link>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}
                    </span>
                    {listing.id && (
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"} ${
                          isToggleLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isToggleLoading) {
                            toggleLikeProperty(listing.id);
                          }
                        }}
                      />
                    )}
                  </p>
                <PropertyRatingDisplay 
                  propertyId={listing.id}
                  fallbackRating={listing.rating}
                  fallbackReviewCount={listing.reviewCount}
                />
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  {listing.bedrooms && (
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {listing.bedrooms} Beds
                    </span>
                  )}
                  {listing.bathrooms && (
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {listing.bathrooms} Baths
                    </span>
                  )}
                  {listing.totalAreaSqM && (
                    <span className="flex items-center">
                      <SquareDot className="w-4 h-4 mr-1" />
                      {listing.totalAreaSqM} m²
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    From {listing.price}
                  </span>
                  <button
                    className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm hover:bg-[#A64310] transition-colors"
                    onClick={() =>
                      alert("Contact owner functionality coming soon!")
                    }
                  >
                    Contact owner
                  </button>
                </div>
                <span className="inline-block bg-[#12B34759] text-white text-xs font-medium px-2 py-1 rounded mt-2">
                  Available
                </span>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HomeListingsPreview;
