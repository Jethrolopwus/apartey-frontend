

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Edit3, 
//   Heart, 
//   Star, 
//   Bed, 
//   Bath, 
//   Square,
//   Users,
//   Headphones
// } from 'lucide-react';

// const UserProfile: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-4xl">
//         {/* Header */}
//         <h1 className="mb-8 text-3xl font-bold text-gray-900">My profile</h1>

//         {/* Profile Completion Card */}
//         <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
//           <div className="flex items-start space-x-4">
//             {/* Progress Circle */}
//             <div className="relative flex h-16 w-16 items-center justify-center">
//               <svg className="h-16 w-16 -rotate-90 transform">
//                 <circle
//                   cx="32"
//                   cy="32"
//                   r="28"
//                   stroke="#f3f4f6"
//                   strokeWidth="4"
//                   fill="transparent"
//                 />
//                 <circle
//                   cx="32"
//                   cy="32"
//                   r="28"
//                   stroke="#f97316"
//                   strokeWidth="4"
//                   fill="transparent"
//                   strokeDasharray={`${2 * Math.PI * 28}`}
//                   strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.66)}`}
//                   className="transition-all duration-300 ease-in-out"
//                 />
//               </svg>
//               <span className="absolute text-sm font-semibold text-orange-600">66%</span>
//             </div>
            
//             {/* Completion Text */}
//             <div className="flex-1">
//               <h3 className="mb-2 text-lg font-semibold text-gray-900">Complete your profile</h3>
//               <div className="space-y-1 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <span className="mr-2 text-orange-500">+</span>
//                   <span>Verify your email</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="mr-2 text-orange-500">+</span>
//                   <span>Add date of birth</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* User Profile Card */}
//         <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
//             {/* Profile Image */}
//             <div className="mb-4 flex justify-center sm:mb-0 sm:justify-start">
//               <div className="relative h-20 w-20 overflow-hidden rounded-full">
//                 <Image
//                   src="/Ellipse-1.png"
//                   alt="Andrew Abba"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>

//             {/* Profile Info */}
//             <div className="flex-1 text-center sm:text-left">
//               <div className="mb-4 flex flex-col items-center justify-between sm:flex-row sm:items-start">
//                 <div>
//                   <h2 className="mb-2 text-xl font-semibold text-gray-900">Andrew Abba</h2>
//                   <div className="space-y-1 text-sm text-gray-600">
//                     <div className="flex items-center justify-center sm:justify-start">
//                       <Mail className="mr-2 h-4 w-4" />
//                       <span>email@example.com</span>
//                     </div>
//                     <div className="flex items-center justify-center sm:justify-start">
//                       <Phone className="mr-2 h-4 w-4" />
//                       <span>(234) 556-7890</span>
//                     </div>
//                     <div className="flex items-center justify-center sm:justify-start">
//                       <MapPin className="mr-2 h-4 w-4" />
//                       <span>119 Okene Market Road, Okene, Kogi</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Points Badge */}
//                 <div className="mt-4 flex items-center space-x-2 sm:mt-0">
//                   <div className="flex items-center rounded-full bg-orange-100 px-3 py-1">
//                     <span className="mr-1 text-orange-600">🏆</span>
//                     <span className="text-sm font-medium text-orange-600">600</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Bio */}
//               <p className="mb-4 text-sm text-gray-600 leading-relaxed">
//                 Extensive experience in rentals and a vast database means I can quickly find the options that are 
//                 right for you. Looking for a seamless and exciting rental experience? Contact me today - I promise 
//                 it won't be boring! Your perfect home is just a call away.
//               </p>

//               {/* Edit Profile Button */}
//               <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
//                 <Edit3 className="mr-2 h-4 w-4" />
//                 Edit profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Favorites Section */}
//         <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
//             <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
//               View all →
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             {/* Property Card 1 */}
//             <div className="relative overflow-hidden rounded-lg border border-gray-200">
//               {/* Image */}
//               <div className="relative h-48">
//                 <Image
//                   src="/Estate2.png"
//                   alt="Suite 2, Alpha Center"
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute right-3 top-3">
//                   <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
//                     Unverified
//                   </span>
//                 </div>
//                 <button className="absolute right-3 top-12">
//                   <Heart className="h-5 w-5 text-white" />
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 <h4 className="mb-2 font-semibold text-gray-900">Suite 2, Alpha Center...</h4>
//                 <p className="mb-2 text-sm text-gray-600">Lagos, Nigeria</p>
                
