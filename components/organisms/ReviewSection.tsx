"use client";
import { useState, useMemo, useEffect } from 'react';
import { Star, ChevronDown, Maximize, Navigation } from 'lucide-react';
import Image from 'next/image';
import mapImage from "@/public/Map.png";
import { ReviewData, ReviewsSectionProps, SortOption } from '@/types/generated';

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  initialReviews,
  initialSortOption = 'Recent'
}) => {
  const [reviews] = useState<ReviewData[]>(initialReviews || [
    {
      id: '1',
      address: 'No 1. kumuye strt...',
      rating: 4.0,
      reviewCount: 28,
      comment: '"Great location but maintenance issues were a constant problem during my stay..."',
      imageUrl: "/Apartment1.png",
      location: { lat: 9.0765, lng: 7.3986 }
    },
    {
      id: '2',
      address: 'No 1. kumuye strt...',
      rating: 4.0,
      reviewCount: 28,
      comment: '"Great location but maintenance issues were a constant problem during my stay..."',
      imageUrl: '/Apartment1.png',
      location: { lat: 9.0825, lng: 7.4106 }
    },
    {
      id: '3',
      address: 'No 1. kumuye strt...',
      rating: 4.0,
      reviewCount: 28,
      comment: '"Great location but maintenance issues were a constant problem during my stay..."',
      imageUrl: '/Apartment1.png',
      location: { lat: 9.0625, lng: 7.3886 }
    }
  ]);

  const [sortOption, setSortOption] = useState<string>(initialSortOption);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mapMarkers, setMapMarkers] = useState<{ id: string; top: string; left: string }[]>([]);

  const sortOptions: SortOption[] = useMemo(() => [
    { label: 'Recent', value: 'recent' },
    { label: 'Highest Rating', value: 'highest_rating' },
    { label: 'Most Reviews', value: 'most_reviews' },
  ], []);

  useEffect(() => {
    const markers = Array.from({ length: 12 }).map((_, i) => ({
      id: `marker-${i + 1}`,
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
    }));
    setMapMarkers(markers);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-gray-400 text-gray-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={16} className="fill-gray-400 text-gray-400 opacity-50" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option.label);
    setIsDropdownOpen(false);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8" aria-label="Property reviews">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Reviews List */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">REVIEWS</p>
            <h2 className="text-teal-700 text-3xl font-medium">Explore Reviews Near you</h2>
          </div>

          <h3 className="text-gray-700 text-2xl font-medium">Recent Reviews</h3>

          <div className="space-y-6">
            {reviews.map((review) => (
              <article key={review.id} className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-[180px] h-[120px] flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={review.imageUrl}
                    alt={`Property at ${review.address}`}
                    width={180}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-gray-800 font-medium text-lg">{review.address}</h4>
                  <div className="flex items-center gap-2 my-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-gray-700">
                      {review.rating.toFixed(1)} ({review.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{review.comment}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="lg:w-1/2 relative">
          {/* Sort Dropdown */}
          <div className="absolute top-0 right-0 flex justify-end mb-4 z-10">
            <div className="relative">
              <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
                <span className="text-gray-600 text-sm">Sort by</span>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 text-gray-800"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    {sortOption}
                    <ChevronDown size={16} />
                  </button>

                  {isDropdownOpen && (
                    <ul
                      className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20"
                      role="listbox"
                    >
                      {sortOptions.map((option) => (
                        <li
                          key={option.value}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                          onClick={() => handleSortChange(option)}
                          role="option"
                          aria-selected={sortOption === option.label}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="w-full h-full relative">
              <Image
                src={mapImage}
                alt="Map of property locations"
                fill
                className="object-cover"
                priority
              />

              {mapMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-6 h-6 flex items-center justify-center"
                  style={{
                    top: marker.top,
                    left: marker.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white drop-shadow-md"></div>
                </div>
              ))}

              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize size={20} className="text-gray-700" />
                </button>
                <button
                  className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Navigate to current location"
                >
                  <Navigation size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
