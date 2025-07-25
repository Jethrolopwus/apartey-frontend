// "use client";
// import Image from "next/image";
// import { Star, ChevronDown, Filter, Search } from "lucide-react";
// import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Review, AllReviewsProps } from "@/types/generated";
// import SearchInput from "../atoms/Buttons/SearchInput";

// // Sort options configuration
// const sortOptions = [
//   {
//     label: "Most Recent",
//     value: "mostRecent",
//     sortBy: "mostRecent",
//     sortOrder: undefined,
//   },
//   {
//     label: "Highest Rating",
//     value: "highestRating",
//     sortBy: "highestRating",
//     sortOrder: "desc",
//   },
// ];

// // Filter options configuration
// const filterOptions = [
//   { label: "All Apartments", value: "all" },
//   { label: "Verified Properties", value: "verified" },
//   { label: "High Rated (4+ stars)", value: "highRated" },
//   { label: "Recent Reviews", value: "recent" },
// ];

// // Define a type for the location object
// interface ReviewLocation {
//   fullAddress?: string;
//   streetAddress?: string;
//   apartmentUnitNumber?: string;
//   district?: string;
//   city?: string;
//   country?: string;
// }

// // Helper to get the best available address string
// const getDisplayAddress = (loc: ReviewLocation) => {
//   if (loc?.fullAddress && loc.fullAddress.trim() !== "") return loc.fullAddress;
//   const parts = [
//     loc?.streetAddress || "",
//     loc?.apartmentUnitNumber || "",
//     loc?.district || "",
//     loc?.city || "",
//     loc?.country || "",
//   ].filter(Boolean);
//   return parts.length > 0 ? parts.join(", ") : "No Address";
// };

// const AllReviews: React.FC<AllReviewsProps> = ({
//   className = "",
//   showHeader = true,
//   maxItems,
//   gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
// }) => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("Most Recent");
//   const [filterOption, setFilterOption] = useState("All Apartments");
//   const [searchQuery, setSearchQuery] = useState("");

//   // Get sort parameters from URL
//   const sortBy = searchParams.get("sortBy") || undefined;
//   const sortOrder = searchParams.get("sortOrder") || undefined;

//   // Use the updated query hook with parameters
//   const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
//     sortBy,
//     sortOrder,
//   });

//   // Update sort option display based on URL parameters
//   useEffect(() => {
//     if (sortBy) {
//       const currentOption = sortOptions.find(
//         (option) => option.sortBy === sortBy
//       );
//       if (currentOption) {
//         setSortOption(currentOption.label);
//       }
//     }
//   }, [sortBy]);

//   // Handle sort change
//   const handleSortChange = (option: (typeof sortOptions)[0]) => {
//     setSortOption(option.label);
//     setIsDropdownOpen(false);

//     // Build query parameters
//     const params = new URLSearchParams();
//     params.append("sortBy", option.sortBy);
//     if (option.sortOrder) {
//       params.append("sortOrder", option.sortOrder);
//     }

//     // Navigate with new sort parameters
//     router.push(`${window.location.pathname}?${params.toString()}`);
//   };

//   // Handle filter change
//   const handleFilterChange = (option: (typeof filterOptions)[0]) => {
//     setFilterOption(option.label);
//     setIsFilterDropdownOpen(false);
//     // Filter logic can be implemented based on requirements
//   };

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     // Search logic can be implemented based on requirements
//   };

//   if (isLoading) {
//     return (
//       <div className={`bg-gray-50 ${className}`}>
//         <div className="max-w-7xl mx-auto px-4 py-10">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="flex flex-col items-center gap-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//               <p className="text-lg text-gray-600">Loading reviews...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`bg-gray-50 ${className}`}>
//         <div className="max-w-7xl mx-auto px-4 py-10">
//           <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
//             <div className="text-center">
//               <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//                 <span className="text-red-600 text-2xl">⚠</span>
//               </div>
//               <p className="text-lg text-red-600 mb-2">Error loading reviews</p>
//               <p className="text-gray-500 text-sm">{error.message}</p>
//             </div>
//             <button
//               onClick={() => refetch()}
//               className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const reviews: Review[] = data?.reviews || [];
//   const displayReviews = maxItems ? reviews.slice(0, maxItems) : reviews;

