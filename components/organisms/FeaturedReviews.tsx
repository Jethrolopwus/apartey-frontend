'use client';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { FeaturedReview } from '@/types/generated';


const featuredReviews: FeaturedReview[] = [
  {
    id: '1',
    imageUrl: '/Estate-1.png',
    verified: true,
    address: 'No 1. kumuye strt...',
    rating: 4.0,
    reviewCount: 28,
    comment: '“Great location but maintenance issues were a constant problem during my stay...”',
    user: {
      name: 'Andrew Abba',
      avatarUrl: '/Festus.png',
    },
    date: '20th April, 2025',
  },
  // Add more reviews as needed
  {
    id: '2',
    imageUrl: '/Estate-1.png',
    verified: true,
    address: 'No 1. kumuye strt...',
    rating: 4.0,
    reviewCount: 28,
    comment: '“Great location but maintenance issues were a constant problem during my stay...”',
    user: {
      name: 'Andrew Abba',
      avatarUrl: '/Festus.png',
    },
    date: '20th April, 2025',
  },
  {
    id: '3',
    imageUrl: '/Estate-1.png',
    verified: true,
    address: 'No 1. kumuye strt...',
    rating: 4.0,
    reviewCount: 28,
    comment: '“Great location but maintenance issues were a constant problem during my stay...”',
    user: {
      name: 'Andrew Abba',
      avatarUrl: '/Festus.png',
    },
    date: '20th April, 2025',
  },
];

const FeaturedReviews = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">Reviews</p>
          <h2 className="text-xl md:text-xl font-semibold text-gray-800">Featured reviews</h2>
        </div>
        <a href="#" className="text-sm text-gray-700 hover:text-teal-600 flex items-center gap-1">
          See all <span className="text-xl">→</span>
        </a>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featuredReviews.map((review) => (
          <article
            key={review.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Image + Verified Badge */}
            <div className="relative w-full h-48">
              <Image
                src={review.imageUrl}
                alt="Property"
                fill
                className="object-cover"
              />
              {review.verified && (
                <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-gray-800 text-base truncate">{review.address}</h3>
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(review.rating)
                          ? 'fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  {review.rating.toFixed(1)} ({review.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-500 text-sm">{review.comment}</p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={review.user.avatarUrl}
                    alt={review.user.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-800">{review.user.name}</span>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedReviews;
