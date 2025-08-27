"use client";
import React from "react";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, Bed, Bath, SquareDot } from "lucide-react";
import {
  Property,
  PropertiesResponse,
  PropertyCategory,
} from "@/types/generated";

const transformPropertyToListing = (property: Property) => {
  const getPropertyTitle = (property: Property) => {
    return (
      property.location?.streetAddress ||
      property.propertyType ||
      "Untitled Property"
    );
  };

  const getPropertyLocation = (property: Property) => {
    const { city, country } = property.location || {};
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
  const { data, isLoading, error, refetch } = useGetAllListingsQuery({
    limit: 3,
  }) as {
    data: PropertiesResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
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
            typeof property.propertyDetails.price !== "number" ||
            typeof property.propertyDetails.currency !== "string"
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
            Deals for you
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
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"
            aria-label="Loading listings"
          ></div>
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
          {listings.map((listing, index) => (
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
                  <Heart className="w-4 h-4 text-gray-400" />{" "}
                  {/* Moved here, static */}
                </p>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(listing.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {listing.rating} ({listing.reviewCount} reviews)
                  </span>
                </div>
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
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeListingsPreview;