//   return (
//     <div className={`bg-gray-50 ${className}`}>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header with Sorting */}
//         {showHeader && (
//           <div className="mb-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <h1 className="text-2xl md:text-3xl font-semibold text-teal-800 mb-2 md:mb-0">
//                 Read Trusted Reviews from Verified Tenants
//               </h1>
//               {/* Sort Dropdown */}
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
//                     <span className="text-gray-600 text-sm">Sort by</span>
//                     <div className="relative">
//                       <button
//                         className="flex items-center gap-2 text-gray-800 min-w-[120px] justify-between"
//                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         aria-expanded={isDropdownOpen}
//                         aria-haspopup="listbox"
//                       >
//                         {sortOption}
//                         <ChevronDown
//                           size={16}
//                           className={`transition-transform ${
//                             isDropdownOpen ? "rotate-180" : ""
//                           }`}
//                         />
//                       </button>
//                       {isDropdownOpen && (
//                         <ul
//                           className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20 border"
//                           role="listbox"
//                         >
//                           {sortOptions.map((option) => (
//                             <li
//                               key={option.value}
//                               className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 ${
//                                 sortOption === option.label
//                                   ? "bg-teal-50 text-teal-700"
//                                   : ""
//                               }`}
//                               onClick={() => handleSortChange(option)}
//                               role="option"
//                               aria-selected={sortOption === option.label}
//                             >
//                               {option.label}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 mb-6 w-full bg-white mt-4 py-4 shadow-sm rounded-md">
//               {/* Filter Label with Icon */}
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <Filter size={20} className="text-gray-600" />
//                 <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
//                   Filter Reviews:
//                 </span>
//               </div>

//               {/* Search Input - Takes up remaining space */}
//               <div className="flex-1">
//                 <SearchInput
//                   placeholder="Search by home address e.g 62 Patigi-Ejebe Road, Patigi, Kwara"
//                   onPlaceSelect={(place) => {
//                     // router.push(
//                     //   `/reviews?q=${encodeURIComponent(place.description)}${
//                     //     apartment && apartment !== "all"
//                     //       ? `&apartment=${encodeURIComponent(apartment)}`
//                     //       : ""
//                     //   }`
//                     // );
//                   }}
//                   onChange={() => {}}
//                   onSubmit={(value) => {
//                     // if (value) {
//                     //   router.push(
//                     //     `/reviews?q=${encodeURIComponent(value)}${
//                     //       apartment && apartment !== "all"
//                     //         ? `&apartment=${encodeURIComponent(apartment)}`
//                     //         : ""
//                     //     }`
//                     //   );
//                     // }
//                   }}
//                   onLocationSelect={() => {}}
//                   className="w-full"
//                 />
//               </div>

