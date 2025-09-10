"use client";
import React, { useEffect } from "react";
import { Eye, FileText, Heart, Plus, CheckCircle } from "lucide-react";
import { useGetUserActivitiesQuery } from "@/Hooks/use-getUsersActivities.query";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { toast } from "react-hot-toast";


interface PropertyPrice {
  rent?: {
    monthly?: number;
    yearly?: number;
  };
  swap?: Record<string, unknown>;
  currency?: string;
}

interface Property {
  _id: string;
  title: string;
  price?: number | PropertyPrice;
  location: string;
  fullAddress: string;
}


export default function Activities() {
  const { data, isLoading, isError, error } = useGetUserActivitiesQuery();
  const { data: userProfileData } = useGetUserProfileQuery();

  // Determine which data source to use
  const activitiesToShow = (data?.activities && data.activities.length > 0) ? data.activities : userProfileData?.currentUser?.activityLog || [];

  useEffect(() => {
    if (data && data.message) {
      toast.success(data.message);
    }
  }, [data]);

  // Helper function to format price display
  const formatPrice = (price: number | PropertyPrice | undefined): string => {
    if (!price) return "";
    
    if (typeof price === 'number') {
      return `₦${price.toLocaleString()}`;
    }
    
    if (price.rent?.monthly) {
      const currency = price.currency || "NGN";
      return `${currency}${price.rent.monthly.toLocaleString()}`;
    }
    
    if (price.rent?.yearly) {
      const currency = price.currency || "NGN";
      return `${currency}${price.rent.yearly.toLocaleString()}`;
    }
    
    return "";
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Activities</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Recent Activity Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
            <button className="text-sm text-[#C85212] hover:text-[#A64310] transition-colors">
              Mark as Read
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 text-gray-500">Loading activities...</div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-8 text-red-500">{typeof error === 'object' && error && 'message' in error ? (error as { message?: string }).message : "Failed to load activities."}</div>
          )}

          {/* Activities List */}
          {activitiesToShow.length > 0 ? (
            <div className="space-y-4">
              {activitiesToShow.map((activity: string | { _id: string; type: string; read: boolean; timestamp: string; timeViewed: string; timeAgo: string; property: Property; message?: string }, idx: number) => {
                // Handle different data structures - activityLog might just be IDs
                if (typeof activity === 'string') {
                  // If activity is just an ID string, create a simple activity object
                  return (
                    <div key={activity || idx} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-1">
                                Property Activity
                              </h3>
                              <p className="text-sm text-gray-600">
                                Property ID: {activity.substring(0, 8)}...
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                              Recent
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Handle full activity objects - match the Figma design
                const getActivityTitle = (type: string) => {
                  switch (type) {
                    case "viewed_property":
                      return "Viewed Property";
                    case "listed_property":
                      return "Your Property has been Published";
                    case "published_property":
                      return "Your Property has been Published";
                    case "favorited_property":
                      return "Added to Favorites";
                    default:
                      return "Property Activity";
                  }
                };

                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case "viewed_property":
                      return <Eye className="w-4 h-4 text-orange-600" />;
                    case "listed_property":
                      return <Plus className="w-4 h-4 text-green-600" />;
                    case "favorited_property":
                      return <Heart className="w-4 h-4 text-red-600" />;
                    case "published_property":
                      return <CheckCircle className="w-4 h-4 text-green-600" />;
                    default:
                      return <Eye className="w-4 h-4 text-orange-600" />;
                  }
                };

                const getIconBackground = (type: string) => {
                  switch (type) {
                    case "viewed_property":
                      return "bg-orange-200";
                    case "listed_property":
                      return "bg-green-200";
                    case "favorited_property":
                      return "bg-red-200";
                    case "published_property":
                      return "bg-green-200";
                    default:
                      return "bg-orange-200";
                  }
                };

                return (
                  <div
                    key={activity._id || idx}
                    className={`rounded-lg p-4 border ${!activity.read ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 ${getIconBackground(activity.type)} rounded-full flex items-center justify-center`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {getActivityTitle(activity.type)}
                              {!activity.read && (
                                <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full align-middle">Unread</span>
                              )}
                            </h3>
                            {activity.property && (
                              <>
                                <p className="text-sm text-gray-800 font-semibold mb-1">
                                  {activity.property.title || "Property"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatPrice(activity.property.price)} • {activity.property.location || activity.property.fullAddress}
                                </p>
                              </>
                            )}
                            {activity.message && (
                              <p className="text-sm text-gray-600">
                                {activity.message}
                              </p>
                            )}
                          </div>
                          <div className="text-right min-w-fit ml-4">
                            <span className="block text-xs text-gray-500">
                              {activity.timeAgo || activity.timeViewed || (activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Recent")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && !isError && activitiesToShow.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4">
                <FileText className="w-8 h-8 text-[#C85212]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                That&apos;s all for now
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                More of your property views, searches, and interactions will
                appear here.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
