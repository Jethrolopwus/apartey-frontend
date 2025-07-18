"use client";
import Image from "next/image";
import ListingsButtons from "@/components/atoms/Buttons/ListingButtons";
import {
  Share2,
  Heart,
  Star,
  BedDouble,
  Maximize,
  Navigation,
  ArrowRight,
  Flag,
} from "lucide-react";
import { useGetListingsByIdQuery } from "@/Hooks/use-getAllListingsById.query";
import Link from "next/link";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { useGetUserFavoriteQuery } from "@/Hooks/use-getUsersFavorites.query";
import { toast } from "react-hot-toast";
import React from "react";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { useRouter } from "next/navigation";

// Define proper types for media files
interface MediaFile {
  type: string;
  url: string;
  _id?: string;
  filename?: string;
}

// Restore Props interface
type Props = { id: string };

export default function ListingDetail({ id }: Props) {
  // All hooks must be called at the top, before any conditional return
  const { data: property, isLoading, error } = useGetListingsByIdQuery(id);
  const { toggleLike, isLoading: isToggling } =
    useUpdatePropertyToggleLikeMutation();
  const { refetch: refetchFavorites } = useGetUserFavoriteQuery();
  const [isLiked, setIsLiked] = React.useState(false);
  const router = useRouter();
  // Fetch reviews for this property
  const { data: reviewsData, isLoading: reviewsLoading } = useGetAllReviewsQuery({ limit: 3 });
  // If reviewsData includes all reviews, filter by property id if needed
  type ReviewType = {
    _id: string;
    linkedProperty?: { _id: string };
    reviewer?: { avatarUrl?: string; name?: string };
    createdAt: string;
    overallRating: number;
    detailedReview: string;
  };
  const reviews = (reviewsData?.reviews || []).filter((review: ReviewType) => review.linkedProperty?._id === id);

  // Google Map logic
  const mapCenter = property?.location?.lat && property?.location?.lng
    ? { lat: property.location.lat, lng: property.location.lng }
    : { lat: 9.05785, lng: 7.49508 }; // Default Abuja
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=15&size=600x300&markers=color:orange%7C${mapCenter.lat},${mapCenter.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  React.useEffect(() => {
    // Optionally, set isLiked based on whether this property is in favorites
    // This requires the favorites list to be available in context or via another query
    // For now, default to false
  }, [property]);

  // Helper to ensure a valid image URL is always used
  const getValidImage = (url: string | undefined) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return '/Estate2.png';
    return url;
  };

  // Helper to get the best available address string
  const getDisplayAddress = () => {
    const loc = property?.location || {};
    // Prefer fullAddress if available
    if (loc.fullAddress && loc.fullAddress.trim() !== '') return loc.fullAddress;
    // Otherwise, combine available fields
    const parts = [
      loc.streetAddress || loc.street || '',
      loc.district || '',
      loc.city || '',
      loc.stateOrRegion || loc.state || '',
      loc.country || ''
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No Address';
  };

  // Now, after all hooks, do the loading/error guards
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

  // Property Insights (placeholder, replace with real data if available)
  const insights: {
    marketValue: number;
    analysis: { label: string; value: string }[];
    summary: string;
  } = property.insights || {
    marketValue: 40000,
    analysis: [
      { label: "Population of Area", value: "120,000" },
      { label: "Household Income", value: "NGN 1,200,000/year" },
      { label: "Rental Demand", value: "High" },
      { label: "Nearby Schools", value: "5" },
    ],
    summary: "This area is highly sought after for its proximity to schools and amenities. Rental demand is high and property values are steadily increasing.",
  };

  // Determine Sale/Rent/Buy badge and main action
  const isSale = property.category === 'sell' || property.propertyType === 'sell';
  const isRent = property.category === 'rent' || property.propertyType === 'rent';
  // If you want 'Sale' for sale properties, otherwise 'Buy' for buy, otherwise 'Rent'
  let mainAction = '';
  if (isRent) mainAction = 'Rent';
  else if (isSale) mainAction = 'Sale';
  else mainAction = 'Buy';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Row: Address left, actions right */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-800 truncate">
            {getDisplayAddress()}
          </h2>
        </div>
        <div className="flex gap-6 items-center flex-shrink-0">
          {/* Save Button */}
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-orange-600 bg-transparent border-none p-0 m-0 focus:outline-none transition"
            style={{ background: 'none', border: 'none' }}
            onClick={() => {
              setIsLiked((prev) => !prev);
              toggleLike(property?._id, {
                onSuccess: () => {
                  toast.success("Favorite updated!");
                  refetchFavorites();
                },
                onError: () => {
                  toast.error("Failed to update favorite.");
                  setIsLiked((prev) => !prev); // revert
                },
              });
            }}
            title={isLiked ? "Remove from favorites" : "Add to favorites"}
            disabled={isToggling}
          >
            <Heart className={`w-5 h-5 mr-1 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            <span className="text-base">Save</span>
          </button>
          {/* Share Button */}
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-orange-600 bg-transparent border-none p-0 m-0 focus:outline-none transition"
            style={{ background: 'none', border: 'none' }}
            title="Share"
          >
            <Share2 className="w-5 h-5 mr-1 text-gray-400" />
            <span className="text-base">Share</span>
          </button>
          {/* Report Button */}
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-orange-600 bg-transparent border-none p-0 m-0 focus:outline-none transition"
            style={{ background: 'none', border: 'none' }}
            title="Report"
          >
            <Flag className="w-5 h-5 mr-1 text-gray-400" />
            <span className="text-base">Report</span>
          </button>
          <ListingsButtons variant="primary" className="ml-2 min-w-[90px]">{mainAction}</ListingsButtons>
        </div>
      </div>

      {/* Two-column layout: left = images/map/insights/desc/amenities, right = reviews/ratings */}
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        {/* Left Column */}
        <div className="flex-1 min-w-0">
          {/* Main Image Gallery */}
          <Image
            src={property.media?.coverPhoto || "/Estate2.png"}
            alt="Main view"
            width={800}
            height={600}
            className="w-full h-[400px] object-cover rounded-md mb-4"
          />
          {/* Interior Images */}
          {property.media?.uploads?.filter((file: MediaFile) => file.type === "image").length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {property.media.uploads.filter((file: MediaFile) => file.type === "image").map((img: MediaFile, idx: number) => (
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
          )}

          {/* Map Section */}
          <div className="relative mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Location</h3>
            <div className="w-full h-[260px] bg-gray-200 rounded-lg overflow-hidden relative">
              <Image
                src={mapUrl}
                alt="Map"
                fill
                className="object-cover w-full h-full"
                priority={false}
              />
              {/* Map action buttons */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => mapUrl && window.open(mapUrl, "_blank")}
                  className="p-2 bg-white rounded shadow"
                  title="Open full map"
                >
                  <Maximize size={20} />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`,
                      "_blank"
                    )
                  }
                  className="p-2 bg-white rounded shadow"
                  title="Navigate"
                >
                  <Navigation size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Property Insights Section */}
          <div className="bg-gray-50 rounded-lg p-6 border mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Property Insights</h3>
            <div className="grid grid-cols-1 gap-2 mb-2">
              {insights.analysis.map((item: { label: string; value: string }, idx: number) => (
                <div key={idx} className="flex justify-between text-sm text-gray-700">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-2">{insights.summary}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-green-700 font-bold text-lg">NGN{insights.marketValue.toLocaleString()}</span>
              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">See Complete Property Insights Report</button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6 text-[15px]">
            {property.propertyDetails?.description || "No description available."}
          </p>
        </div>
        {/* Right Column */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-8">
          {/* Building Amenities Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Building Amenities</h3>
            <div className="flex flex-col gap-8 text-sm text-gray-700">
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
          {/* Reviews & Ratings Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Reviews & Ratings</h3>
            <div className="flex flex-col md:flex-col gap-8">
              {/* Reviews List */}
              <div className="flex-1 min-w-0">
                {reviewsLoading ? (
                  <div className="text-center text-gray-500 py-8">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No reviews yet for this property.</div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review: ReviewType) => (
                      <div key={review._id} className="bg-white rounded-lg p-5 border shadow-sm flex gap-4">
                        <div className="flex-shrink-0">
                          <Image src={review.reviewer?.avatarUrl || "/aparteyLogo.png"} alt="avatar" width={48} height={48} className="rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{review.reviewer?.name || "Anonymous"}</span>
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < Math.round(review.overallRating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                            ))}
                            <span className="ml-2 text-xs text-gray-500">{review.overallRating.toFixed(1)}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-1">{review.detailedReview}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Link href={`/reviewsPage?propertyId=${id}`} className="flex items-center gap-1 text-orange-600 font-semibold hover:underline">
                        See all reviews <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* Ratings Summary (stars, count) */}
              <div className="w-full flex-shrink-0 flex flex-col items-center justify-center bg-gray-50 rounded-lg border p-6 mt-8">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} className={i < Math.round(property.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{(property.rating || 0).toFixed(1)}</div>
                <div className="text-sm text-gray-500">({property.reviewCount || 0} reviews)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Homes Section */}
      <div className="mb-10 mt-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Related Homes</h3>
          <button
            className="flex items-center gap-1 text-black font-semibold hover:underline bg-transparent border-none p-0 shadow-none rounded-none transition"
            style={{ boxShadow: 'none', background: 'none', border: 'none' }}
            onClick={() => router.push("/property-listings")}
          >
            See all <ArrowRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {(property.relatedProperties.slice(0, 3) || []).map((rel: {
            _id?: string;
            media?: { coverPhoto?: string };
            propertyDetails?: { description?: string; bedrooms?: number };
            location?: { city?: string; country?: string };
          }, i: number) => (
            <div key={rel._id || i} className="bg-white border rounded-lg shadow-sm flex flex-col">
              <Image src={getValidImage(rel.media?.coverPhoto)} alt="Related Home" width={400} height={180} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1">{rel.propertyDetails?.description?.slice(0, 30) || 'Related Home'}</div>
                  <div className="text-xs text-gray-500 mb-1">{rel.location?.city || ''}, {rel.location?.country || ''}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <Star className="w-3 h-3 text-yellow-400" /> 4.{i} (10 reviews)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BedDouble className="w-3 h-3" /> {rel.propertyDetails?.bedrooms || 3} beds
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
