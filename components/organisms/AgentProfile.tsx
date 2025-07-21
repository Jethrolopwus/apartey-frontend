"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Buttons/ActionButton";
import { useRouter } from "next/navigation";
import { Star, Bed, Bath, Ruler } from "lucide-react";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";

const DEFAULT_PROFILE_IMAGE = "/Ellipse-1.png";
const DEFAULT_COVER_IMAGE = "/cover-image.png";
const DEFAULT_PROPERTY_IMAGE = "/Estate2.png";

const AgentProfile: React.FC = () => {
  const router = useRouter();
  const { data: userData, isLoading: userLoading, error: userError } = useGetUserProfileQuery();
  const { data: listingsData, isLoading: listingsLoading, error: listingsError } = useGetAllMyListingsQuery();

  // Extract agent info from userData
  const agent = userData?.currentUser || {
    name: "Sarah Abba",
    location: "Abuja, Nigeria",
    agency: "Imperial Property Agency",
    code: "600APK",
    verified: true,
    premium: true,
    profileImage: DEFAULT_PROFILE_IMAGE,
    coverImage: DEFAULT_COVER_IMAGE,
    description:
      "With over 8 years of experience in real estate development and property management, I specialize in residential and commercial properties across New York. My expertise includes property development, investment consulting, and helping clients find their perfect home or investment opportunity. I pride myself on delivering exceptional service and building lasting relationships with my clients.",
    stats: [
      { label: "Work Experience", value: "3 years" },
      { label: "Active Listings", value: "26" },
      { label: "Properties sold", value: "12" },
      { label: "Clients Rating", value: "4.9" },
    ],
  };

  // Map backend properties to UI format
  interface Property {
    id: string;
    image: string;
    title: string;
    location: string;
    rating: number;
    reviewCount: number;
    beds: number;
    baths: number;
    size: number;
    oldPrice: string;
    newPrice: string;
    status: string;
    mark: string;
    isActive: boolean;
  }

  interface Stat {
    label: string;
    value: string;
  }

  type RawProperty = {
    _id: string;
    media?: { coverPhoto?: string };
    location?: { streetAddress?: string; city?: string; country?: string };
    propertyDetails?: {
      rating?: number;
      reviewCount?: number;
      bedrooms?: number;
      bathrooms?: number;
      totalAreaSqM?: number;
      oldPrice?: string;
      price?: string | number;
    };
    status?: string;
  };

  const properties: Property[] = useMemo(() => {
    if (listingsData?.properties?.length) {
      return listingsData.properties.map((property: RawProperty) => ({
        id: property._id,
        image: property.media?.coverPhoto || DEFAULT_PROPERTY_IMAGE,
        title: property.location?.streetAddress || "No address",
        location: `${property.location?.city || ""}, ${property.location?.country || ""}`,
        rating: property.propertyDetails?.rating || 4.0,
        reviewCount: property.propertyDetails?.reviewCount || 0,
        beds: property.propertyDetails?.bedrooms || 0,
        baths: property.propertyDetails?.bathrooms || 0,
        size: property.propertyDetails?.totalAreaSqM || 0,
        oldPrice: property.propertyDetails?.oldPrice || "NGN650,000/Year",
        newPrice: property.propertyDetails?.price ? `NGN${property.propertyDetails.price}/Year` : "NGN450,000/Year",
        status: property.status === "active" ? "Active" : "Inactive",
        mark: property.status === "rented" ? "Rented" : "Available",
        isActive: property.status === "active",
      }));
    }
    return [
      {
        id: "1",
        image: DEFAULT_PROPERTY_IMAGE,
        title: "No 1. kumuye strt...",
        location: "Abuja, Nigeria",
        rating: 4.0,
        reviewCount: 28,
        beds: 4,
        baths: 4,
        size: 44,
        oldPrice: "NGN650,000/Year",
        newPrice: "NGN450,000/Year",
        status: "Active",
        mark: "Rented",
        isActive: true,
      },
    ];
  }, [listingsData]);

  const [propertyStates, setPropertyStates] = React.useState<{ id: string; isRented: boolean }[]>(
    properties.map((p) => ({ id: p.id, isRented: p.isActive }))
  );

  React.useEffect(() => {
    setPropertyStates(properties.map((p) => ({ id: p.id, isRented: p.isActive })));
  }, [properties]);

  const handleToggle = (id: string) => {
    setPropertyStates((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isRented: !p.isRented } : p
      )
    );
  };

  if (userLoading || listingsLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (userError || listingsError) {
    return <div className="p-8 text-center text-red-500">Error loading profile or listings.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col pb-6 items-center w-full">
      {/* Cover Image */}
      <div className="w-full h-[220px] md:h-[260px] relative">
        <Image
          src={agent.coverImage || DEFAULT_COVER_IMAGE}
          alt="cover"
          fill
          className="object-cover w-full h-full rounded-b-2xl"
          priority
        />
      </div>
      {/* Profile Card */}
      <div className="w-full max-w-4xl relative -mt-20 z-10">
        <div className="bg-white rounded-2xl shadow-lg px-6 py-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative w-32 h-32 border-4 border-white rounded-full overflow-hidden -mt-16 md:mt-0 shadow-md">
            <Image
              src={agent.profileImage || DEFAULT_PROFILE_IMAGE}
              alt="profile"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col gap-2 md:gap-3 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
              <div className="flex items-center gap-2">
                {agent.verified && (
                  <span className="bg-[#E6F7EC] text-[#1BA97B] text-xs font-semibold px-2 py-1 rounded">Verified</span>
                )}
                {agent.premium && (
                  <span className="bg-[#E6EFFF] text-[#3B82F6] text-xs font-semibold px-2 py-1 rounded">Premium Agent</span>
                )}
              </div>
              <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl font-bold text-gray-900">{agent.name}</span>
                <Button
                  variant="secondary"
                  className="px-6 py-2 text-sm font-semibold ml-4"
                  onClick={() => router.push("/edit-profile")}
                >
                  Edit profile
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
              <span>{agent.location}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
              <span className="font-semibold text-gray-700">{agent.agency}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
              <span>{agent.code}</span>
            </div>
            <p className="text-gray-700 text-sm mt-2 max-w-2xl">{agent.description}</p>
            <div className="flex flex-wrap gap-8 mt-4">
              {agent.stats && (agent.stats as Stat[]).map((stat, idx: number) => (
                <div key={idx} className="flex flex-col items-center min-w-[90px]">
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Properties Section */}
      <div className="w-full max-w-5xl mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Properties</h2>
          <Button variant="primary" className="px-6 py-2 text-sm font-semibold">+ Add property</Button>
        </div>
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-teal-50 text-teal-700 border border-teal-600">For rent ({properties.length})</button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">For sale (0)</button>
        </div>
        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const state = propertyStates.find((p) => p.id === property.id);
            const isRented = state ? state.isRented : property.isActive;
            return (
              <div key={property.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative w-full h-40">
                  <Image
                    src={property.image || DEFAULT_PROPERTY_IMAGE}
                    alt={property.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <span className={`absolute top-3 left-3 ${isRented ? "bg-teal-600" : "bg-gray-400"} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}>
                    Rent
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 text-base truncate mb-1" title={property.title}>{property.title}</h3>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-500 truncate mr-2">{property.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <div className="flex gap-0.5 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.floor(property.rating) ? "fill-yellow-500" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{property.rating?.toFixed(1)} ({property.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-xs gap-4 mb-1">
                      <span className="flex items-center gap-1" title={`${property.beds} bedrooms`}><Bed size={14} /> {property.beds}</span>
                      <span className="flex items-center gap-1" title={`${property.baths} bathrooms`}><Bath size={14} /> {property.baths}</span>
                      <span className="flex items-center gap-1" title={`${property.size}m² area`}><Ruler size={14} /> {property.size}m²</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">{property.oldPrice}</span>
                      <span className="text-gray-800 font-semibold">{property.newPrice}</span>
                    </div>
                  </div>
                  {/* Toggle and status row */}
                  <div className="mt-4">
                    <hr className="mb-3 border-gray-200" />
                    <div className="flex items-center justify-between">
                      {/* Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(property.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isRented ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isRented ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Mark as Rented</span>
                      </div>
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isRented ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{isRented ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile; 