"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Star, Share2, Flag, Home, Bookmark, MapPin, Bed, Bath } from "lucide-react";
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

  const handleWriteReview = () => {
    const fullAddress = getFullAddress();
    router.push(
      `/write-reviews/listed?address=${encodeURIComponent(fullAddress)}&propertyId=${id}`
    );
  };



  return (
    <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-xs mb-12">
      {/* Full Address and Action Buttons at the Top */}
      <div className="mb-8 flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {getFullAddress()}
        </h1>
        <div className="flex gap-2">
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 border">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 border">
            <Flag className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#A64310]">
            Swap
          </button>
        </div>
      </div>

      {/* Main Image and Thumbnails */}
      <div className="mb-8">
        <div className="mb-4">
          <Image
            src={getPropertyImage()}
            alt={getPropertyTitle()}
            width={1200}
            height={600}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          <Image
            src="/Estate2.png"
            alt="Interior 1"
            width={200}
            height={120}
            className="w-20 h-16 object-cover rounded-lg"
          />
          <Image
            src="/Estate2.png"
            alt="Interior 2"
            width={200}
            height={120}
            className="w-20 h-16 object-cover rounded-lg"
          />
          <Image
            src="/Estate2.png"
            alt="Interior 3"
            width={200}
            height={120}
            className="w-20 h-16 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Description & Amenities */}
        <div className="lg:col-span-2">
          {/* Property Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.propertyDetails?.description || 
                "This beautiful property offers 1440 sqft of living space with 3 bedrooms and 2 bathrooms. Features include a fully equipped kitchen, private balcony, swimming pool, and solar roof panels. Located near the golf club for easy access to recreational activities."}
            </p>
          </div>

          {/* Building Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Building Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Community Rooms</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Clubhouse</li>
                  <li>• Business Center</li>
                  <li>• Conference Room</li>
                  <li>• Fitness Center</li>
                  <li>• Library</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Outdoor</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Shared laundry</li>
                  <li>• Swimming Pool</li>
                  <li>• Grand View</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Security</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Gated Entry</li>
                  <li>• Night Patrol</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Services & More</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• On-Site Management</li>
                  <li>• Professional Cleaning</li>
                  <li>• Pet Friendly</li>
                  <li>• Parking</li>
                  <li>• Recycling</li>
                  <li>• Smart Home Tech</li>
                  <li>• Walk-in Closets</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Icons */}
          <div className="flex gap-4 mb-8">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Bookmark className="w-5 h-5" />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Flag className="w-5 h-5" />
              <span className="text-sm">Report</span>
            </button>
          </div>

          {/* Agent Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
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
                        className={`w-4 h-4 ${
                          i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.5 (4 reviews)</span>
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
                  Write an Agent
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {[
                {
                  name: "Alex Thompson",
                  date: "2 days ago",
                  rating: 5,
                  review: "Great place, very clean and the host was super helpful. Would definitely recommend!"
                },
                {
                  name: "Jennifer Smith",
                  date: "1 week ago",
                  rating: 5,
                  review: "Perfect location and amenities. Responsive host. I hope to stay again soon!"
                },
                {
                  name: "Emily Clark",
                  date: "2 weeks ago",
                  rating: 5,
                  review: "Excellent property with all the amenities we needed. Highly recommended!"
                },
                {
                  name: "Michael Smith",
                  date: "3 weeks ago",
                  rating: 5,
                  review: "Beautiful property in a great location. The host was very accommodating."
                }
              ].map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
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

        {/* Right Column - Map and Property Insights */}
        <div className="space-y-6">
          {/* Map */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="relative">
              <Image
                src="/Map.png"
                alt="Map"
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg border"
              />
              <div className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>

          {/* Property Insights */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Insights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Market Value Analysis</h3>
                <p className="text-sm text-gray-600">This property is in the second 25% below market average for its area.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Investment Potential</h3>
                <p className="text-sm text-gray-600">Projected rental income exceeds local averages by 15%.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Location Advantages</h3>
                <p className="text-sm text-gray-600">Proximity to public transport and major amenities (markets, schools).</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Property Condition</h3>
                <p className="text-sm text-gray-600">Recent renovations have improved overall property value and appeal.</p>
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
              price: "$2,000,000",
              rating: 4.5,
              reviews: 8,
              beds: 4,
              baths: 4,
              sqft: 4000,
              id: "NGA450,000/year",
              image: "/Estate2.png",
              tag: "New"
            },
            {
              title: "No 2. luxury stylish home",
              location: "Okene, Kogi",
              price: "$1,800,000",
              rating: 4.2,
              reviews: 12,
              beds: 3,
              baths: 3,
              sqft: 3500,
              id: "NGA380,000/year",
              image: "/Estate2.png",
              tag: "Rent"
            },
            {
              title: "No 3. modern apartment",
              location: "Okene, Kogi",
              price: "$2,200,000",
              rating: 4.7,
              reviews: 15,
              beds: 5,
              baths: 4,
              sqft: 4500,
              id: "NGA520,000/year",
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
