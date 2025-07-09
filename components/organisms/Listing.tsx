"use client";

import React from "react";
import { Star, Bed, Bath, Ruler, Heart, Search, Filter } from "lucide-react";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import { useRouter } from "next/navigation";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { toast } from "react-hot-toast";
import Image from "next/image";

const Listings = () => {
  const router = useRouter();

  const { data, isLoading, error } = useGetAllListingsQuery({
    limit: 6,
  });

  // For favorites refetch
  const { refetch: refetchFavorites } = useGetUserFavoriteQuery();
  const { toggleLike } = useUpdatePropertyToggleLikeMutation();
  const [likedIds, setLikedIds] = React.useState<string[]>([]);

  // ---------------- helpers ----------------
  const transformPropertyToListing = (property: {
    _id: string;
    media: { coverPhoto: string };
    adPromotion: { certifiedByFinder?: boolean };
    propertyDetails: {
      description: string;
      bedrooms: number;
      bathrooms: number;
      totalAreaSqM: number;
      price: number;
    };
    propertyType: string;
    location: { district: string; city: string; country: string };
  }) => {
    // (helper fns unchanged)
    const formatPrice = (price: number) => {
      if (price >= 1_000_000)
        return `NGN${(price / 1_000_000).toFixed(1)}M/Year`;
      if (price >= 1_000) return `NGN${(price / 1_000).toFixed(0)}K/Year`;
      return `NGN${price.toLocaleString()}/Year`;
    };
    const generateOldPrice = (current: number) =>
      formatPrice(Math.round(current * (1.3 + Math.random() * 0.4)));

    const rating = 3.5 + Math.random() * 1.5;
    const reviews = Math.floor(Math.random() * 50) + 5;

    return {
      id: property._id,
      imageUrl: property.media.coverPhoto,
      verified: property.adPromotion?.certifiedByFinder || false,
      title:
        `${property.propertyDetails.description.substring(0, 20)}...` ||
        `${property.propertyType} in ${property.location.district}`,
      location: `${property.location.city}, ${property.location.country}`,
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviews,
      beds: property.propertyDetails.bedrooms,
      baths: property.propertyDetails.bathrooms,
      size: `${property.propertyDetails.totalAreaSqM}m²`,
      oldPrice: generateOldPrice(property.propertyDetails.price),
      newPrice: formatPrice(property.propertyDetails.price),
    };
  };

  // ---------- loading / error / empty states (unchanged) ----------
  if (isLoading) {
    /* … */
  }
  if (error) {
    /* … */
  }

  const listings = data?.properties?.map(transformPropertyToListing) || [];
  if (listings.length === 0) {
    /* … */
  }

  // ---------- render ----------
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10 flex gap-8">
      {/* Sidebar Filter */}
      <aside className="w-full max-w-[270px] bg-white rounded-xl border border-gray-100 p-6 hidden lg:block">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Filters</h3>
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">Listing type</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-600">
              All
            </button>
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              Rent
            </button>
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              Buy
            </button>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">Sort By</p>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-7000 bg-white">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Property Type
          </p>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white">
            <option>All Types</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Studio</option>
            <option>Penthouse</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">Bedrooms</p>
          <input type="range" min="0" max="10" className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>NGN0</span>
            <span>NGN10,000,000</span>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">Bedrooms</p>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white">
            <option>Any</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-xs font-mmedium text-gray-500 mb-2">Bathrooms</p>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white">
            <option>Any</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
        <button className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-200 transition">
          Clear Filters
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md px-4 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              className="flex-1 outline-none text-gray-700 bg-transparent"
              placeholder="Lagos, Nigeria"
            />
          </div>
          <button className="ml-2 px-6 py-2 cursor-pointer bg-[#C85212] text-white rounded-md font-medium hover:bg-orange-600 transition flex items-center gap-2">
            <Filter size={18} />
            Search
          </button>
        </div>

        {/* Property count and pagination top */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-teal-800">
            12 Properties found
          </span>
          <span className="text-xs text-gray-500">Page 1 of 13</span>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const isLiked = likedIds.includes(listing.id);
            return (
              <article
                key={listing.id}
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden relative border border-gray-100 flex flex-col"
                style={{ minHeight: "370px", boxSizing: "border-box" }}
              >
                {/* image */}
                <div className="relative w-full h-40">
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    width={400}
                    height={160}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/Estate2.png";
                    }}
                    priority={false}
                  />
                  {/* Sale/Rent badge */}
                  <span className="absolute top-3 left-3 bg-[#C85212] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Sale
                  </span>
                  <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Rent
                  </span>
                </div>
                {/* body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-medium text-gray-800 text-base truncate mb-1"
                      title={listing.title}
                    >
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {listing.location}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
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
                      <span className="text-xs font-medium text-gray-700">
                        {listing.rating.toFixed(1)} ({listing.reviewCount}{" "}
                        reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700 text-xs gap-4 mb-1">
                      <span
                        className="flex items-center gap-1"
                        title={`${listing.beds} bedrooms`}
                      >
                        <Bed size={14} /> {listing.beds}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        title={`${listing.baths} bathrooms`}
                      >
                        <Bath size={14} /> {listing.baths}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        title={`${listing.size} area`}
                      >
                        <Ruler size={14} /> {listing.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">{listing.oldPrice}</span>
                      <span className="text-gray-800 font-semibold">
                        {listing.newPrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      className={`text-gray-400 hover:text-teal-600 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedIds((prev) =>
                          prev.includes(listing.id)
                            ? prev.filter((id) => id !== listing.id)
                            : [...prev, listing.id]
                        );
                        toggleLike(listing.id, {
                          onSuccess: () => {
                            toast.success("Favorite updated!");
                            refetchFavorites();
                          },
                          onError: () => {
                            toast.error("Failed to update favorite.");
                          },
                        });
                      }}
                      title={
                        isLiked ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <Heart
                        size={20}
                        className={isLiked ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <button
            className="text-gray-400 hover:text-teal-600 transition-colors px-2 py-1 rounded disabled:opacity-50"
            disabled
          >
            {"< Previous"}
          </button>
          <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 text-sm rounded ${
                  i === 0
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } transition-colors`}
              >
                {i + 1}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 text-sm rounded text-gray-600 hover:bg-gray-100 transition-colors">
              13
            </button>
          </div>
          <button className="text-gray-400 hover:text-teal-600 transition-colors px-2 py-1 rounded">
            {"Next >"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Listings;
