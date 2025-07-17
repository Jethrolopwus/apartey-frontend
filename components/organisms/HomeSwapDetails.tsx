"use client";
import React from 'react';
import { Star, Share2, Flag, User, Home } from 'lucide-react';
import Image from 'next/image';
import type { Property } from '@/types/generated';
import { useGetPropertyByIdQuery } from '@/Hooks/use-getAllPropertiesById.query';

interface HomeSwapDetailsProps {
  id: string;
}

const HomeSwapDetails: React.FC<HomeSwapDetailsProps> = ({ id }) => {
  const { data, isLoading, error } = useGetPropertyByIdQuery(id);
  // The API response is { message, property, relatedProperties }
  const property: Property | undefined = data?.property;
  const relatedProperties: Property[] = data?.relatedProperties || [];

  // Debug: log the property data
  console.log('[HomeSwapDetails] Property data:', property);

  if (isLoading) {
    return <div className="text-center py-12">Loading property details...</div>;
  }
  if (error || !property) {
    return <div className="text-center text-red-500 py-12">Failed to load property details.</div>;
  }

  // Helper for images
  const mainImage = property.media?.coverPhoto || '/Estate2.png';
  const thumbnails = property.media?.uploads?.filter((u) => u.type === 'image') || [];

  // Host info
  const host = property.contactInfo || {};

  // Amenities
  const amenities = property.propertyDetails?.amenities || [];

  // Address
  const address = property.location?.streetAddress || 'No address';
  const city = property.location?.city || '';
  const country = property.location?.country || '';

  // Description
  const description = property.propertyDetails?.description || '';

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-md mt-8 mb-12">
      {/* Title and Gallery */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          {address}{city ? `, ${city}` : ''}{country ? `, ${country}` : ''}
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main Image */}
          <div className="flex-1 min-w-[250px]">
            <Image src={mainImage} alt="Main" width={800} height={320} className="w-full h-64 md:h-80 object-cover rounded-lg" />
          </div>
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 md:ml-2">
            {thumbnails.map((thumb, i: number) => (
              <Image key={i} src={thumb.url} alt={`Thumb ${i + 1}`} width={112} height={80} className="w-24 h-16 md:w-28 md:h-20 object-cover rounded-lg border border-gray-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Top Row: Description, Map, Host, Actions */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Description & Amenities */}
        <div className="flex-1">
          <p className="text-gray-700 mb-4 text-sm md:text-base">
            {description}
          </p>
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Building Amenities</h2>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {amenities.length > 0 ? amenities.map((a: string, i: number) => <li key={i}>{a}</li>) : <li>No amenities listed</li>}
            </ul>
          </div>
        </div>
        {/* Map */}
        <div className="flex-1 min-w-[250px]">
          <Image src="/Map.png" alt="Map" width={400} height={256} className="w-full h-48 md:h-64 object-cover rounded-lg border" />
        </div>
        {/* Host Card */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg border p-4 flex flex-col items-center text-center mb-4">
            <Image src="/Ellipse-1.png" alt="Host" width={64} height={64} className="w-16 h-16 rounded-full mb-2 border" />
            <div className="font-semibold text-gray-900">{host.firstName} {host.lastName}</div>
            <div className="text-xs text-gray-500 mb-2">{host.typeOfOffer || 'Host'} • 4.8 (120 reviews)</div>
            <button className="bg-[#C85212] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#A64310] mb-2 w-full">Message Host</button>
            <button className="bg-white border border-[#C85212] text-[#C85212] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 w-full">Request Swap</button>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button className="p-2 rounded-full hover:bg-gray-100"><Share2 className="w-4 h-4 text-gray-500" /></button>
            <button className="p-2 rounded-full hover:bg-gray-100"><Flag className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>
      </div>

      {/* Reviews Section (placeholder) */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Reviews</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border flex flex-col md:flex-row gap-4">
            <Image src="/Ellipse-2.png" alt="Reviewer" width={40} height={40} className="w-10 h-10 rounded-full border" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">Alice W.</span>
                <span className="text-xs text-gray-500">2 days ago</span>
                <span className="flex items-center ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </span>
              </div>
              <div className="text-sm text-gray-700">Great place, very clean and the host was super helpful. Would definitely recommend!</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border flex flex-col md:flex-row gap-4">
            <Image src="/Ellipse-1.png" alt="Reviewer" width={40} height={40} className="w-10 h-10 rounded-full border" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">Matt T.</span>
                <span className="text-xs text-gray-500">1 week ago</span>
                <span className="flex items-center ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </span>
              </div>
              <div className="text-sm text-gray-700">Perfect location and amenities. Responsive host. I hope to stay again soon!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Homes Carousel */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Related Homes</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {relatedProperties.length > 0 ? relatedProperties.map((rel: Property, i: number) => (
            <div key={rel._id || i} className="min-w-[220px] bg-white border rounded-lg shadow-sm">
              <Image src={rel.media?.coverPhoto || '/Estate2.png'} alt="Related Home" width={220} height={128} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-3">
                <div className="font-medium text-gray-900 text-sm mb-1">{rel.propertyDetails?.description?.slice(0, 30) || 'Related Home'}</div>
                <div className="text-xs text-gray-500 mb-1">{rel.location?.city || ''}, {rel.location?.country || ''}</div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Star className="w-3 h-3 text-yellow-400" /> 4.{i} (10 reviews)
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Home className="w-3 h-3" /> {rel.propertyDetails?.bedrooms || 3} beds
                  <User className="w-3 h-3" /> 5 guests
                </div>
              </div>
            </div>
          )) : [1,2,3,4].map(i => (
            <div key={i} className="min-w-[220px] bg-white border rounded-lg shadow-sm">
              <Image src="/Estate2.png" alt="Related Home" width={220} height={128} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-3">
                <div className="font-medium text-gray-900 text-sm mb-1">No {i}. luxury stylish home</div>
                <div className="text-xs text-gray-500 mb-1">{city}, {country}</div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Star className="w-3 h-3 text-yellow-400" /> 4.{i} (10 reviews)
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Home className="w-3 h-3" /> 3 beds
                  <User className="w-3 h-3" /> 5 guests
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSwapDetails; 