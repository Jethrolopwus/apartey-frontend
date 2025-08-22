"use client";
import React from "react";
import { Key, Euro, Handshake } from "lucide-react";

interface CompletedListing {
  id: string;
  propertyName: string;
  owner: string;
  completedDate: string;
  price: string;
  status: "Sold" | "Rented" | "Swapped";
  icon: "key" | "euro" | "handshake";
}

const mockData: CompletedListing[] = [
  {
    id: "1",
    propertyName: "Modern 3BR Apartment in Lagos",
    owner: "John D.",
    completedDate: "2025-01-28",
    price: "€185,000",
    status: "Sold",
    icon: "key"
  },
  {
    id: "2",
    propertyName: "2BR Condo in Abuja",
    owner: "Sarah M.",
    completedDate: "2025-01-27",
    price: "€1500/month",
    status: "Rented",
    icon: "euro"
  },
  {
    id: "3",
    propertyName: "Modern 3BR Apartment in Lagos",
    owner: "John D.",
    completedDate: "2025-01-28",
    price: "€185,000",
    status: "Sold",
    icon: "key"
  },
  {
    id: "4",
    propertyName: "Studio in Accra",
    owner: "Mika J.",
    completedDate: "2025-01-27",
    price: "Property swapped",
    status: "Swapped",
    icon: "handshake"
  },
  {
    id: "5",
    propertyName: "2BR Condo in Abuja",
    owner: "Sarah M.",
    completedDate: "2025-01-27",
    price: "€1500/month",
    status: "Rented",
    icon: "euro"
  },
  {
    id: "6",
    propertyName: "Studio in Accra",
    owner: "Mika J.",
    completedDate: "2025-01-27",
    price: "Property swapped",
    status: "Swapped",
    icon: "handshake"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Sold":
      return "bg-blue-100 text-blue-700";
    case "Rented":
      return "bg-green-100 text-green-700";
    case "Swapped":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getIcon = (iconType: string) => {
  switch (iconType) {
    case "key":
      return <Key className="w-5 h-5 text-gray-600" />;
    case "euro":
      return <Euro className="w-5 h-5 text-gray-600" />;
    case "handshake":
      return <Handshake className="w-5 h-5 text-gray-600" />;
    default:
      return <Key className="w-5 h-5 text-gray-600" />;
  }
};

const RecentCompletedListings: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Recent Completed Listings
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Latest successfully completed property transactions
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {mockData.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
                          <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {getIcon(listing.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                    {listing.propertyName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Owner: {listing.owner}, Completed: {listing.completedDate}
                  </p>
                  <p className="text-xs font-medium text-gray-700 mt-1">
                    {listing.price}
                  </p>
                </div>
              </div>
            <div className="flex-shrink-0 ml-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  listing.status
                )}`}
              >
                {listing.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCompletedListings; 