"use client";
import React, { useEffect } from "react";
import { Eye, FileText } from "lucide-react";
import { useGetUserActivitiesQuery } from "@/Hooks/use-getUsersActivities.query";
import { toast } from "react-hot-toast";

export default function Activities() {
  const { data, isLoading, isError, error } = useGetUserActivitiesQuery();

  useEffect(() => {
    if (data && data.message) {
      toast.success(data.message);
    }
  }, [data]);

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
            <div className="text-center py-8 text-red-500">{(error as any)?.message || "Failed to load activities."}</div>
          )}

          {/* Activities List */}
          {data && data.activities && data.activities.length > 0 ? (
            <div>
              {data.activities.map((activity: any, idx: number) => {
                if (activity.type === "viewed_property" && activity.property) {
                  return (
                    <div
                      key={activity._id || idx}
                      className={`rounded-lg p-4 mb-8 ${!activity.read ? "bg-orange-100 border-l-4 border-orange-400" : "bg-orange-50"}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-1">
                                Viewed Property
                                {!activity.read && (
                                  <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full align-middle">Unread</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-800 font-semibold">
                                {activity.property.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.property.fullAddress}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.property.location}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.property.price ? `₦${activity.property.price.toLocaleString()}` : ""}
                              </p>
                            </div>
                            <div className="text-right min-w-fit ml-4">
                              <span className="block text-xs text-gray-500">
                                {activity.timeViewed ? activity.timeViewed : ""}
                              </span>
                              <span className="block text-xs text-gray-500">
                                {activity.timeAgo ? activity.timeAgo : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                // Fallback for other activity types
                return (
                  <div key={activity._id || idx} className="bg-orange-50 rounded-lg p-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {activity.title || "Activity"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {activity.description || "No description"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {activity.timeAgo || activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && !isError ? (
            // Empty State
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4">
                <FileText className="w-8 h-8 text-[#C85212]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                That's all for now
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
