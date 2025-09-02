"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Buttons/ActionButton";
import { useRouter } from "next/navigation";
import { Star, Bed, Bath, Ruler, KeyRound } from "lucide-react";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";
import { useGetClaimStatusByIdQuery } from "@/Hooks/use-getClaimStatusById.query";
import Link from "next/link";
import { toast } from "react-hot-toast";

const DEFAULT_PROPERTY_IMAGE = "/Estate2.png";

// Claim Property Button Component
const ClaimPropertyButton: React.FC<{ propertyId: string; onClaim: (id: string) => void }> = ({ propertyId, onClaim }) => {
  const { data: claimStatusData, isLoading: claimStatusLoading } = useGetClaimStatusByIdQuery(propertyId);
  

  
  if (claimStatusLoading) {
    return (
      <button 
        disabled
        className="w-full px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-500 rounded cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  const claimStatus = claimStatusData?.status;
  
  if (claimStatus === "pending") {
    return (
      <button 
        disabled
        className="w-full px-4 py-2 text-sm font-semibold bg-gray-300 text-gray-600 rounded cursor-not-allowed"
      >
        Claim Pending - Waiting for Approval
      </button>
    );
  }
  
  if (claimStatus === "approved") {
    return (
      <button 
        disabled
        className="w-full px-4 py-2 text-sm font-semibold bg-gray-300 text-gray-600 rounded cursor-not-allowed"
      >
        Property Claimed
      </button>
    );
  }
  
  // No claim or other status - show active claim button
  return (
    <button
      onClick={() => onClaim(propertyId)}
      className="w-full px-4 py-2 text-sm font-semibold bg-[#C85212] hover:bg-orange-700 text-white rounded transition-colors"
    >
      Claim Property
    </button>
  );
};

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
  category: string;
}

interface Stat {
  label: string;
  value: string;
}

interface Homeowner {
  name: string;
  location: string;
  verified: boolean;
  premium: boolean;
  profileImage: string;
  coverImage: string;
  description: string;
  stats?: Stat[];
}

const HomeownerProfile: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6; // Limit of 6 as per design
  const totalPages = 10; // Fixed total pages as per design 

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
  } = useGetAllMyListingsQuery({
    limit: itemsPerPage,
    page: currentPage,
  });

 


 
  const homeowner: Homeowner = useMemo(() => {
    const currentUser = userData?.currentUser;
    return {
      name: currentUser?.name || "John Doe",
      location: currentUser?.location || "Abuja, Nigeria",
      verified: currentUser?.verified ?? true,
      premium: currentUser?.premium ?? false,
      profileImage: currentUser?.profileImage || "/Ellipse-1.png",
      coverImage: currentUser?.coverImage || "/cover-image.png",
      description:
        currentUser?.description ||
        "Experienced homeowner with multiple properties across different locations. I focus on providing quality accommodation and maintaining excellent relationships with tenants.",
      stats: currentUser?.stats || [
        { label: "Properties Owned", value: "5" },
        { label: "Active Listings", value: "3" },
        { label: "Tenant Rating", value: "4.8" },
        { label: "Years Experience", value: "8" },
      ],
    };
  }, [userData]);

 
  const properties: Property[] = useMemo(() => {
    return (listingsData?.properties || []).map((property: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const getTitle = () => {
        return property?.propertyDetails?.description || 
               property?.location?.fullAddress || 
               property?.location?.streetAddress || 
               property?.location?.apartment || 
               property?.propertyType || 
               "Untitled Property";
      };

      const getLocation = () => {
        const location = property?.location;
        if (!location) return "Location not specified";
        
        const parts = [
          location.district,
          location.city,
          location.stateOrRegion,
          location.country
        ].filter(Boolean);
        
        return parts.length > 0 ? parts.join(", ") : "Location not specified";
      };

      const getPrice = () => {
        const price = property?.propertyDetails?.price;
        if (!price) return "Price on request";
        
        const currency = price.currency || "NGN";
        const monthly = price.rent?.monthly || 0;
        
        return `${currency}${monthly.toLocaleString()}/month`;
      };

      const newPrice = getPrice();

      return {
        id: property._id || "",
        image: property?.media?.coverPhoto || DEFAULT_PROPERTY_IMAGE,
        title: getTitle(),
        location: getLocation(),
        rating: 4.0,
        reviewCount: 0,
        beds: property?.propertyDetails?.bedrooms || 0,
        baths: property?.propertyDetails?.bathrooms || 0,
        size: property?.propertyDetails?.totalAreaSqM || 0,
        oldPrice: "NGN650,000/Year",
        newPrice: newPrice,
        status: property?.status === "active" ? "Active" : "Inactive",
        mark: property?.status === "rented" ? "Rented" : "Available",
        isActive: property?.status === "active",
        category: property.category || "Rent",
      };
    });
  }, [listingsData]);

  const [propertyStates, setPropertyStates] = React.useState<
    { id: string; isRented: boolean }[]
  >([]);

  //
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

  // Handle claim property button click with status check
  const handleClaimProperty = async (propertyId: string) => {
    try {
      // Check claim status first
      const response = await fetch(`/api/listings/claim/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === "pending") {
          toast.error("This property claim is already pending approval");
          return;
        } else if (data.status === "approved") {
          toast.error("This property has already been claimed and approved");
          return;
        } else {
          // No claim or status is not pending/approved, allow navigation
          router.push(`/claim-property/${propertyId}`);
        }
      } else {
        // If endpoint doesn't exist or fails, allow navigation (fallback)
        router.push(`/claim-property/${propertyId}`);
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
      // If there's an error, allow navigation (fallback)
      router.push(`/claim-property/${propertyId}`);
    }
  };


  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (userLoading || listingsLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

      if (userError || listingsError) {
      console.error("User Error:", userError);
      console.error("Listings Error:", listingsError);
      return (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            Error loading profile or listings.
          </div>
          <button
            onClick={() => {
              refetchListings();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col pb-6 items-center w-full">
    
      <div className="w-full h-[220px] md:h-[260px] relative">
        <Image
          src={homeowner.coverImage || "/cover-image.png"}
          alt="cover"
          fill
          sizes="100vw"
          className="object-cover w-full h-full rounded-b-2xl"
          priority
        />
      </div>

  
      <div className="w-full max-w-4xl relative -mt-20 z-10">
        <div className="bg-white rounded-2xl shadow-lg px-6 py-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        
          <div className="relative w-32 h-32 border-4 border-white rounded-full overflow-hidden -mt-16 md:mt-0 shadow-md">
            <Image
              src={homeowner.profileImage || "/Ellipse-1.png"}
              alt="profile"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 md:gap-3 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#E6F7EC] text-[#1BA97B] text-xs font-semibold px-2 py-1 rounded">
                  Verified ✓
                </span>
              </div>
              <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {homeowner.name}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    className="px-6 py-2 text-sm font-semibold ml-4"
                    onClick={() => router.push("/edit-profile")}
                  >
                    Edit profile
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
              <span>{homeowner.location}</span>
              <span>📍 Imperial Property Agency</span>
                <div className="mt-4 flex items-center space-x-2 sm:mt-0">
                  <div className="flex items-center">
                    <KeyRound className="mr-1 h-5 w-5 text-[#C85212]" />
                    <span className="text-sm font-medium text-gray-900">
                      {userData?.currentUser?.rewards || 0}APK
                    </span>
                  </div>
                </div>
            </div>
            <p className="text-gray-700 text-sm mt-2 max-w-2xl">
              Extensive experience in rentals and a vast database means I can quickly find the options that are right for you. Looking for a seamless and exciting rental experience? Contact me today - I promise it won't be boring! Your perfect home is just a call away.
            </p>
            <div className="flex flex-wrap gap-8 mt-4">
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-lg font-bold text-gray-900">0 years</span>
                <span className="text-xs text-gray-500">Works with Apartey</span>
              </div>
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-lg font-bold text-gray-900">26</span>
                <span className="text-xs text-gray-500">Properties published</span>
              </div>
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-lg font-bold text-gray-900">12</span>
                <span className="text-xs text-gray-500">Properties sold</span>
              </div>
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-lg font-bold text-gray-900">⭐ 4.9</span>
                <span className="text-xs text-gray-500">Apartey overall rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

   
      <div className="w-full max-w-5xl mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Properties</h2>
          <div className="flex items-center gap-3">
          
            <Link href="/property-listings" className="inline-block">
              <Button
                variant="primary"
                className="px-6 py-2 text-sm font-semibold bg-[#C85212] hover:bg-orange-700"
              >
                + Add property
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-[#111827] border border-[#111827]">
            For rent (8)
          </button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            For sale (13)
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
                  <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Rent
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
                  <div className="mt-4">
                    <hr className="mb-3 border-gray-200" />
                    
                    <div className="mb-4">
                      <ClaimPropertyButton 
                        propertyId={property.id}
                        onClaim={handleClaimProperty}
                      />
                    </div>

                    

                    <div className="flex items-center justify-between">
  
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

      
        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">No properties yet</p>
              <p className="text-sm">Start by adding your first property listing</p>
            </div>
            <Link href="/property-listings">
              <Button variant="primary" className="px-6 py-2 bg-orange-600 hover:bg-orange-700">
                Add Your First Property
              </Button>
            </Link>
          </div>
        )}

      
        {/* Pagination */}
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                currentPage > 1
                  ? "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
              }`}
            >
              <span>←</span>
              <span className="ml-1">Previous</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    currentPage === page
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Ellipsis */}
              <span className="px-2 text-gray-500">...</span>
              
              {/* Last few pages */}
              {[8, 9, 10].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    currentPage === page
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                currentPage < totalPages
                  ? "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
              }`}
            >
              <span className="mr-1">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerProfile;