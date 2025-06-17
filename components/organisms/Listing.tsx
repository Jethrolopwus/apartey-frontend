
'use client';

import React from 'react';
import { Star, Bed, Bath, Ruler, Heart, ArrowRight } from 'lucide-react';
import { useGetAllListingsQuery } from '@/Hooks/use-getAllListings.query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Listings = () => {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetAllListingsQuery({
    limit: 6,
  });

  // ---------------- helpers ----------------
  const transformPropertyToListing = (property: {
    _id: string;
    media: { coverPhoto: string };
    adPromotion: { certifiedByFinder?: boolean };
    propertyDetails: {
      description: string;
      bedrooms: number;
      bathrooms: number;
      totalAreaSqM: number;
      price: number;
    };
    propertyType: string;
    location: { district: string; city: string; country: string };
  }) => {
    // (helper fns unchanged)
    const formatPrice = (price: number) => {
      if (price >= 1_000_000) return `NGN${(price / 1_000_000).toFixed(1)}M/Year`;
      if (price >= 1_000) return `NGN${(price / 1_000).toFixed(0)}K/Year`;
      return `NGN${price.toLocaleString()}/Year`;
    };
    const generateOldPrice = (current: number) =>
      formatPrice(Math.round(current * (1.3 + Math.random() * 0.4)));

    const rating = 3.5 + Math.random() * 1.5;
    const reviews = Math.floor(Math.random() * 50) + 5;

    return {
      id: property._id,
      imageUrl: property.media.coverPhoto,
      verified: property.adPromotion?.certifiedByFinder || false,
      title:
        `${property.propertyDetails.description.substring(0, 20)}...` ||
        `${property.propertyType} in ${property.location.district}`,
      location: `${property.location.city}, ${property.location.country}`,
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviews,
      beds: property.propertyDetails.bedrooms,
      baths: property.propertyDetails.bathrooms,
      size: `${property.propertyDetails.totalAreaSqM}m²`,
      oldPrice: generateOldPrice(property.propertyDetails.price),
      newPrice: formatPrice(property.propertyDetails.price),
    };
  };

  // ---------- loading / error / empty states (unchanged) ----------
  if (isLoading) { /* … */ }
  if (error) { /* … */ }

  const listings = data?.properties?.map(transformPropertyToListing) || [];
  if (listings.length === 0) { /* … */ }

  // ---------- render ----------
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* header (unchanged) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">
            LISTINGS
          </p>
          <h2 className="text-xl md:text-xl font-semibold text-gray-800">
            Deals for you
          </h2>
        </div>
        <Link href="/listings">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
            <span className="text-sm md:text-base mr-2">See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      {/* properties count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {listings.length}{' '}
          {listings.length === 1 ? 'property' : 'properties'}
          {data?.totalProperties && data.totalProperties > listings.length &&
            ` of ${data.totalProperties} total`}
        </p>
      </div>

      {/* cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            onClick={() => router.push(`/listings/${listing.id}`)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden relative"
          >
            {/* image */}
            <div className="relative w-full h-48">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = '/Estate2.png')
                }
                loading="lazy"
              />

              {/* verified badge */}
              {listing.verified && (
                <button className="absolute top-3 right-3 bg-white text-teal-600 text-xs font-semibold px-3 py-1 rounded-full border border-teal-600 shadow-sm hover:bg-teal-50 z-10">
                  Verified
                </button>
              )}

              {/* 🗑️  overlay removed */}
            </div>

            {/* body */}
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-gray-800 text-base truncate" title={listing.title}>
                {listing.title}
              </h3>
              <p className="text-sm text-gray-500">{listing.location}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(listing.rating)
                          ? 'fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="underline text-sm">
                  {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center text-gray-700 text-sm gap-4 mt-2">
                <span className="flex items-center gap-1" title={`${listing.beds} bedrooms`}>
                  <Bed size={16} /> {listing.beds}
                </span>
                <span className="flex items-center gap-1" title={`${listing.baths} bathrooms`}>
                  <Bath size={16} /> {listing.baths}
                </span>
                <span className="flex items-center gap-1" title={`${listing.size} area`}>
                  <Ruler size={16} /> {listing.size}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm">
                  <p className="line-through text-gray-400">{listing.oldPrice}</p>
                  <p className="text-gray-800 font-medium">{listing.newPrice}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-teal-600 transition-colors"
                  onClick={() => console.log('Added to favorites:', listing.id)}
                  title="Add to favorites"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* load‑more button (unchanged) */}
      {data?.hasNextPage && (
        <div className="text-center mt-8">
          <button
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => console.log('Load more properties')}
          >
            Load More Properties
          </button>
        </div>
      )}
    </section>
  );
};

export default Listings;
