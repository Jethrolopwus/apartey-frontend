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
  location: { district?: string; city?: string; country?: string };
  [key: string]: unknown;
}

interface Favorite {
  _id: string;
}

// Define the structure for unknown property data from API
interface UnknownProperty {
  _id?: unknown;
  media?: unknown;
  propertyDetails?: unknown;
  propertyType?: unknown;
  location?: unknown;
  [key: string]: unknown;
}

// Define the structure for API response
interface ListingsApiResponse {
  properties?: UnknownProperty[];
  [key: string]: unknown;
}

const isValidProperty = (
  property: UnknownProperty
): property is PropertyBackendType => {
  if (!property || typeof property !== "object") return false;

  if (typeof property._id !== "string") return false;

  if (
    !property.media ||
    typeof property.media !== "object" ||
    property.media === null
  )
    return false;
  const media = property.media as { coverPhoto?: unknown };
  if (typeof media.coverPhoto !== "string") return false;
  if (
    !property.propertyDetails ||
    typeof property.propertyDetails !== "object" ||
    property.propertyDetails === null
  )
    return false;
  const details = property.propertyDetails as {
    description?: unknown;
    bedrooms?: unknown;
    bathrooms?: unknown;
    totalAreaSqM?: unknown;
    price?: unknown;
  };
  if (
    typeof details.description !== "string" ||
    typeof details.bedrooms !== "number" ||
    typeof details.bathrooms !== "number" ||
    typeof details.totalAreaSqM !== "number" ||
    typeof details.price !== "number"
  )
    return false;

  if (typeof property.propertyType !== "string") return false;

  if (
    !property.location ||
    typeof property.location !== "object" ||
    property.location === null
  )
    return false;

  return true;
};

const transformPropertyToListing = (
  property: PropertyBackendType,
  likedIds: string[]
): ListingCardProps => {
  const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A";
    if (price >= 1_000_000) return `NGN${(price / 1_000_000).toFixed(1)}M/Year`;
    if (price >= 1_000) return `NGN${(price / 1_000).toFixed(0)}K/Year`;
    return `NGN${price.toLocaleString()}/Year`;
  };

  const truncateTitle = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const words = text.split(" ");
    let result = "";
    for (const word of words) {
      if ((result + word).length > maxLength - 3) break;
      result += (result ? " " : "") + word;
    }
    return result + "...";
  };

  const locationParts = [
    property.location.district || "",
    property.location.city || "",
    property.location.country || "",
  ].filter(Boolean);
  const location =
    locationParts.length > 0
      ? locationParts.join(", ")
      : "Location not specified";

  const title = property.propertyDetails.description
    ? truncateTitle(property.propertyDetails.description, 20)
    : `${property.propertyType} in ${
        property.location.district ||
        property.location.city ||
        property.location.country ||
        "Unknown"
      }`;

  return {
    id: property._id,
    imageUrl: property.media.coverPhoto || "/fallback-image.jpg",
    title,
    location,
    rating: 4.0, // Replace with backend data
    reviewCount: 10, // Replace with backend data
    beds: property.propertyDetails.bedrooms,
    baths: property.propertyDetails.bathrooms,
    size: `${property.propertyDetails.totalAreaSqM}m²`,
    oldPrice: formatPrice(Math.round(property.propertyDetails.price * 1.3)),
    newPrice: formatPrice(property.propertyDetails.price),
    isLiked: likedIds.includes(property._id),
    onLike: () => {},
    onClick: () => {},
  };
};

const HomeListingsPreview: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetAllListingsQuery({
    limit: 3,
  }) as {
    data?: ListingsApiResponse;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  const { data: favoritesData, refetch: refetchFavorites } =
    useGetUserFavoriteQuery();
  const { toggleLike } = useUpdatePropertyToggleLikeMutation();
  const [likedIds, setLikedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    console.log("favoritesData:", favoritesData);
    if (Array.isArray(favoritesData)) {
      setLikedIds(favoritesData.map((fav: Favorite) => fav._id));
    } else if (
      favoritesData &&
      typeof favoritesData === "object" &&
      Array.isArray((favoritesData as { favorites?: Favorite[] }).favorites)
    ) {
      setLikedIds(
        (favoritesData as { favorites: Favorite[] }).favorites.map(
          (fav: Favorite) => fav._id
        )
      );
    } else {
      // Set to empty array if no valid data
      setLikedIds([]);
    }
  }, [favoritesData]);

  const listings = React.useMemo(
    () =>
      (data?.properties || [])
        .filter(isValidProperty)
        .map((property: PropertyBackendType) =>
          transformPropertyToListing(property, likedIds)
        ),
    [data, likedIds]
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
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              isLiked={likedIds.includes(listing.id)}
              onLike={() => {
                const newLikedIds = likedIds.includes(listing.id)
                  ? likedIds.filter((id) => id !== listing.id)
                  : [...likedIds, listing.id];
                setLikedIds(newLikedIds);
                toggleLike(listing.id, {
                  onSuccess: () => {
                    toast.success("Favorite updated!");
                    refetchFavorites();
                  },
                  onError: () => {
                    setLikedIds(likedIds); // Revert on error
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
