"use client";
import React from "react";
import { Key, Euro, Handshake } from "lucide-react";
import { RecentCompleted } from "@/types/admin";

interface CompletedListing {
  id: string;
  propertyName: string;
  owner: string;
  completedDate: string;
  price: string;
  status: "Sold" | "Rented" | "Swapped";
  icon: "key" | "euro" | "handshake";
}

interface RecentCompletedListingsProps {
  recentCompleted?: RecentCompleted[];
}

const RecentCompletedListings: React.FC<RecentCompletedListingsProps> = ({ 
  recentCompleted = [] 
}) => {
  // Transform API data to component format
  const transformData = (apiData: RecentCompleted[]): CompletedListing[] => {
    return apiData.map((item) => {
      const getStatus = (category: string): "Sold" | "Rented" | "Swapped" => {
        switch (category.toLowerCase()) {
          case "sale":
            return "Sold";
          case "rent":
            return "Rented";
          case "swap":
            return "Swapped";
          default:
            return "Sold";
        }
      };

      const getIcon = (category: string): "key" | "euro" | "handshake" => {
        switch (category.toLowerCase()) {
          case "sale":
            return "key";
          case "rent":
            return "euro";
          case "swap":
            return "handshake";
          default:
            return "key";
        }
      };

      const getPrice = (item: RecentCompleted): string => {
        if (item.category.toLowerCase() === "swap") {
          return "Property swapped";
        }
        const currency = item.propertyDetails?.currency || "USD";
        const price = item.propertyDetails?.price || 0;
        return `${currency}${price.toLocaleString()}`;
      };

      return {
        id: item._id,
        propertyName: `${item.propertyType} in ${item.location?.country || "Unknown"}`,
        owner: item.lister?.firstName || "Unknown",
        completedDate: new Date(item.updatedAt).toLocaleDateString(),
        price: getPrice(item),
        status: getStatus(item.category),
        icon: getIcon(item.category)
      };
    });
  };

  // Use real data if available, otherwise use mock data
  const data = recentCompleted.length > 0 
    ? transformData(recentCompleted)
    : [
        {
          id: "1",
          propertyName: "Modern 3BR Apartment in Lagos",
          owner: "John D.",
          completedDate: "2025-01-28",
          price: "€185,000",
          status: "Sold" as const,
          icon: "key" as const
        },
        {
          id: "2",
          propertyName: "2BR Condo in Abuja",
          owner: "Sarah M.",
          completedDate: "2025-01-27",
          price: "€1500/month",
          status: "Rented" as const,
          icon: "euro" as const
        },
        {
          id: "3",
          propertyName: "Modern 3BR Apartment in Lagos",
          owner: "John D.",
          completedDate: "2025-01-28",
          price: "€185,000",
          status: "Sold" as const,
          icon: "key" as const
        },
        {
          id: "4",
          propertyName: "Studio in Accra",
          owner: "Mika J.",
          completedDate: "2025-01-27",
          price: "Property swapped",
          status: "Swapped" as const,
          icon: "handshake" as const
        },
        {
          id: "5",
          propertyName: "2BR Condo in Abuja",
          owner: "Sarah M.",
          completedDate: "2025-01-27",
          price: "€1500/month",
          status: "Rented" as const,
          icon: "euro" as const
        },
        {
          id: "6",
          propertyName: "Studio in Accra",
          owner: "Mika J.",
          completedDate: "2025-01-27",
          price: "Property swapped",
          status: "Swapped" as const,
          icon: "handshake" as const
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
        {data.map((listing) => (
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