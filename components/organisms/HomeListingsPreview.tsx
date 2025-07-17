"use client";
import React from "react";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ListingCard } from "./Listing";
import type { ListingCardProps } from "./Listing";

// Instead of: const transformPropertyToListing = (property: Record<string, any>): ListingCardProps => {
// Use a more specific type for property
interface PropertyBackendType {
  _id: string;
  media: { coverPhoto: string };
  adPromotion?: { certifiedByFinder?: boolean };
  propertyDetails: {
    description: string;
    bedrooms: number;
    bathrooms: number;
    totalAreaSqM: number;
    price: number;
  };
  propertyType: string;
  location: { district: string; city: string; country: string };
}

const transformPropertyToListing = (property: PropertyBackendType): ListingCardProps => {
  const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A";
    if (price >= 1_000_000) return `NGN${(price / 1_000_000).toFixed(1)}M/Year`;
    if (price >= 1_000) return `NGN${(price / 1_000).toFixed(0)}K/Year`;
    return `NGN${price.toLocaleString()}/Year`;
  };
  const generateOldPrice = (current: number) => formatPrice(Math.round(current * (1.3 + Math.random() * 0.4)));
  const rating = 3.5 + Math.random() * 1.5;
  const reviews = Math.floor(Math.random() * 50) + 5;
  return {
    id: property._id,
    imageUrl: property.media.coverPhoto,
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
    isLiked: false,
    onLike: () => {},
    onClick: () => {},
  };
};

const HomeListingsPreview: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetAllListingsQuery({ limit: 3 });
  const { refetch: refetchFavorites } = useGetUserFavoriteQuery();
  const { toggleLike } = useUpdatePropertyToggleLikeMutation();
  const [likedIds, setLikedIds] = React.useState<string[]>([]);

  const listings: ListingCardProps[] = (data?.properties as PropertyBackendType[] | undefined)?.map(transformPropertyToListing) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Listings</p>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Deals for you</h2>
        </div>
        <Link href="/listings" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
          <span className="text-sm md:text-base mr-2">See all</span>
          <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">Failed to load listings.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              isLiked={likedIds.includes(listing.id)}
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
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeListingsPreview; 