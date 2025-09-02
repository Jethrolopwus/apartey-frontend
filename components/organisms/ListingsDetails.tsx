
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Star, Share2, Flag, Home, Bookmark, Bed, Bath, Heart } from "lucide-react";
import Image from "next/image";
import type { Property } from "@/types/generated";
import { useGetListingsByIdQuery } from "@/Hooks/use-getAllListingsById.query";
import { useRouter } from "next/navigation";

interface GetPropertyResponse {
  message: string;
  property: Property;
}

const PropertyDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

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

  const getPropertyImage = () => {
    return property.media?.coverPhoto || "/Estate2.png";
  };

  const getFullAddress = () => {
    const { streetAddress, city, country } = property.location || {};
    return [streetAddress, city, country].filter(Boolean).join(", ");
  };

  const getPropertyPrice = () => {
    if (!property.propertyDetails?.price) return "Price on request";
    const currency = property.propertyDetails.currency || "€";
    const period = property.propertyDetails.period
      ? `/${property.propertyDetails.period}`
      : "";
    return `${currency}${property.propertyDetails.price}${period}`;
  };

  const handleWriteReview = () => {
    const fullAddress = getFullAddress();
    router.push(
      `/write-reviews/listed?address=${encodeURIComponent(fullAddress)}&propertyId=${id}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg mb-12">
      {/* Full Address, Price, and Action Buttons at the Top */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getFullAddress()}
          </h1>
          <div className="text-lg font-semibold text-[#C85212] mb-2">
            {getPropertyPrice()}
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 border flex items-center gap-2">
            <Heart className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Save</span>
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 border flex items-center gap-2">
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Share</span>
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 border flex items-center gap-2">
            <Flag className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Report</span>
          </button>
          <button className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#A64310]">
            Request Swap
          </button>
        </div>
      </div>

      {/* Main Image and Thumbnails */}
      <div className="mb-8 flex gap-8 ">
        <div className="mb-4">
          <Image
            src={getPropertyImage()}
            alt={getPropertyTitle()}
            width={1200}
            height={600}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="">
          <div className="flex gap-8  ">
            <Image
              src="/Estate2.png"
              alt="Interior 1"
              width={200}
              height={120}
              className="w-52 h-40 object-cover rounded-lg"
            />
            <Image
              src="/Estate2.png"
              alt="Interior 2"
              width={200}
              height={120}
              className="w-52 h-40 object-cover rounded-lg"
            />
            <Image
              src="/Estate2.png"
              alt="Interior 3"
              width={200}
              height={120}
              className="w-52 h-40 object-cover rounded-lg"
            />

          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.propertyDetails?.description ||
                "Situated within 14 km of Magic Land Abuja and 21 km of IBB Golf Club, Phoenix Luxury Apartments features rooms with air conditioning and free WiFi throughout the property. This recently renovated property offers a fully equipped kitchen with oven and a flat-screen TV, ironing facilities, desk and a seating area. Featuring a patio, the homestead is a unit that comes with a bed linen and towels."}
            </p>
          </div>
        </div>


      </div>

  

<div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1">
          {/* Map */}
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-8">
            <Image
              src="/Map.png"
              alt="Map"
              width={800}
              height={400}
              className="w-full h-[300px] object-cover"
            />
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 gap-3 text-gray-700">
              {["Swimming Pool", "Gym", "Parking", "Security", "Play Area", "Club House"].map(
                (amenity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    ✅ {amenity}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Local Insights */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Local Insights</h2>
            <div className="space-y-2 text-gray-700">
              <p>✅ Great neighborhood for families</p>
              <p>✅ Close to public transport</p>
              <p>✅ Plenty of parks and green areas</p>
            </div>
          </div>
        </div>

        {/* Right Section (Agent Info + Reviews) */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          {/* Agent Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h2>
            <div className="flex items-center gap-4">
              <Image
                src="/Ellipse-1.png"
                alt="Agent"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Jacen Lin</h3>
                <p className="text-sm text-gray-600">A REA Realty Network Pvt Ltd</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.5 (120 reviews)</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#A64310]">
                  Send Message
                </button>
                <button
                  onClick={handleWriteReview}
                  className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#A64310]"
                >
                  Write a review
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {[
                {
                  name: "Emily Chen",
                  date: "June 12, 2025",
                  rating: 5,
                  review:
                    "Review of 450 Elm St, San Francisco, CA 94102 - Charming home with a vintage touch, featuring spacious rooms and a lovely garden. The proximity to local cafes was a bonus.",
                },
                {
                  name: "Michael Smith",
                  date: "July 19, 2025",
                  rating: 5,
                  review:
                    "Review of 102 Maple Ave, Austin, TX 73301 - Contemporary loft with an open concept layout. It was perfect for entertaining, and the rooftop access was a highlight.",
                },
              ].map((review, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start gap-4">
                    <Image
                      src={index % 2 === 0 ? "/Ellipse-2.png" : "/Ellipse-1.png"}
                      alt="Reviewer"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{review.name}</span>
                        <span className="text-xs text-gray-500">{review.date}</span>
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{review.review}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Related Homes */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Related Homes</h2>
          <button className="text-[#C85212] hover:text-[#A64310] text-sm font-medium">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "No 1. kumuye strt...",
              location: "Okene, Kogi",
              price: "NGN450,000/year",
              rating: 4.5,
              reviews: 8,
              beds: 4,
              baths: 4,
              sqft: 4000,
              id: "NGN450,000/year",
              image: "/Estate2.png",
              tag: "New"
            },
            {
              title: "No 2. luxury stylish home",
              location: "Okene, Kogi",
              price: "NGN380,000/year",
              rating: 4.2,
              reviews: 12,
              beds: 3,
              baths: 3,
              sqft: 3500,
              id: "NGN380,000/year",
              image: "/Estate2.png",
              tag: "Rent"
            },
            {
              title: "No 3. modern apartment",
              location: "Okene, Kogi",
              price: "NGN520,000/year",
              rating: 4.7,
              reviews: 15,
              beds: 5,
              baths: 4,
              sqft: 4500,
              id: "NGN520,000/year",
              image: "/Estate2.png",
              tag: null
            }
          ].map((home, index) => (
            <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <Image
                  src={home.image}
                  alt={home.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {home.tag && (
                  <div className="absolute top-2 left-2 bg-[#C85212] text-white px-2 py-1 rounded text-xs font-medium">
                    {home.tag}
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm">
                  <Bookmark className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{home.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{home.location}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{home.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-600">{home.rating} ({home.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>{home.beds} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    <span>{home.baths} baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    <span>{home.sqft} sqft</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{home.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;




