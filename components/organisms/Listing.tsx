"use client";
import React, { useState } from "react";
import { Star, Bed, Bath, Ruler, Heart } from "lucide-react";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import { useRouter } from "next/navigation";

const Listings = () => {
const router = useRouter();

  const [hoveredCardId, setHoveredCardId] = useState(null);

  const { data, isLoading, error, refetch } = useGetAllListingsQuery({
    limit: 6,
  });

  const transformPropertyToListing = (property: {
    _id: any;
    media: { coverPhoto: any };
    adPromotion: { certifiedByFinder: any };
    propertyDetails: {
      description: string;
      bedrooms: any;
      bathrooms: any;
      totalAreaSqM: any;
      price: any;
    };
    propertyType: any;
    location: { district: any; city: any; country: any };
  }) => {
    const formatPrice = (price: number) => {
      if (price >= 1000000) {
        return `NGN${(price / 1000000).toFixed(1)}M/Year`;
      } else if (price >= 1000) {
        return `NGN${(price / 1000).toFixed(0)}K/Year`;
      }
      return `NGN${price.toLocaleString()}/Year`;
    };

    const generateOldPrice = (currentPrice: number) => {
      const increasePercentage = 0.3 + Math.random() * 0.4;
      const oldPrice = Math.round(currentPrice * (1 + increasePercentage));
      return formatPrice(oldPrice);
    };

    const rating = 3.5 + Math.random() * 1.5;
    const reviewCount = Math.floor(Math.random() * 50) + 5;

    return {
      id: property._id,
      imageUrl: property.media.coverPhoto,
      verified: property.adPromotion?.certifiedByFinder || false,
      title:
        `${property.propertyDetails.description.substring(0, 20)}...` ||
        `${property.propertyType} in ${property.location.district}`,
      location: `${property.location.city}, ${property.location.country}`,
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviewCount,
      beds: property.propertyDetails.bedrooms,
      baths: property.propertyDetails.bathrooms,
      size: `${property.propertyDetails.totalAreaSqM}m²`,
      oldPrice: generateOldPrice(property.propertyDetails.price),
      newPrice: formatPrice(property.propertyDetails.price),
    };
  };

  // Handle loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              LISTINGS
            </p>
            <h2 className="text-xl md:text-xl font-semibold text-gray-800">
              Deals for you
            </h2>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-gray-200 rounded-xl h-80 animate-pulse">
              <div className="h-48 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              LISTINGS
            </p>
            <h2 className="text-xl md:text-xl font-semibold text-gray-800">
              Deals for you
            </h2>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Error loading properties:</p>
            <p className="text-red-500 text-sm mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data
  const listings = data?.properties?.map(transformPropertyToListing) || [];

  // Handle empty state
  if (listings.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              LISTINGS
            </p>
            <h2 className="text-xl md:text-xl font-semibold text-gray-800">
              Deals for you
            </h2>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-2">
              No properties available at the moment.
            </p>
            <p className="text-gray-500 text-sm">
              Check back later for new listings!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
            LISTINGS
          </p>
          <h2 className="text-xl md:text-xl font-semibold text-gray-800">
            Deals for you
          </h2>
        </div>
       
      </div>

      {/* Properties Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {listings.length}{" "}
          {listings.length === 1 ? "property" : "properties"}
          {data?.totalProperties &&
            data.totalProperties > listings.length &&
            ` of ${data.totalProperties} total`}
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing: any) => (
          <article
            key={listing.id}
            onClick={() => router.push(`/listings/${listing.id}`)}
            className=" cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden relative group"
            onMouseEnter={() => setHoveredCardId(listing.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            onTouchStart={() =>
              setHoveredCardId(listing.id === hoveredCardId ? null : listing.id)
            }
          >
            {/* Image */}
            <div className="relative w-full h-48">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/Estate2.png";
                }}
                loading="lazy"
              />

              {/* Verified Button */}
              {listing.verified && (
                <button className="absolute top-3 right-3 bg-white text-teal-600 text-xs font-semibold px-3 py-1 rounded-full border border-teal-600 shadow-sm hover:bg-teal-50 z-10">
                  Verified
                </button>
              )}

              {/* Overlay on hover */}
              <div
                className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 ${
                  hoveredCardId === listing.id
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-3 w-3/4">
                  <button
                    className="bg-white text-gray-800 py-2 px-4 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-100 transition w-full text-center"
                    onClick={() => router.push(`/listingsPage/${listing.id}`)}
                  >
                    Rent Home
                  </button>
                  <button
                    className="bg-white text-gray-800 py-2 px-4 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-100 transition w-full text-center"
                    onClick={() => router.push(`/listingsPage/${listing.id}`)}
                  >
                    Swap Home
                  </button>
                </div>
              </div>

              {/* Carousel dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot === 1 ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <h3
                className="font-medium text-gray-800 text-base truncate"
                title={listing.title}
              >
                {listing.title}
              </h3>
              <p className="text-sm text-gray-500">{listing.location}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(listing.rating)
                          ? "fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="underline text-sm">
                  {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
                </span>
              </div>

              {/* Icons */}
              <div className="flex items-center text-gray-700 text-sm gap-4 mt-2">
                <span
                  className="flex items-center gap-1"
                  title={`${listing.beds} bedrooms`}
                >
                  <Bed size={16} /> {listing.beds}
                </span>
                <span
                  className="flex items-center gap-1"
                  title={`${listing.baths} bathrooms`}
                >
                  <Bath size={16} /> {listing.baths}
                </span>
                <span
                  className="flex items-center gap-1"
                  title={`${listing.size} area`}
                >
                  <Ruler size={16} /> {listing.size}
                </span>
              </div>

              {/* Prices & Heart */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm">
                  <p className="line-through text-gray-400">
                    {listing.oldPrice}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {listing.newPrice}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-teal-600 transition-colors"
                  onClick={() => {
                    // Add your favorite/wishlist logic here
                    console.log("Added to favorites:", listing.id);
                  }}
                  title="Add to favorites"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More / Pagination if needed */}
      {data?.hasNextPage && (
        <div className="text-center mt-8">
          <button
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => {
              // Add load more logic here
              console.log("Load more properties");
            }}
          >
            Load More Properties
          </button>
        </div>
      )}
    </section>
  );
};

export default Listings;
