"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, ChevronDown, Maximize, Navigation } from "lucide-react";
import Image from "next/image";
import mapImage from "@/public/Map.png";
import { ReviewData, ReviewsSectionProps, SortOption } from "@/types/generated";
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { Review , SortComponentProps} from "@/types/generated";


const SortComponent: React.FC<SortComponentProps> = ({
  sortOptions,
  currentSort,
  onSortChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSortChange = (option: SortOption) => {
    onSortChange(option);
    setIsDropdownOpen(false);

    // Navigate to reviews page with selected sort option
    router.push(`/reviewsPage?sort=${option.value}`);
  };

  return (
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
              {currentSort}
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
                    aria-selected={currentSort === option.label}
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
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  initialSortOption = "Recent",
}) => {
  const [sortOption, setSortOption] = useState<string>(initialSortOption);
  const [mapMarkers, setMapMarkers] = useState<
    { id: string; top: string; left: string }[]
  >([]);
  const router = useRouter();


  const sortOptions: SortOption[] = useMemo(
    () => [
      { label: "Recent", value: "recent" },
      { label: "Highest Rating", value: "highest_rating" },
    ],
    []
  );

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
        stars.push(
          <Star key={i} size={16} className="fill-gray-400 text-gray-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            size={16}
            className="fill-gray-400 text-gray-400 opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option.label);
    // Navigate to reviews page with selected sort option
    router.push(`/reviewsPage?sort=${option.value}`);
  };

  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    limit: 2,
    sortBy: "mostRecent",
    sortOrder:"highestRating"
  });

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="text-lg text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[300px] flex-col gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <p className="text-lg text-red-600 mb-2">Error loading reviews</p>
            <p className="text-gray-500 text-sm">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const reviews: Review[] = data?.reviews || [];

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 py-8"
      aria-label="Property reviews"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Reviews List */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-teal-700 uppercase text-sm font-medium tracking-wide">
              REVIEWS
            </p>
            <h2 className="text-teal-700 text-3xl font-medium">
              Explore Reviews Near You
            </h2>
          </div>

          <h3 className="text-gray-700 text-2xl font-medium">Recent Reviews</h3>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <article
                  key={index}
                  className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-[180px] h-[120px] flex-shrink-0 rounded-md overflow-hidden relative">
                    <img
                      src={
                        review.linkedProperty?.media?.coverPhoto ||
                        "/placeholder-property.jpg"
                      }
                      alt={`Property at ${review.location.streetAddress}`}
                      width={180}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                    {review.isLinkedToDatabaseProperty && (
                      <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-gray-800 font-medium text-lg">
                      {review.location.streetAddress},{" "}
                      {review.location.district}, {review.location.city}
                    </h4>
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex">
                        {renderStars(review.overallRating)}
                      </div>
                      <span className="text-gray-700">
                        {review.overallRating.toString()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {review.detailedReview}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No reviews found.</p>
            )}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="lg:w-1/2 relative">
          {/* Sort Component */}
          <SortComponent
            sortOptions={sortOptions}
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />

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
                    transform: "translate(-50%, -50%)",
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