//               {/* Apartment Dropdown */}
//               <div className="flex-shrink-0">
//                 <select
//                   // value={apartment}
//                   // onChange={(e) => handleDropdownFilter(e.target.value)}
//                   className="border border-gray-300 rounded-md px-4 py-2.5 text-sm bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 >
//                   <option value="all">All Apartments</option>
//                   <option value="studio">Studio</option>
//                   <option value="1bed">1 Bedroom</option>
//                   <option value="2bed">2 Bedroom</option>
//                   <option value="3bed">3 Bedroom</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reviews Grid */}
//         {displayReviews.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//               <Star className="w-12 h-12 text-gray-400" />
//             </div>
//             <p className="text-xl text-gray-500 mb-2">No reviews found.</p>
//             <p className="text-gray-400">Be the first to leave a review!</p>
//           </div>
//         ) : (
//           <div className={`grid gap-6 ${gridCols}`}>
//             {displayReviews.map((review: Review) => (
//               <article
//                 key={review._id}
//                 onClick={() => router.push(`/reviewsPage/${review._id}`)}
//                 className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
//                 style={{ minHeight: "370px", boxSizing: "border-box" }}
//               >
//                 <div className="relative w-full h-48 overflow-hidden">
//                   {review.linkedProperty?.media?.coverPhoto ? (
//                     <Image
//                       src={
//                         review?.linkedProperty.media?.coverPhoto &&
//                         review.linkedProperty?.media?.coverPhoto.trim() !== ""
//                           ? review.linkedProperty.media.coverPhoto
//                           : "/placeholder.png"
//                       }
//                       alt={
//                         review?.linkedProperty.media?.coverPhoto &&
//                         review.linkedProperty?.media?.coverPhoto.trim() !== ""
//                           ? `Property image for ${review.location.streetAddress}`
//                           : "Placeholder property image"
//                       }
//                       width={400}
//                       height={270}
//                       className="object-cover w-full h-full"
//                       priority={false}
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
//                           <span className="text-gray-500 text-2xl">🏠</span>
//                         </div>
//                         <span className="text-gray-500 text-sm">
//                           No Image Available
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   {/* Status and Verification Badges */}
//                   <div className="absolute top-3 left-3 right-3 flex justify-between">
//                     {review.isLinkedToDatabaseProperty && (
//                       <span className="bg-teal-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
//                         Verified
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
//                   <div>
//                     <h3 className="font-medium text-gray-800 text-base line-clamp-2 mb-1">
//                       {getDisplayAddress(review.location)}
//                     </h3>
//                     <div className="flex items-center gap-2 mb-1">
//                       <div className="flex gap-0.5">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             size={14}
//                             className={
//                               i < Math.floor(review.overallRating)
//                                 ? "fill-yellow-400 text-yellow-400"
//                                 : "text-gray-300"
//                             }
//                           />
//                         ))}
//                       </div>
//                       <span className="text-sm font-medium text-gray-700">
//                         {review.overallRating.toFixed(1)}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         ({review.overallRating.toFixed(0)} reviews)
//                       </span>
//                     </div>
//                     <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-2">
//                       {review.detailedReview}
//                     </p>
//                   </div>
//                   {/* Rating Details */}
//                   <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mb-2">
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium">Value:</span>
//                       <span>{review.valueForMoney}/5</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="font-medium">Experience:</span>
//                       <span>{review.overallExperience}/5</span>
//                     </div>
//                   </div>
//                   {/* Footer */}
//                   <div className="flex items-center justify-between pt-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
//                         <span className="text-white text-xs font-semibold">
//                           {review.submitAnonymously ? "A" : "R"}
//                         </span>
//                       </div>
//                       <span className="text-sm font-medium text-gray-800">
//                         <p className="font-semibold text-gray-900">
//                           {review?.submitAnonymously
//                             ? "Anonymous Reviewer"
//                             : review?.reviewer?.firstName || "Reviewer"}
//                         </p>
//                       </span>
//                     </div>
//                     <span className="text-xs text-gray-400">
//                       {new Date(review.createdAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {showHeader && data?.totalPages && data.totalPages > 1 && (
//           <div className="flex items-center justify-center mt-12 gap-2">
//             <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//               ← Previous
//             </button>

//             {[...Array(Math.min(data.totalPages, 10))].map((_, i) => (
//               <button
//                 key={i}
//                 className={`w-8 h-8 text-sm rounded transition-colors ${
//                   i + 1 === (data.currentPage || 1)
//                     ? "bg-teal-600 text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {data.totalPages > 10 && (
//               <>
//                 <span className="px-2 text-gray-400">...</span>
//                 <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
//                   {data.totalPages}
//                 </button>
//               </>
//             )}

//             <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//               Next →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllReviews;

"use client";
import Image from "next/image";
import { Star, ChevronDown, Filter } from "lucide-react"; // Removed unused 'Search' import
import { useGetAllReviewsQuery } from "@/Hooks/use-GetAllReviews.query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Review, AllReviewsProps } from "@/types/generated";
import SearchInput from "../atoms/Buttons/SearchInput";

// Sort options configuration
const sortOptions = [
  {
    label: "Most Recent",
    value: "mostRecent",
    sortBy: "mostRecent",
    sortOrder: undefined,
  },
  {
    label: "Highest Rating",
    value: "highestRating",
    sortBy: "highestRating",
    sortOrder: "desc",
  },
];

// Define a type for the location object
interface ReviewLocation {
  fullAddress?: string;
  streetAddress?: string;
  apartmentUnitNumber?: string;
  district?: string;
  city?: string;
  country?: string;
}

