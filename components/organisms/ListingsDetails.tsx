"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import type { Property } from "@/types/generated";
import { useGetListingsByIdQuery } from "@/Hooks/use-getAllListingsById.query";

interface GetPropertyResponse {
  message: string;
  property: Property;
}

const PropertyDetails = () => {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useGetListingsByIdQuery(id) as {
    data: GetPropertyResponse | undefined;
    isLoading: boolean;
    error: unknown;
  };
  const property = data?.property;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <span className="text-gray-500">Loading property...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
        <span className="text-red-500">Failed to load property.</span>
      </div>
    );
  }

  const getPropertyTitle = () => {
    return (
      property.location?.streetAddress ||
      property.propertyType ||
      "Untitled Property"
    );
  };

  const getPropertyLocation = () => {
    const { city, country } = property.location || {};
    return [city, country].filter(Boolean).join(", ");
  };

  const getPropertyPrice = () => {
    return property.propertyDetails?.price
      ? `${property.propertyDetails.currency || "$"}${
          property.propertyDetails.price
        }/${property.category === "Rent" ? "month" : "night"}`
      : "Price on request";
  };

  const getPropertyImage = () => {
    return property.media?.coverPhoto || "/Estate2.png";
  };

  const getPropertyRating = () => {
    return { rating: 4.5, reviewCount: 12 };
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-teal-800 mb-4">
            {getPropertyTitle()}
          </h1>
          <div className="relative h-96 mb-6">
            <Image
              src={getPropertyImage()}
              alt={getPropertyTitle()}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {getPropertyLocation()}
              </p>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(getPropertyRating().rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {getPropertyRating().rating} (
                  {getPropertyRating().reviewCount} reviews)
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                From {getPropertyPrice()}
              </p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Details
              </h2>
              <p className="text-sm text-gray-600">
                {property.propertyDetails?.description ||
                  "No description available."}
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>Bedrooms: {property.propertyDetails?.bedrooms || "N/A"}</li>
                <li>
                  Bathrooms: {property.propertyDetails?.bathrooms || "N/A"}
                </li>
                <li>
                  Total Area: {property.propertyDetails?.totalAreaSqM || "N/A"}{" "}
                  sqm
                </li>
                <li>
                  Floor: {property.propertyDetails?.floor || "N/A"}/
                  {property.propertyDetails?.totalFloors || "N/A"}
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Amenities
              </h2>
              <ul className="text-sm text-gray-600 space-y-1">
                {property.propertyDetails?.amenities?.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                )) || <li>No amenities listed.</li>}
              </ul>
              <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                Contact
              </h2>
              <p className="text-sm text-gray-600">
                Agent: {property.contactInfo?.firstName}{" "}
                {property.contactInfo?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {property.contactInfo?.email}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {property.contactInfo?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
