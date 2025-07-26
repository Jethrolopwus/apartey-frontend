"use client";

import React from "react";
import { Star, Bed, Bath, Ruler, Heart, Search } from "lucide-react";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import { useRouter } from "next/navigation";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { toast } from "react-hot-toast";
import Image from "next/image";
import type { FC } from "react";

export interface ListingCardProps {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
  size: string;
  oldPrice: string;
  newPrice: string;
  isLiked: boolean;
  onLike: (id: string) => void;
  onClick: (id: string) => void;
}

export const ListingCard: FC<ListingCardProps> = ({
  id,
  imageUrl,
  title,
  location,
  rating,
  reviewCount,
  beds,
  baths,
  size,
  oldPrice,
  newPrice,
  isLiked,
  onLike,
  onClick,
}) => {
  // Determine badge type (for demo, alternate Sale/Rent by id hash)
  const safeId = typeof id === "string" && id.length > 0 ? id : "0";
  const isSale = safeId.charCodeAt(0) % 2 === 0;
  const badgeText = isSale ? "Sale" : "Rent";
  const badgeColor = isSale ? "bg-[#C85212]" : "bg-teal-600";
  return (
    <article
      key={id}
      onClick={() => onClick(id)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden relative border border-gray-100 flex flex-col"
      style={{ minHeight: "370px", boxSizing: "border-box" }}
    >
      {/* image */}
      <div className="relative w-full h-40">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={160}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/Estate2.png";
          }}
          priority={false}
        />
        {/* Single Sale/Rent badge */}
        <span
          className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}
        >
          {badgeText}
        </span>
      </div>
      {/* body */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-medium text-gray-800 text-base truncate mb-1"
            title={title}
          >
            {title}
          </h3>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-500 truncate mr-2">{location}</p>
            <button
              className={`ml-2 bg-white rounded-full p-1 shadow-sm z-10 hover:bg-gray-100 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onLike(id);
              }}
              title={isLiked ? "Remove from favorites" : "Add to favorites"}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <Heart
                size={20}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <div className="flex gap-0.5 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(rating) ? "fill-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-gray-700 text-xs gap-4 mb-1">
            <span
              className="flex items-center gap-1"
              title={`${beds} bedrooms`}
            >
              <Bed size={14} /> {beds}
            </span>
            <span
              className="flex items-center gap-1"
              title={`${baths} bathrooms`}
            >
              <Bath size={14} /> {baths}
            </span>
            <span className="flex items-center gap-1" title={`${size} area`}>
              <Ruler size={14} /> {size}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="line-through">{oldPrice}</span>
            <span className="text-gray-800 font-semibold">{newPrice}</span>
          </div>
        </div>
        {/* Remove bottom like button, handled above */}
      </div>
    </article>
  );
};

const Listings = () => {
  const router = useRouter();

  // Filter states
  const [search, setSearch] = React.useState("");
  const [listingType, setListingType] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("Newest");
  const [propertyType, setPropertyType] = React.useState<string>("All Types");
  const [bedrooms, setBedrooms] = React.useState<string>("Any");
  const [bathrooms, setBathrooms] = React.useState<string>("Any");

  const { data, isLoading, error } = useGetAllListingsQuery({
    limit: 100,
  });
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
    category?: string;
  }) => {
    // (helper fns unchanged)
    const formatPrice = (price: number) => {
      if (typeof price !== "number" || isNaN(price)) return "N/A";
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
      propertyType: property.propertyType,
      bedrooms: property.propertyDetails.bedrooms,
      bathrooms: property.propertyDetails.bathrooms,
      category: property.category || "Rent", // fallback
    };
  };

  // ---------- loading / error / empty states (unchanged) ----------
  if (isLoading) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">
        Loading properties...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-20 text-lg text-red-500">
        Error loading properties.
      </div>
    );
  }

  let listings = data?.properties?.map(transformPropertyToListing) || [];

  // ---------- filtering ----------
  listings = listings.filter((listing) => {
    // Search filter
    if (
      search &&
      !(
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.location.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }
    // Listing type filter
    if (listingType !== "All" && listing.category !== listingType) return false;
    // Property type filter
    if (propertyType !== "All Types" && listing.propertyType !== propertyType)
      return false;
    // Bedrooms filter
    if (bedrooms !== "Any") {
      if (bedrooms === "4+" && listing.beds < 4) return false;
      if (bedrooms !== "4+" && listing.beds !== Number(bedrooms)) return false;
    }
    // Bathrooms filter
    if (bathrooms !== "Any") {
      if (bathrooms === "4+" && listing.baths < 4) return false;
      if (bathrooms !== "4+" && listing.baths !== Number(bathrooms))
        return false;
    }
    return true;
  });

  // ---------- sorting ----------
  if (sortBy === "Newest") {
    listings = listings.slice().reverse();
  } else if (sortBy === "Oldest") {
    // do nothing, default order
  } else if (sortBy === "Price: Low to High") {
    listings = listings.slice().sort((a, b) => {
      const priceA = Number(a.newPrice.replace(/[^\d.]/g, ""));
      const priceB = Number(b.newPrice.replace(/[^\d.]/g, ""));
      return priceA - priceB;
    });
  } else if (sortBy === "Price: High to Low") {
    listings = listings.slice().sort((a, b) => {
      const priceA = Number(a.newPrice.replace(/[^\d.]/g, ""));
      const priceB = Number(b.newPrice.replace(/[^\d.]/g, ""));
      return priceB - priceA;
    });
  }

  // ---------- render ----------
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-14 flex gap-10">
      {/* Sidebar Filter (move to left, add margin-top for alignment) */}
      <aside className="w-full max-w-[280px] bg-white rounded-2xl border border-gray-100 p-8 hidden lg:block shadow-sm mt-[280px]">
        <h3 className="text-xl font-semibold text-gray-800 mb-8">Filters</h3>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">Listing type</p>
          <div className="flex gap-3">
            {["All", "Rent", "Sale"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  listingType === type
                    ? "bg-teal-50 text-teal-700 border-teal-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
                onClick={() => setListingType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">Sort By</p>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base text-gray-700 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">
            Property Type
          </p>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base text-gray-700 bg-white"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option>All Types</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Studio</option>
            <option>Penthouse</option>
          </select>
        </div>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">Bedrooms</p>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base text-gray-700 bg-white"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            <option>Any</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-3">Bathrooms</p>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base text-gray-700 bg-white"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
          >
            <option>Any</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
        <button
          className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-base hover:bg-gray-200 transition"
          onClick={() => {
            setListingType("All");
            setSortBy("Newest");
            setPropertyType("All Types");
            setBedrooms("Any");
            setBathrooms("Any");
            setSearch("");
          }}
        >
          Clear Filters
        </button>
      </aside>
      {/* Main Content (centered for title/subtitle/search) */}
      <div className="flex-1">
        {/* Title & Subtitle */}
        <div className="text-center mb-12">
          <h1
            className="font-bold text-5xl text-teal-800 mb-3 tracking-tight leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Find Your Perfect Property
          </h1>
          <p className="text-lg text-gray-500 font-normal max-w-2xl mx-auto leading-relaxed">
            Discover what real tenants and homeowners are saying about local
            properties around you
          </p>
        </div>
        {/* Search Bar (button inside input) */}
        <div className="flex items-center justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              className="w-full pl-14 pr-36 py-4 rounded-xl border border-gray-200 text-gray-700 bg-white shadow focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition outline-none text-lg font-medium"
              placeholder="Lagos, Nigeria"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#C85212] hover:bg-orange-600 text-white font-semibold px-8 py-2 rounded-lg flex items-center gap-2 transition text-lg shadow"
              style={{ height: "48px" }}
              onClick={() => {}}
            >
              <Search size={20} className="mr-2" />
              Search
            </button>
          </div>
        </div>
        {/* Property count and pagination top */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-semibold text-teal-800">
            {listings.length} Properties found
          </span>
          <span className="text-sm text-gray-500">Page 1 of 1</span>
        </div>
        {/* Cards Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const isLiked = likedIds.includes(listing.id);
            return (
              <ListingCard
                key={listing.id}
                id={listing.id}
                imageUrl={listing.imageUrl}
                title={listing.title}
                location={listing.location}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
                beds={listing.beds}
                baths={listing.baths}
                size={listing.size}
                oldPrice={listing.oldPrice}
                newPrice={listing.newPrice}
                isLiked={isLiked}
                onLike={() => {
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
                onClick={() => router.push(`/listings/${listing.id}`)}
              />
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
            <button className="w-8 h-8 text-sm rounded bg-teal-600 text-white transition-colors">
              1
            </button>
          </div>
          <button
            className="text-gray-400 hover:text-teal-600 transition-colors px-2 py-1 rounded"
            disabled
          >
            {"Next >"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Listings;
