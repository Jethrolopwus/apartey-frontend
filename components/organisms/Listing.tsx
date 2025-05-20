'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Star, Bed, Bath, Ruler, Heart } from 'lucide-react';
import Link from 'next/link';
import { Listing } from '@/types/generated';

const listings: Listing[] = [
  {
    id: '1',
    imageUrl: '/Estate2.png',
    verified: true,
    title: 'No 1. kumuye strt...',
    location: 'Abuja, Nigeria.',
    rating: 4.0,
    reviewCount: 28,
    beds: 4,
    baths: 4,
    size: '40m²',
    oldPrice: 'NGN650,000/Year',
    newPrice: 'NGN450,000/Year',
  },
  {
    id: '2',
    imageUrl: '/Estate2.png',
    verified: true,
    title: 'Suite 2, Alpha Center...',
    location: 'Lagos, Nigeria.',
    rating: 3.5,
    reviewCount: 15,
    beds: 3,
    baths: 3,
    size: '30m²',
    oldPrice: 'NGN450,000/Year',
    newPrice: 'NGN350,000/Year',
  },
  {
    id: '3',
    imageUrl: '/Estate2.png',
    verified: true,
    title: 'No 1. kumuye strt...',
    location: 'Abuja, Nigeria.',
    rating: 4.0,
    reviewCount: 28,
    beds: 4,
    baths: 4,
    size: '40m²',
    oldPrice: 'NGN650,000/Year',
    newPrice: 'NGN450,000/Year',
  },
];

const Listings = () => {
  // Keep track of which card is being hovered
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">LISTINGS</p>
          <h2 className="text-xl md:text-xl font-semibold text-gray-800">Deals for you</h2>
        </div>
        <a href="#" className="text-sm text-gray-700 hover:text-teal-600 flex items-center gap-1">
          See all <span className="text-2xl">→</span>
        </a>
      </div>

      {/* Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden relative group"
            onMouseEnter={() => setHoveredCardId(listing.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            onTouchStart={() => setHoveredCardId(listing.id === hoveredCardId ? null : listing.id)}
          >
            {/* Image */}
            <div className="relative w-full h-48">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {/* Verified Button */}
              {listing.verified && (
                <button className="absolute top-3 right-3 bg-white text-teal-600 text-xs font-semibold px-3 py-1 rounded-full border border-teal-600 shadow-sm hover:bg-teal-50 z-10">
                  Verified
                </button>
              )}

              {/* Overlay on hover */}
              <div 
                className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 ${
                  hoveredCardId === listing.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex flex-col gap-3 w-3/4">
                <Link 
                    href="/listings/rent-a-home" 
                    className="bg-white text-gray-800 py-2 px-4 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-100 transition w-full text-center"
                  >
                    Rent Home
                  </Link>
                  <Link 
                    href="/listings/swap-a-home" 
                    className="bg-white text-gray-800 py-2 px-4 rounded-md cursor-pointer text-sm font-medium hover:bg-gray-100 transition w-full text-center"
                  >
                    Swap Home
                  </Link>
                </div>
              </div>

              {/* Carousel dots (mocked) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot === 1 ? 'bg-white' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-gray-800 text-base truncate">{listing.title}</h3>
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

              {/* Icons */}
              <div className="flex items-center text-gray-700 text-sm gap-4 mt-2">
                <span className="flex items-center gap-1"><Bed size={16} /> {listing.beds}</span>
                <span className="flex items-center gap-1"><Bath size={16} /> {listing.baths}</span>
                <span className="flex items-center gap-1"><Ruler size={16} /> {listing.size}</span>
              </div>

              {/* Prices & Heart */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm">
                  <p className="line-through text-gray-400">{listing.oldPrice}</p>
                  <p className="text-gray-800 font-medium">{listing.newPrice}</p>
                </div>
                <button className="text-gray-400 hover:text-teal-600">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Listings;