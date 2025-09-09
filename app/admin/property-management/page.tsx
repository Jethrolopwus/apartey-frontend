"use client";
import { useState } from "react";
import AdminPropertiesPage from "@/components/organisms/Property";
import AdminClaimProperty from "@/components/organisms/AdminClaimProperty";

export default function AdminPropertyManagement() {
  const [activeTab, setActiveTab] = useState<"properties" | "claims">(
    "properties"
  );

  return (
    <div className="w-full mt-4">
      
        <h1 className="text-xl font-semibold text-[#2D3A4A]">
          Property Management
        </h1>

        <div className="flex bg-[#ECECF0] p-0.5 rounded-full my-4 md:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("properties")}
            className={`flex-1 px-3 md:px-5 py-2 text-sm cursor-pointer md:text-base font-semibold border border-gray-200 rounded-l-full whitespace-nowrap transition-all duration-200 ${
              activeTab === "properties"
                ? "text-black bg-white shadow-sm"
                : "text-black bg-[#ECECF0] hover:bg-gray-100"
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`flex-1 px-3 md:px-5 py-2 text-sm cursor-pointer md:text-base font-semibold border border-gray-200 rounded-r-full whitespace-nowrap transition-all duration-200 ${
              activeTab === "claims"
                ? "text-black bg-white shadow-sm"
                : "text-black bg-gray-200 hover:bg-gray-100"
            }`}
          >
            Property Claims
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "properties" && <AdminPropertiesPage />}
          {activeTab === "claims" && <AdminClaimProperty />}
        </div>
      </div>
    
  );
}
