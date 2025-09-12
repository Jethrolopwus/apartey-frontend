
import React, { useState } from 'react';
import { Star, MapPin, Plus, X } from 'lucide-react';
import ContactOwnerModal from '../molecules/ContactOwnerModal';
import Link from 'next/link';
import { useGetAllPropertiesQuery } from "@/Hooks/use-getAllProperties.query";
import Image from 'next/image';
import type { Property } from '@/types/generated';

const HomeSwap = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState<string | undefined>(undefined);
  const [messageSent, setMessageSent] = useState(false);
  const limit = 6;

  // Fetch properties (pagination not supported by API, so only limit is used)
  const { data, isLoading, error } = useGetAllPropertiesQuery({ limit });

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

  // Helper for property title
  const getPropertyTitle = (property: Property) => {
    return property.location?.streetAddress || property.propertyType || "Untitled Property";
  };

  // Helper for property location
  const getPropertyLocation = (property: Property) => {
    const { city, country } = property.location || {};
    return [city, country].filter(Boolean).join(", ");
  };

  // Helper for property price
  const getPropertyPrice = (property: Property) => {
    return property.propertyDetails?.price ? `$${property.propertyDetails.price}/night` : "Price on request";
  };

  // Helper for property image
  const getPropertyImage = (property: Property) => {
    return property.media?.coverPhoto || "/Estate2.png";
  };

  // Helper for property id/slug for link
  const getPropertySlug = (property: Property) => {
    return property._id ? `/home-swap/${property._id}` : "#";
  };

  // Helper for reviews/rating (placeholder, as API does not provide directly)
  const getPropertyRating = () => {
    // If you have ratings, use them here. Otherwise, show placeholder.
    return { rating: 4.5, reviewCount: 12 };
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] ">
      {/* Message Sent Notification */}
      {messageSent && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-gray-200 shadow-lg rounded-lg px-6 py-4 flex items-start gap-4 max-w-sm">
          <div>
            <div className="font-semibold text-lg text-gray-800 mb-1">Message Sent!</div>
            <div className="text-sm text-gray-600">Your message has been sent to the home owner. They will contact you directly.</div>
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
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black  opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleUnderstand}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Important Disclaimer - Home Swap
            </h2>
            
            <p className="text-sm text-gray-700 mb-4 font-medium">
              Please read carefully:
            </p>
            
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Our platform provides a space for users to list and discover potential home swaps. 
                However, we do not participate in, facilitate, or validate any home swap 
                arrangements. All communications, agreements, and transactions regarding home 
                swaps are strictly between users.
              </p>
              
              <p>
                We do not collect payments or process bookings for swaps, and we do not verify the 
                legality of any swaps under rental agreements, leases, or local laws. Users are solely 
                responsible for ensuring compliance with their lease terms.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUnderstand}
                className="bg-[#C85212] text-white px-8 py-2 rounded-md hover:bg-[#A64310] transition-colors font-medium"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 lg:mt-42">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Where to?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
                    />
                    <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4+ Guests</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#C85212] focus:ring-[#C85212]" />
                      <span className="ml-2 text-sm text-gray-700">Entire home</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#C85212] focus:ring-[#C85212]" />
                      <span className="ml-2 text-sm text-gray-700">Private room</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#C85212] focus:ring-[#C85212]" />
                      <span className="ml-2 text-sm text-gray-700">Shared room</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="px-3">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #C85212 0%, #C85212 50%, #e5e7eb 50%, #e5e7eb 100%)'
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$1000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-teal-800 mb-3">Home swap</h1>
              <p className="text-gray-600 mb-6 text-lg">
                Exchange homes with others and experience<br />
                new destinations like a local
              </p>
              <Link href={"/swap-property-listings"}>
              
              <button className="bg-[#C85212] text-white px-6 py-3 rounded-md hover:bg-[#A64310] transition-colors flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                List your Home
              </button>
              </Link>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-teal-800">Available Home Swaps</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C85212] focus:border-transparent">
                  <option>Most recent</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* Loading/Error States */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212]"></div>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center py-12">
                <span className="text-red-500">Failed to load properties.</span>
              </div>
            )}

            {/* Property Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data?.properties?.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-12">No properties found.</div>
                )}
                {data?.properties?.map((property: Property) => {
                  const { rating, reviewCount } = getPropertyRating();
                  return (
                    <div key={property._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <Link href={getPropertySlug(property)} className="block group">
                          <Image
                            src={getPropertyImage(property)}
                            alt="Property"
                            width={600}
                            height={192}
                            className="w-full h-48 object-cover rounded-t-lg group-hover:brightness-90 transition"
                            style={{ width: 'auto', height: 'auto' }}
                            priority={false}
                          />
                          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                            <Star className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{getPropertyTitle(property)}</h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {getPropertyLocation(property)}
                        </p>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">{rating} ({reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">From {getPropertyPrice(property)}</span>
                          <button
                            className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm hover:bg-[#A64310] transition-colors"
                            onClick={() => handleContactOwner(getPropertyTitle(property))}
                          >
                            Contact owner
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {/* Pagination would go here if supported by the API */}
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

export default HomeSwap;