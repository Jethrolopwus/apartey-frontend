
"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Buttons/ActionButton";
import { useRouter } from "next/navigation";
import { Star, Bed, Bath, Ruler, KeyRound } from "lucide-react";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useGetAllMyListingsQuery } from "@/Hooks/use-getAllMyListings.query";
import Link from "next/link";

interface Agent {
  name: string;
  location: string;
  agency: string;
  code: string;
  verified: boolean;
  premium: boolean;
  profileImage: string;
  coverImage: string;
  description: string;
  stats?: Stat[]; 
}

interface Stat {
  label: string;
  value: string;
}

const AgentProfile: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6; 

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserProfileQuery();

  const {
    data: listingsData,
    isLoading: listingsLoading,
    error: listingsError,
  } = useGetAllMyListingsQuery({
    limit: itemsPerPage,
    page: currentPage,
  });

  
  const agent: Agent = useMemo(() => {
    const currentUser = userData?.currentUser;
    return {
      name: currentUser?.name || "Sarah Abba",
      location: currentUser?.location || "Abuja, Nigeria",
      agency: currentUser?.agency || "Imperial Property Agency",
      code: currentUser?.code || "600APK",
      verified: currentUser?.verified ?? true,
      premium: currentUser?.premium ?? true,
      profileImage: currentUser?.profileImage || "/Ellipse-1.png",
      coverImage: currentUser?.coverImage || "/cover-image.png",
      description:
        currentUser?.description ||
        "With over 8 years of experience in real estate development and property management, I specialize in residential and commercial properties across New York. My expertise includes property development, investment consulting, and helping clients find their perfect home or investment opportunity. I pride myself on delivering exceptional service and building lasting relationships with my clients.",
      stats: currentUser?.stats || [
        { label: "Work Experience", value: "3 years" },
        { label: "Active Listings", value: "26" },
        { label: "Properties sold", value: "12" },
        { label: "Clients Rating", value: "4.9" },
      ],
    };
  }, [userData]);

 
  const properties = useMemo(() => {
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
        imageUrl: property?.media?.coverPhoto || "/Estate2.png",
        title: getTitle(),
        location: getLocation(),
        price: newPrice,
        category: property.category || "Rent",
        bedrooms: property?.propertyDetails?.bedrooms,
        bathrooms: property?.propertyDetails?.bathrooms,
        totalAreaSqM: property?.propertyDetails?.totalAreaSqM,
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
      };
    });
  }, [listingsData]);

  const [propertyStates, setPropertyStates] = React.useState<
    { id: string; isRented: boolean }[]
  >([]);

  
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

 
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (listingsData && currentPage < listingsData.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (userLoading || listingsLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (userError) {
    console.error("User Error:", userError);
    return (
      <div className="p-8 text-center text-red-500">
        Error loading profile.
      </div>
    );
  }

  // Handle listings error gracefully - 404 means no properties, not a fatal error
  if (listingsError) {
    console.error("Listings Error:", listingsError);
    console.log("Listings Data:", listingsData);
    console.log("Properties array:", properties);
    // Don't return error - continue to show profile with empty properties section
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col pb-6 items-center w-full">
    
      <div className="w-full h-[220px] md:h-[260px] relative">
        <Image
          src={agent.coverImage || "/cover-image.png"}
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
              src={agent.profileImage || "/Ellipse-1.png"}
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
                {agent.verified && (
                  <span className="bg-[#E6F7EC] text-[#1BA97B] text-xs font-semibold px-2 py-1 rounded">
                    Verified
                  </span>
                )}
                {agent.premium && (
                  <span className="bg-[#E6EFFF] text-[#3B82F6] text-xs font-semibold px-2 py-1 rounded">
                    Premium Agent
                  </span>
                )}
              </div>
              <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {agent.name}
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
              <span>{agent.location}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
              <span className="font-semibold text-gray-700">
                {agent.agency}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>

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
              {agent.description}
            </p>
            <div className="flex flex-wrap gap-8 mt-4">
              {(agent.stats || []).map((stat, idx: number) => (
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
          <h2 className="text-xl font-bold text-gray-900">Properties</h2>
          <Link href="/property-listings" className="inline-block">
            <Button
              variant="primary"
              className="px-6 py-2 text-sm font-semibold"
            >
              + Add property
            </Button>
          </Link>
        </div>

        {/* Tabs - Only show when there are properties */}
        {properties.length > 0 && (
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-[#111827] border border-[#111827]">
              For rent ({properties.length})
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              For sale (0)
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {properties.length > 0 ? (
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
                      src={property.imageUrl}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-full"
                    />
                    <span
                      className={`absolute top-3 left-3 ${
                        isRented ? "bg-teal-600" : "bg-gray-400"
                      } text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}
                    >
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
                    {/* Toggle and status row */}
                    <div className="mt-4">
                      <hr className="mb-3 border-gray-200" />
                      <div className="mt-2 mb-4">
                        <Button
                          variant="primary"
                          className="w-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded"
                          onClick={() =>
                            router.push(
                              `/claim-property/${property.id}`
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
        ) : (
          /* Empty State - No Properties */
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">No properties yet</p>
              <p className="text-sm">Start by adding your first property listing</p>
            </div>
            <Link href="/property-listings">
              <Button variant="primary" className="px-6 py-2 bg-[#C85212] hover:bg-orange-700">
                Add Your First Property
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination - Only show when there are properties */}
        {properties.length > 0 && listingsData && (
          <div className="flex items-center justify-between mt-8 px-4">
            <div className="text-sm text-gray-700">
              Showing page {listingsData.page} of {listingsData.pages} 
              ({listingsData.total} total properties)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              {/* Always show Page 1 */}
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 1 
                    ? "bg-[#C85212] text-white border border-[#C85212]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                1
              </button>
              
              {/* Show additional pages only when there are multiple pages */}
              {listingsData.pages > 1 && Array.from({ length: listingsData.pages - 1 }, (_, i) => i + 2).map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === number 
                      ? "bg-[#C85212] text-white border border-[#C85212]" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={handleNextPage}
                disabled={listingsData.pages <= 1 || currentPage >= listingsData.pages}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfile;