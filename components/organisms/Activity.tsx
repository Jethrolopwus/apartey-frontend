"use client";
import React from "react";
import { Eye, FileText } from "lucide-react";

export default function Activities() {
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

          {/* Activity Item */}
          <div className="bg-orange-50 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Eye className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Viewed Property
                    </h3>
                    <p className="text-sm text-gray-600">
                      Modern 2BR Apartment in Abuja
                    </p>
                    <p className="text-sm text-gray-600">
                      ₦1,200,500/Year • Wuse District
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    2 Hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
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
        </div>
      </div>
    </div>
  );
}