//                 {/* Rating */}
//                 <div className="mb-3 flex items-center">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                   <span className="ml-2 text-sm text-gray-600">3.5 (15 reviews)</span>
//                 </div>

//                 {/* Property Details */}
//                 <div className="mb-3 flex items-center space-x-4 text-sm text-gray-600">
//                   <div className="flex items-center">
//                     <Bed className="mr-1 h-4 w-4" />
//                     <span>3</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Bath className="mr-1 h-4 w-4" />
//                     <span>3</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Square className="mr-1 h-4 w-4" />
//                     <span>30m²</span>
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="text-sm text-gray-900">
//                   <span className="font-semibold">NGN450,000/Year</span>
//                   <span className="ml-2 text-gray-600">NGN350,000/Year</span>
//                 </div>
//               </div>
//             </div>

//             {/* Property Card 2 - Duplicate structure */}
//             <div className="relative overflow-hidden rounded-lg border border-gray-200">
//               <div className="relative h-48">
//                 <Image
//                   src="/Apartment1.png"
//                   alt="Suite 2, Alpha Center"
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute right-3 top-3">
//                   <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
//                     Unverified
//                   </span>
//                 </div>
//                 <button className="absolute right-3 top-12">
//                   <Heart className="h-5 w-5 text-white" />
//                 </button>
//               </div>

//               <div className="p-4">
//                 <h4 className="mb-2 font-semibold text-gray-900">Suite 2, Alpha Center...</h4>
//                 <p className="mb-2 text-sm text-gray-600">Lagos, Nigeria</p>
                
//                 <div className="mb-3 flex items-center">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                   <span className="ml-2 text-sm text-gray-600">3.5 (15 reviews)</span>
//                 </div>

//                 <div className="mb-3 flex items-center space-x-4 text-sm text-gray-600">
//                   <div className="flex items-center">
//                     <Bed className="mr-1 h-4 w-4" />
//                     <span>3</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Bath className="mr-1 h-4 w-4" />
//                     <span>3</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Square className="mr-1 h-4 w-4" />
//                     <span>30m²</span>
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-900">
//                   <span className="font-semibold">NGN450,000/Year</span>
//                   <span className="ml-2 text-gray-600">NGN350,000/Year</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Need Help Section */}
//         <div className="rounded-lg bg-white p-6 shadow-sm">
//           <h3 className="mb-6 text-lg font-semibold text-gray-900">Need help?</h3>
          
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             {/* Join a Finder property club */}
//             <div className="flex items-start space-x-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
//                 <Users className="h-5 w-5 text-gray-600" />
//               </div>
//               <div className="flex-1">
//                 <h4 className="mb-2 font-medium text-gray-900">Join a Finder property club</h4>
//                 <p className="text-sm text-gray-600">
//                   Join your local Host Club to connect with your hosting community both online and through in-person or virtual Meetups.
//                 </p>
//               </div>
//             </div>

//             {/* Get professional support */}
//             <div className="flex items-start space-x-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
//                 <Headphones className="h-5 w-5 text-gray-600" />
//               </div>
//               <div className="flex-1">
//                 <h4 className="mb-2 font-medium text-gray-900">Get professional support</h4>
//                 <p className="text-sm text-gray-600">
//                   Fill your virtual assistant from the Help Center, ready to assist you in finding the information and resources you're looking for.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;



