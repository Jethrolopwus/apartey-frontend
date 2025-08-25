"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Buttons/ActionButton";
import { useRouter } from "next/navigation";
import { Star, Bed, Bath, Ruler } from "lucide-react";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";
import Link from "next/link";

const DEFAULT_PROFILE_IMAGE = "/Ellipse-1.png";
const DEFAULT_COVER_IMAGE = "/cover-image.png";
const DEFAULT_PROPERTY_IMAGE = "/Estate2.png";

// Define proper TypeScript interfaces
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
  category?: string;
}

interface Stat {
  label: string;
  value: string;
}

interface PropertyLocation {
  streetAddress?: string;
  city?: string;
  country?: string;
  state?: string;
  area?: string;
  address?: string;
  fullAddress?: string;
  street?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
}

interface PropertyDetails {
  rating?: number;
  reviewCount?: number;
  bedrooms?: number;
  bathrooms?: number;
  totalAreaSqM?: number;
  oldPrice?: string;
  price?: string | number;
}

interface PropertyMedia {
  coverPhoto?: string;
  images?: string[];
  photos?: string[];
}

interface RawProperty {
  _id: string;
  id?: string;
  media?: PropertyMedia;
  location?: PropertyLocation;
  propertyDetails?: PropertyDetails;
  status?: string;
  title?: string;
  name?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  propertyType?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Homeowner {
  name: string;
  location: string;
  description: string;
  profileImage: string;
  coverImage: string;
  stats?: Stat[];
}

const HomeownerProfile: React.FC = () => {
  const router = useRouter();
  
  // User role is available but not currently used in this component
  
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserProfileQuery();
  const {
    data: listingsData,
    isLoading: listingsLoading,
    error: listingsError,
    refetch: refetchListings,
  } = useGetAllMyListingsQuery();

  // Refetch listings when component mounts or when returning from property creation
  React.useEffect(() => {
    // Refetch listings when component mounts to ensure fresh data
    refetchListings();
    
    // Also refetch when user returns to the page (e.g., after creating a property)
    const handleFocus = () => {
      refetchListings();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetchListings]);

  // Extract homeowner info from userData
  const homeowner: Homeowner = useMemo(() => {
    const currentUser = userData?.currentUser;

    return {
      name: currentUser?.name || "Homeowner",
      location: currentUser?.location || "Your Location",
      description:
        currentUser?.description ||
        "Welcome to your homeowner profile. Here you can manage your properties and view your listings.",
      profileImage: currentUser?.profileImage || DEFAULT_PROFILE_IMAGE,
      coverImage: currentUser?.coverImage || DEFAULT_COVER_IMAGE,
      stats: currentUser?.stats || [
        { label: "Total Properties", value: "0" },
        { label: "Active Listings", value: "0" },
        { label: "Properties Rented", value: "0" },
        { label: "Total Views", value: "0" },
      ],
    };
  }, [userData]);

  // Map backend properties to UI format
  const properties: Property[] = useMemo(() => {
    if (listingsData?.properties?.length) {
      return listingsData.properties.map((property: RawProperty) => {
        // Try multiple ways to get the title/address
        const getTitle = (): string => {
          if (property.title) return property.title;
          if (property.name) return property.name;
          if (property.location?.fullAddress)
            return property.location.fullAddress;
          if (property.location?.streetAddress)
            return property.location.streetAddress;
          if (property.location?.address) return property.location.address;
          if (property.location?.street) return property.location.street;
          if (property.address) return property.address;

          if (property.location?.country) {
            return `Property in ${property.location.country}`;
          }

          return "Property Address Not Available";
        };

        // Try multiple ways to get the location
        const getLocation = (): string => {
          const parts: string[] = [];

          if (property.location?.city) parts.push(property.location.city);
          else if (property.city) parts.push(property.city);

          if (property.location?.state) parts.push(property.location.state);
          else if (property.state) parts.push(property.state);

          if (property.location?.country) parts.push(property.location.country);
          else if (property.country) parts.push(property.country);

          if (parts.length === 0) {
            if (property.location?.locality)
              parts.push(property.location.locality);
            if (property.location?.region) parts.push(property.location.region);
            if (property.location?.area) parts.push(property.location.area);
          }

          if (parts.length === 0 && property.location?.country) {
            parts.push(property.location.country);
          }

          return parts.length > 0 ? parts.join(", ") : "Location Not Available";
        };

        const mappedProperty: Property = {
          id: property._id || property.id || `property-${Date.now()}`,
          image:
            property.media?.coverPhoto ||
            property.media?.images?.[0] ||
            property.media?.photos?.[0] ||
            DEFAULT_PROPERTY_IMAGE,
          title: getTitle(),
          location: getLocation(),
          rating: property.propertyDetails?.rating || 4.0,
          reviewCount: property.propertyDetails?.reviewCount || 0,
          beds: property.propertyDetails?.bedrooms || 0,
          baths: property.propertyDetails?.bathrooms || 0,
          size: property.propertyDetails?.totalAreaSqM || 0,
          oldPrice: property.propertyDetails?.oldPrice || "NGN650,000/Year",
          newPrice: property.propertyDetails?.price
            ? `NGN${property.propertyDetails.price}/Year`
            : "NGN450,000/Year",
          status: property.status === "active" ? "Active" : "Inactive",
          mark: property.status === "rented" ? "Rented" : "Available",
          isActive: property.status === "active",
          category: property.category || "Rent",
        };

        return mappedProperty;
      });
    }

    return [];
  }, [listingsData]);

  const [propertyStates, setPropertyStates] = React.useState<
    { id: string; isRented: boolean }[]
  >([]);

  // Initialize property states when properties change
  React.useEffect(() => {
    setPropertyStates(
      properties.map((p) => ({ id: p.id, isRented: p.isActive }))
    );
  }, [properties]);

  const handleToggle = (id: string): void => {
    setPropertyStates((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isRented: !p.isRented } : p))
    );
  };

