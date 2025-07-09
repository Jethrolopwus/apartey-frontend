"use client";

import React from "react";
import { Heart, Star, Bed, Bath, Square } from "lucide-react";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  priceOriginal: string;
  priceDiscounted: string;
  image: string;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

interface FavoritesPageProps {
  properties?: PropertyCardProps[];
  onViewAll?: () => void;
}

interface FavoriteItem {
  _id: string;
  propertyDetails?: {
    description?: string;
    bedrooms?: number;
    bathrooms?: number;
    totalAreaSqM?: number;
    price?: number;
  };
  location?: {
    street?: string;
    district?: string;
    fullAddress?: string;
    stateOrRegion?: string;
    country?: string;
  };
  media?: {
    coverPhoto?: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  rating,
  reviewCount,
  bedrooms,
  bathrooms,
  area,
  priceOriginal,
  priceDiscounted,
  image,
  isFavorited = true,
  onToggleFavorite,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Property Image */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
          priority={false}
        />
        {/* Rent Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
            Rent
          </span>
        </div>
        {/* Heart Icon */}
        <button
          onClick={() => onToggleFavorite?.(id)}
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow ${
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {/* Image Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{location}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">
            {rating}
          </span>
          <span className="ml-1 text-sm text-gray-500">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center">
            <Bed className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{area}m²</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 line-through">
            {priceOriginal}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {priceDiscounted}
          </span>
        </div>
      </div>
    </div>
  );
};

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onViewAll }) => {
  const { data, isLoading, isError, error } = useGetUserFavoriteQuery();
  const { toggleLike } = useUpdatePropertyToggleLikeMutation();
  const { refetch } = useGetUserFavoriteQuery();

  // Map API data to PropertyCardProps
  const apiProperties = (data?.favorites || []).map((item: FavoriteItem) => ({
    id: item._id,
    title:
      item.propertyDetails?.description ||
      `${item.location?.street || ""}, ${item.location?.district || ""}`,
    location:
      item.location?.fullAddress ||
      `${item.location?.district || ""}, ${
        item.location?.stateOrRegion || ""
      }, ${item.location?.country || ""}`,
    rating: 0,
    reviewCount: 0,
    bedrooms: item.propertyDetails?.bedrooms || 0,
    bathrooms: item.propertyDetails?.bathrooms || 0,
    area: item.propertyDetails?.totalAreaSqM || 0,
    priceOriginal: item.propertyDetails?.price
      ? `₦${item.propertyDetails.price.toLocaleString()}`
      : "",
    priceDiscounted: item.propertyDetails?.price
      ? `₦${item.propertyDetails.price.toLocaleString()}`
      : "",
    image: item.media?.coverPhoto || "/Estate2.png",
    isFavorited: true,
  }));

  const handleToggleFavorite = (id: string) => {
    toggleLike(id, {
      onSuccess: () => {
        toast.success("Favorite updated!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update favorite.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading favorites...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {typeof error === "object" && error && "message" in error
          ? (error as { message?: string }).message
          : "Failed to load favorites."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Favorites</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Favorites</p>
            <button
              onClick={onViewAll}
              className="text-[#C85212] cursor-pointer hover:text-orange-600 font-medium text-sm"
            >
              View all →
            </button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
          {apiProperties.length > 0 ? (
            apiProperties.map((property: PropertyCardProps) => (
              <PropertyCard
                key={property?.id}
                {...property}
                onToggleFavorite={handleToggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              No favorites found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;