'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useUserData } from '@/Hooks/useUserData';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Heart, 
  Star, 
  Bed, 
  Bath, 
  Square,
  Users,
  Headphones,
  LogOut,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { userData, loading, error, sendUserDataToBackend } = useUserData();
  const [syncLoading, setSyncLoading] = useState(false);

  const handleManualSync = async () => {
    try {
      setSyncLoading(true);
      const result = await sendUserDataToBackend();
      toast.success('User data synced successfully!');
      console.log('Sync result:', result);
    } catch (error) {
      toast.error('Failed to sync user data: ' + (error as Error).message);
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to view your profile</p>
        </div>
      </div>
    );
  }

  // Mock favorite properties data - replace with actual data from your API
  const favoriteProperties = [
    {
      id: 1,
      title: "Suite 2, Alpha Center...",
      location: "Lagos, Nigeria",
      image: "/Estate2.png",
      rating: 3.5,
      reviews: 15,
      beds: 3,
      baths: 3,
      area: "30m²",
      price: "NGN450,000/Year",
      originalPrice: "NGN350,000/Year",
      status: "Unverified"
    },
    {
      id: 2,
      title: "Suite 2, Alpha Center...",
      location: "Lagos, Nigeria",
      image: "/Apartment1.png",
      rating: 3.5,
      reviews: 15,
      beds: 3,
      baths: 3,
      area: "30m²",
      price: "NGN450,000/Year",
      originalPrice: "NGN350,000/Year",
      status: "Unverified"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My profile</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleManualSync}
              disabled={syncLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
              {syncLoading ? 'Syncing...' : 'Sync'}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Progress Circle */}
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#f3f4f6"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#f97316"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.85)}`}
                  className="transition-all duration-300 ease-in-out"
                />
              </svg>
              <span className="absolute text-sm font-semibold text-orange-600">85%</span>
            </div>
            
            {/* Completion Text */}
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Complete your profile</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Email verified</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-orange-500">+</span>
                  <span>Add phone number</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-orange-500">+</span>
                  <span>Add profile photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
            {/* Profile Image */}
            <div className="mb-4 flex justify-center sm:mb-0 sm:justify-start">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                {userData.image ? (
                  <Image
                    src={userData.image}
                    alt={userData.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">
                    {userData.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4 flex flex-col items-center justify-between sm:flex-row sm:items-start">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {userData.name || 'User'}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>{userData.email}</span>
                    </div>
                    {/* Add phone if available */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      <span className="text-gray-400">Phone not provided</span>
                    </div>
                    {/* Add location if available */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="text-gray-400">Location not provided</span>
                    </div>
                  </div>
                </div>
                
                {/* Points Badge */}
                <div className="mt-4 flex items-center space-x-2 sm:mt-0">
                  <div className="flex items-center rounded-full bg-orange-100 px-3 py-1">
                    <span className="mr-1 text-orange-600">🏆</span>
                    <span className="text-sm font-medium text-orange-600">600</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                Welcome to your property finder profile! Explore listings, save favorites, and discover your perfect home. 
                Complete your profile to unlock more features and get personalized recommendations.
              </p>

              {/* Edit Profile Button */}
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* User Data Debug Info (removable in production) */}
        {userData.accessToken && (
          <div className="mb-8 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Debug Info</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>User ID: {userData.id}</div>
              <div>Access Token: {userData.accessToken.substring(0, 20)}...</div>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {favoriteProperties.map((property) => (
              <div key={property.id} className="relative overflow-hidden rounded-lg border border-gray-200">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {property.status}
                    </span>
                  </div>
                  <button className="absolute right-3 top-12">
                    <Heart className="h-5 w-5 text-white fill-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">{property.title}</h4>
                  <p className="mb-2 text-sm text-gray-600">{property.location}</p>
                  
                  {/* Rating */}
                  <div className="mb-3 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(property.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{property.rating} ({property.reviews} reviews)</span>
                  </div>

                  {/* Property Details */}
                  <div className="mb-3 flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="mr-1 h-4 w-4" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-1 h-4 w-4" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="mr-1 h-4 w-4" />
                      <span>{property.area}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold">{property.price}</span>
                    <span className="ml-2 text-gray-600 line-through">{property.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Need help?</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Join a Finder property club */}
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 font-medium text-gray-900">Join a Finder property club</h4>
                <p className="text-sm text-gray-600">
                  Join your local Host Club to connect with your hosting community both online and through in-person or virtual Meetups.
                </p>
              </div>
            </div>

            {/* Get professional support */}
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Headphones className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 font-medium text-gray-900">Get professional support</h4>
                <p className="text-sm text-gray-600">
                  Fill your virtual assistant from the Help Center, ready to assist you in finding the information and resources you're looking for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;