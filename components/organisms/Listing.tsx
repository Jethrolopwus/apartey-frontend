"use client";
import React, { useState, useEffect } from "react";
import { Star, MapPin, Plus, Heart, Bed, Bath, SquareDot } from "lucide-react";
import ContactOwnerModal from "@/components/molecules/ContactOwnerModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetAllListingsQuery } from "@/Hooks/use-getAllListings.query";
import { useGetUserRoleQuery } from "@/Hooks/use-getUserRole.query";
import { useLocation } from "@/app/userLocationContext";
import Image from "next/image";
import { Property, PropertyCategory } from "@/types/generated";
import { useUpdatePropertyToggleLikeMutation } from "@/Hooks/use.propertyLikeToggle.mutation";
import { toast } from "react-hot-toast";

const Listings = () => {
  const searchParams = useSearchParams();
  const { selectedCountryCode } = useLocation();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState<string | undefined>(undefined);
  const [messageSent, setMessageSent] = useState(false);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(500000);
  const limit = 6;

  const categoryParam = searchParams.get("category");
  const countryParam = searchParams.get("country");
  const propertyTypeParam = searchParams.get("propertyType");
  const petPolicyParam = searchParams.get("petPolicy");
  const conditionParam = searchParams.get("condition");

  // Convert country code to full country name for listings API
  const getCountryName = (countryCode: string) => {
    switch (countryCode) {
      case "NG":
        return "Nigeria";
      case "EE":
        return "Estonia";
      default:
        return "Nigeria"; // Default fallback
    }
  };

  const category: PropertyCategory = ["Swap", "Rent", "Buy"].includes(categoryParam ?? "")
    ? (categoryParam as PropertyCategory)
    : categoryParam === "Sale" ? "Buy" : "Swap";
  
  // Use location context country if no URL country param, otherwise use URL param
  const country: string = countryParam ?? getCountryName(selectedCountryCode);

  // Debug log to show location-based filtering

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Fetch user role to determine if "List your Home" button should be shown
  const { data: userRoleData, isLoading: isUserRoleLoading } = useGetUserRoleQuery();

  const { data, isLoading, error } = useGetAllListingsQuery({
    category,
    country,
    limit,
    page: currentPage,
    propertyType: propertyTypeParam || undefined,
    petPolicy: petPolicyParam || undefined,
    condition: conditionParam || undefined,
  });

  const { toggleLike, isLoading: isToggleLoading } = useUpdatePropertyToggleLikeMutation();

  // Check if user can list properties (homeowner or agent)
  // The API returns role under currentUserRole.role
  const userRole = userRoleData?.currentUserRole?.role;
  const canListProperties = userRole && (
    userRole.toLowerCase() === "homeowner" || 
    userRole.toLowerCase() === "agent"
  );

  useEffect(() => {
    setShowDisclaimer(category === "Swap");
  }, [category, country]);

  const handleUnderstand = () => {
    setShowDisclaimer(false);
  };

  const handleContactOwner = (propertyName: string) => {
    setContactProperty(propertyName);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setContactModalOpen(false);
    setContactProperty(undefined);
  };

  const handleSendMessage = () => {
    setContactModalOpen(false);
    setContactProperty(undefined);
    setMessageSent(true);
  };

  const toggleLikeProperty = (propertyId: string) => {
    if (!propertyId) {
      return;
    }

    setLikedProperties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });

    toggleLike(propertyId, {
      onSuccess: (response: { data?: { isLiked?: boolean }; message?: string }) => {
        const isLiked = response.data?.isLiked ?? likedProperties.has(propertyId);
        
        setLikedProperties((prev) => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(propertyId);
          } else {
            newSet.delete(propertyId);
          }
          return newSet;
        });
        toast.success(response?.message || `Property ${isLiked ? "liked" : "unliked"} successfully!`);
      },
      onError: (error: { message?: string }) => {
        // Revert the optimistic update
        setLikedProperties((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(propertyId)) {
            newSet.delete(propertyId);
          } else {
            newSet.add(propertyId);
          }
          return newSet;
        });
        toast.error(error?.message || "Failed to toggle like.");
      },
    });
  };

  const getPropertyTitle = (property: Property) => {
    return property?.location?.fullAddress || property.propertyType || "Untitled Property";
  };

  const getPropertyLocation = (property: Property) => {
    const { city, stateOrRegion, country } = property.location || {};
    return [city, stateOrRegion, country].filter(Boolean).join(", ");
  };



  const getPropertyImage = (property: Property) => {
    return property.media?.coverPhoto || "/fallback-image.jpg";
  };

  const getPropertySlug = (property: Property) => {
    return property._id ? `/listings/${category.toLowerCase()}/${property._id}` : "#";
  };

  const getPropertyRating = (property: Property) => {
    return {
      rating: property.rating || 0,
      reviewCount: property.reviewCount || 0,
    };
  };

  const getPageTitle = () => {
    switch (category) {
      case "Rent":
        return "Home Rentals";
      case "Buy":
        return "Homes for Sale";
      case "Swap":
      default:
        return "Home Swap";
    }
  };

  const getPageDescription = () => {
    switch (category) {
      case "Rent":
        return "Find your perfect rental home and experience new destinations.";
      case "Buy":
        return "Discover properties for sale to find your dream home.";
      case "Swap":
      default:
        return (
          <>
            Exchange homes with others and experience
            <br />
            new destinations like a local
          </>
        );
    }
  };

  const getAvailableText = () => {
    switch (category) {
      case "Rent":
        return "Available Home for Rent";
      case "Buy":
        return "Available Home for Sale";
      case "Swap":
      default:
        return "Available Home Swap";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    // Debug: Log the pagination data
    console.log("Pagination data:", {
      pages: data?.pages,
      currentPage: data?.page,
      total: data?.total,
      hasNextPage: data?.hasNextPage,
      hasPreviousPage: data?.hasPreviousPage,
      propertiesCount: data?.properties?.length
    });

    // Always show pagination, but with different logic:
    // - Show Page 1 by default
    // - Show Page 2+ only when there are more properties than the limit
    const totalPages = data?.pages || 1;
    const hasMultiplePages = totalPages > 1;
    
    console.log("Pagination logic:", {
      totalPages,
      hasMultiplePages,
      currentPage,
      limit
    });

    return (
      <div className="flex justify-center items-center space-x-3 mt-14 lg:mt-32">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">←</span>
          Previous
        </button>
        
        {/* Always show Page 1, show additional pages only when there are multiple pages */}
        <button
          onClick={() => handlePageChange(1)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1 
              ? "bg-[#C85212] text-white border border-[#C85212]" 
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          1
        </button>
        
        {/* Show additional pages only when there are multiple pages */}
        {hasMultiplePages && Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
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
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasMultiplePages || currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <span className="text-lg">→</span>
        </button>
      </div>
    );
  };

  const renderPropertyCard = (property: Property, index: number) => {
    const { rating, reviewCount } = getPropertyRating(property);
    
                      // Ensure property has a valid ID for like functionality
                  const propertyId = property._id;
    
    const isLiked = propertyId ? likedProperties.has(propertyId) : false;
    
    // Create a unique key that combines ID and index to handle duplicate IDs
    const uniqueKey = propertyId ? `${propertyId}-${index}` : `property-${index}`;
    
    return (
      <div
        key={uniqueKey}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Link href={getPropertySlug(property)} className="block group">
            <Image
              src={getPropertyImage(property)}
              alt={getPropertyTitle(property)}
              width={600}
              height={270}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
              priority={false}
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.jpg";
              }}
            />
          </Link>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{getPropertyTitle(property)}</h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {getPropertyLocation(property)}
            </span>
            {propertyId && (
              <Heart
                className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"} ${
                  isToggleLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                                                  if (!isToggleLoading) {
                                  toggleLikeProperty(propertyId);
                                }
                }}
              />
            )}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">{rating} ({reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
            {property.propertyDetails?.bedrooms && (
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.propertyDetails.bedrooms} Beds
              </span>
            )}
            {property.propertyDetails?.bathrooms && (
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.propertyDetails.bathrooms} Baths
              </span>
            )}
            {property.propertyDetails?.totalAreaSqM && (
              <span className="flex items-center">
                <SquareDot className="w-4 h-4 mr-1" />
                {property.propertyDetails.totalAreaSqM} m²
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="inline-block bg-[#12B34759] text-white text-xs font-medium px-2 py-1 rounded">
              Available
            </span>
            <button
              className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm hover:bg-[#A64310] transition-colors"
              onClick={() => handleContactOwner(getPropertyTitle(property))}
            >
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getUniqueProperties = () => {
    if (!data?.properties) return [];
    
    // Remove duplicate properties by ID to prevent rendering issues
    const uniqueProperties = data.properties.filter((property, index, self) => {
      if (!property._id) return false;
      return index === self.findIndex(p => p._id === property._id);
    });
    
    return uniqueProperties;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {messageSent && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-gray-200 shadow-lg rounded-lg px-6 py-4 flex items-start gap-4 max-w-sm">
          <div>
            <div className="font-semibold text-lg text-gray-800 mb-1">Message Sent!</div>
            <div className="text-sm text-gray-600">
              Your message has been sent to the home owner. They will contact you directly.
            </div>
          </div>
          <button
            className="ml-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
            onClick={() => setMessageSent(false)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
      {showDisclaimer && category === "Swap" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={handleUnderstand} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-8 z-10 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Important Disclaimer - {getPageTitle()}</h2>
            <p className="text-xs text-gray-600 mb-4 font-medium">Please read carefully:</p>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Our platform provides a space for users to list and discover potential {category.toLowerCase()} properties.
                However, we do not participate in, facilitate, or validate any {category.toLowerCase()} arrangements. All
                communications, agreements, and transactions regarding {category.toLowerCase()} are strictly between users.
              </p>
              <p>
                We do not collect payments or process bookings for {category.toLowerCase()}, and we do not verify the
                legality of any {category.toLowerCase()} under rental agreements, leases, or local laws. Users are solely
                responsible for ensuring compliance with their lease terms.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleUnderstand}
                className="px-4 py-2 bg-[#C85212] text-white rounded-md hover:bg-[#A64310] text-sm"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 mt-16 md:mt-58 lg:mt-58 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Commercial</option>
                    <option>Room</option>
                    <option>Garage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{ background: "linear-gradient(to right, #C85212 0%, #C85212 50%, #e5e7eb 50%, #e5e7eb 100%)" }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>€0</span>
                    <span>€1000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                    <option>Any</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                    <option>Any</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>

                <div>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1 order-1 lg:order-2">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-teal-800 mb-3">{getPageTitle()}</h1>
              <p className="text-gray-600 mb-6 text-lg">{getPageDescription()}</p>
              
              {/* Only show button if user role is loaded and they can list properties */}
              {!isUserRoleLoading && canListProperties && (
                <Link href="/swap-property-listings">
                  <button className="bg-[#C85212] text-white px-6 py-3 rounded-md hover:bg-[#A64310] transition-colors flex items-center gap-2 mx-auto">
                    <Plus className="w-5 h-5" />
                    List your Home
                  </button>
                </Link>
              )}      
              {/* Show loading state while fetching user role */}
              {isUserRoleLoading && (
                <div className="text-gray-500 text-sm">Loading user permissions...</div>
              )}
            </div>
            <h2 className="text-3xl font-semibold text-teal-800 mb-6">{getAvailableText()}</h2>
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <span className="text-gray-500">Loading properties...</span>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center py-12">
                <span className="text-red-500">Failed to load properties: {error.message}</span>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data?.properties?.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-12">No properties found in {country}.</div>
                )}
                

                
                {getUniqueProperties().map((property: Property, index: number) => {
                  return renderPropertyCard(property, index);
                })}
              </div>
            )}
            {renderPagination()}
          </div>
        </div>
      </main>
      <ContactOwnerModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        propertyName={contactProperty}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default Listings;