  if (userLoading || listingsLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (userError || listingsError) {
    console.error("User Error:", userError);
    console.error("Listings Error:", listingsError);
    return (
      <div className="p-8 text-center text-red-500">
        Error loading profile or listings.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col pb-6 items-center w-full">
      {/* Cover Image */}
      <div className="w-full h-[220px] md:h-[260px] relative">
        <Image
          src={homeowner.coverImage || DEFAULT_COVER_IMAGE}
          alt="cover"
          fill
          sizes="100vw"
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
              src={homeowner.profileImage || DEFAULT_PROFILE_IMAGE}
              alt="profile"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2 md:gap-3 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#E6F7EC] text-[#1BA97B] text-xs font-semibold px-2 py-1 rounded">
                  Homeowner
                </span>
              </div>
              <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {homeowner.name}
                </span>
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
              <span>{homeowner.location}</span>
            </div>

            <p className="text-gray-700 text-sm mt-2 max-w-2xl">
              {homeowner.description}
            </p>

            <div className="flex flex-wrap gap-8 mt-4">
              {(homeowner.stats || []).map((stat, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[90px]"
                >
                  <span className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </span>
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
          <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold"
              onClick={() => refetchListings()}
              disabled={listingsLoading}
            >
              {listingsLoading ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/property-listings" className="inline-block">
              <Button
                variant="primary"
                className="px-6 py-2 text-sm font-semibold"
              >
                + Add property
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-teal-50 text-teal-700 border border-teal-600">
            All Properties ({properties.length})
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Active ({properties.filter(p => p.isActive).length})
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => {
            const state = propertyStates.find((p) => p.id === property.id);
            const isRented = state ? state.isRented : property.isActive;

            return (
              <div
                key={`${property.id}-${index}`}
                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    priority={index === 0}
                  />
                  <span
                    className={`absolute top-3 left-3 ${
                      isRented ? "bg-teal-600" : "bg-gray-400"
                    } text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}
                  >
                    {property.category || "Rent"}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-medium text-gray-800 text-base truncate mb-1"
                      title={property.title}
                    >
                      {property.title}
                    </h3>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-500 truncate mr-2">
                        {property.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <div className="flex gap-0.5 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(property.rating)
                                ? "fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {property.rating.toFixed(1)} ({property.reviewCount}{" "}
                        reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700 text-xs gap-4 mb-1">
                      <span
                        className="flex items-center gap-1"
                        title={`${property.beds} bedrooms`}
                      >
                        <Bed size={14} /> {property.beds}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        title={`${property.baths} bathrooms`}
                      >
                        <Bath size={14} /> {property.baths}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        title={`${property.size}m² area`}
                      >
                        <Ruler size={14} /> {property.size}m²
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="line-through">{property.oldPrice}</span>
                      <span className="text-gray-800 font-semibold">
                        {property.newPrice}
                      </span>
                    </div>
                  </div>

                  {/* Claim Property Button */}
                  <div className="mt-4">
                    <hr className="mb-3 border-gray-200" />
                    <div className="mt-2 mb-4">
                      <Button
                        variant="primary"
                        className="w-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded"
                        onClick={() =>
                          router.push(
                            `/claim-property?propertyId=${property.id}`
                          )
                        }
                      >
                        Claim Property
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(property.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            isRented ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              isRented ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          Mark as Rented
                        </span>
                      </div>

                      {/* Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isRented
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isRented ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">No properties yet</p>
              <p className="text-sm">Start by adding your first property listing</p>
            </div>
            <Link href="/property-listings">
              <Button variant="primary" className="px-6 py-2">
                Add Your First Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeownerProfile; 