// Helper to get the best available address string
const getDisplayAddress = (loc: ReviewLocation) => {
  if (loc?.fullAddress && loc.fullAddress.trim() !== "") return loc.fullAddress;
  const parts = [
    loc?.streetAddress || "",
    loc?.apartmentUnitNumber || "",
    loc?.district || "",
    loc?.city || "",
    loc?.country || "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No Address";
};

const AllReviews: React.FC<AllReviewsProps> = ({
  className = "",
  showHeader = true,
  maxItems,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Most Recent");

  // Get sort parameters from URL
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;

  // Use the updated query hook with parameters
  const { data, isLoading, error, refetch } = useGetAllReviewsQuery({
    sortBy,
    sortOrder,
  });

  // Update sort option display based on URL parameters
  useEffect(() => {
    if (sortBy) {
      const currentOption = sortOptions.find(
        (option) => option.sortBy === sortBy
      );
      if (currentOption) {
        setSortOption(currentOption.label);
      }
    }
  }, [sortBy]);

  // Handle sort change
  const handleSortChange = (option: (typeof sortOptions)[0]) => {
    setSortOption(option.label);
    setIsDropdownOpen(false);

    // Build query parameters
    const params = new URLSearchParams();
    params.append("sortBy", option.sortBy);
    if (option.sortOrder) {
      params.append("sortOrder", option.sortOrder);
    }

    // Navigate with new sort parameters
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="text-lg text-gray-600">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
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
        </div>
      </div>
    );
  }

  const reviews: Review[] = data?.reviews || [];
  const displayReviews = maxItems ? reviews.slice(0, maxItems) : reviews;

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Sorting */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-teal-800 mb-2 md:mb-0">
                Read Trusted Reviews from Verified Tenants
              </h1>
              {/* Sort Dropdown */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white rounded-md shadow px-4 py-2">
                    <span className="text-gray-600 text-sm">Sort by</span>
                    <div className="relative">
                      <button
                        className="flex items-center gap-2 text-gray-800 min-w-[120px] justify-between"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="listbox"
                      >
                        {sortOption}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isDropdownOpen && (
                        <ul
                          className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-20 border"
                          role="listbox"
                        >
                          {sortOptions.map((option) => (
                            <li
                              key={option.value}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 ${
                                sortOption === option.label
                                  ? "bg-teal-50 text-teal-700"
                                  : ""
                              }`}
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
            </div>
            <div className="flex items-center gap-4 mb-6 w-full bg-white mt-4 py-4 shadow-sm rounded-md">
              {/* Filter Label with Icon */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter Reviews:
                </span>
              </div>

              {/* Search Input - Takes up remaining space */}
              <div className="flex-1">
                <SearchInput
                  placeholder="Search by home address e.g 62 Patigi-Ejebe Road, Patigi, Kwara"
                  onPlaceSelect={() => {
                    // Placeholder for future implementation
                  }}
                  onChange={() => {}}
                  onSubmit={() => {
                    // Placeholder for future implementation
                  }}
                  onLocationSelect={() => {}}
                  className="w-full"
                />
              </div>

              {/* Apartment Dropdown */}
              <div className="flex-shrink-0">
                <select className="border border-gray-300 rounded-md px-4 py-2.5 text-sm bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  <option value="all">All Apartments</option>
                  <option value="studio">Studio</option>
                  <option value="1bed">1 Bedroom</option>
                  <option value="2bed">2 Bedroom</option>
                  <option value="3bed">3 Bedroom</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-2">No reviews found.</p>
            <p className="text-gray-400">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridCols}`}>
            {displayReviews.map((review: Review) => (
              <article
                key={review._id}
                onClick={() => router.push(`/reviewsPage/${review._id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
                style={{ minHeight: "370px", boxSizing: "border-box" }}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {review.linkedProperty?.media?.coverPhoto ? (
                    <Image
                      src={
                        review?.linkedProperty.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? review.linkedProperty.media.coverPhoto
                          : "/placeholder.png"
                      }
                      alt={
                        review?.linkedProperty.media?.coverPhoto &&
                        review.linkedProperty?.media?.coverPhoto.trim() !== ""
                          ? `Property image for ${review.location.streetAddress}`
                          : "Placeholder property image"
                      }
                      width={400}
                      height={270}
                      className="object-cover w-full h-full"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-2xl">🏠</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          No Image Available
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Status and Verification Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    {review.isLinkedToDatabaseProperty && (
                      <span className="bg-teal-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 text-base line-clamp-2 mb-1">
                      {getDisplayAddress(review.location)}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(review.overallRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.overallRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({review.overallRating.toFixed(0)} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-2">
                      {review.detailedReview}
                    </p>
                  </div>
                  {/* Rating Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Value:</span>
                      <span>{review.valueForMoney}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Experience:</span>
                      <span>{review.overallExperience}/5</span>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {review.submitAnonymously ? "A" : "R"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        <p className="font-semibold text-gray-900">
                          {review?.submitAnonymously
                            ? "Anonymous Reviewer"
                            : review?.reviewer?.firstName || "Reviewer"}
                        </p>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {showHeader && data?.totalPages && data.totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 gap-2">
            <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              ← Previous
            </button>

            {[...Array(Math.min(data.totalPages, 10))].map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 text-sm rounded transition-colors ${
                  i + 1 === (data.currentPage || 1)
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {data.totalPages > 10 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  {data.totalPages}
                </button>
              </>
            )}

            <button className="px-4 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
