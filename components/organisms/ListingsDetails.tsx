"use client";
import Image from "next/image";
import ListingsButtons from "@/components/atoms/Buttons/ListingButtons";
import {
  Share2,
  Heart,
  Star,
  Mail,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { useGetListingsByIdQuery } from "@/Hooks/use-getAllListingsById.query";
import Link from "next/link";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { toast } from "react-hot-toast";
import React from "react";

interface Props {
  id: string;
}

// Define proper types for media files
interface MediaFile {
  type: string;
  url: string;
  _id?: string;
  filename?: string;
}

export default function ListingDetail({ id }: Props) {
  const { data: property, isLoading, error } = useGetListingsByIdQuery(id);
  const { toggleLike, isLoading: isToggling } =
    useUpdatePropertyToggleLikeMutation();
  const { refetch: refetchFavorites } = useGetUserFavoriteQuery();
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    // Optionally, set isLiked based on whether this property is in favorites
    // This requires the favorites list to be available in context or via another query
    // For now, default to false
  }, [property]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Loading listing...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load listing details.
      </div>
    );
  }

  const { location, media, propertyDetails } = property;
  const coverPhoto = media?.coverPhoto || "/Estate2.png";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title and buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
          {property?.location?.streetAddress || "No Address"}{" "}
          {location?.district} {location?.city} {location?.state}
        </h2>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-full border ${
              isLiked ? "bg-red-100 border-red-300" : "bg-white border-gray-300"
            } transition-colors`}
            onClick={() => {
              setIsLiked((prev) => !prev);
              toggleLike(property?._id, {
                onSuccess: () => {
                  console.log("The property", property);

                  toast.success("Favorite updated!");
                  refetchFavorites();
                },
                onError: () => {
                  console.log("The property", property);
                  toast.error("Failed to update favorite.");
                  setIsLiked((prev) => !prev); // revert
                },
              });
            }}
            title={isLiked ? "Remove from favorites" : "Add to favorites"}
            disabled={isToggling}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
          <ListingsButtons icon={Share2} variant="outline">
            Share
          </ListingsButtons>
          <ListingsButtons variant="primary">Rent</ListingsButtons>
        </div>
      </div>

      {/* Cover + Description + Amenities side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Cover photo */}
        <Image
          src={coverPhoto}
          alt="Main view"
          width={800}
          height={600}
          className="w-full h-[400px] object-cover rounded-md"
        />

        {/* Description + Amenities */}
        <div className="ml-10 ">
          <p className="text-gray-700 leading-relaxed mb-6 text-[15px]">
            {propertyDetails?.description || "No description available."}
          </p>

          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Building Amenities
          </h3>
          <div className=" flex flex-col gap-8 text-sm  text-gray-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Business Center: Office</li>
              <li>Club House: Resident</li>
              <li>Conference Room: Resident</li>
              <li>Fitness Center: 24/7</li>
              <li>Library: In Clubroom</li>
            </ul>

            <ul className="list-disc list-inside space-y-1">
              <li>Swimming Pool: Brand New</li>
              <li>Gated Entry: Access</li>
              <li>Night Patrol: Random</li>
              <li>Package Service: 24/7</li>
              <li>Valet Trash: Door to Door</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interior Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {media?.uploads
          ?.filter((file: MediaFile) => file.type === "image")
          .map((img: MediaFile, idx: number) => (
            <Image
              key={img._id || idx}
              src={img.url}
              alt={`Interior ${idx + 1}`}
              width={200}
              height={150}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
      </div>

      {/* Property details icons */}
      <div className="flex items-center text-gray-700 gap-6 mb-8 text-sm flex-wrap">
        <div className="flex items-center gap-1">
          <BedDouble size={16} /> {propertyDetails?.bedrooms || 0} Bed
        </div>
        <div className="flex items-center gap-1">
          <Bath size={16} /> {propertyDetails?.bathrooms || 0} Bath
        </div>
        <div className="flex items-center gap-1">
          <Ruler size={16} /> {propertyDetails?.totalAreaSqM || 0} sqft
        </div>
        <div className="text-gray-500 text-sm">
          NGN {propertyDetails?.price?.toLocaleString()} / year
        </div>
      </div>

      {/* Realtor info */}
      <div className="border p-4 rounded shadow-sm mb-10">
        <h4 className="font-semibold text-gray-800 mb-1">Jacen Lin</h4>
        <p className="text-sm text-gray-600">AREA Realty Network Pte Ltd</p>
        <div className="flex items-center gap-1 text-yellow-500 mt-1">
          <Star size={16} />
          <span className="text-sm">4 stars (120 reviews)</span>
        </div>
        <div className="flex gap-2 mt-4">
          <ListingsButtons icon={Mail} variant="outline">
            Send Message
          </ListingsButtons>
          <Link href={`/write-reviews/listed/${id}`}>
            <ListingsButtons variant="primary">Leave a Review</ListingsButtons>
          </Link>
        </div>
      </div>

      {/* Map */}
      <div className="mb-4">
        <Image
          src="/Map.png"
          alt="Map"
          width={1200}
          height={400}
          className="rounded w-full object-cover"
        />
      </div>
    </div>
  );
}
