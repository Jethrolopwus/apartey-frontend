"use client";
import React, { useState } from "react";
import { useGetAdminClaimPropertyQuery } from "@/Hooks/use-getAllAdminClaimProperty.query";
import { useGetAdminClaimPropertyDetailsByIdQuery } from "@/Hooks/use-getAdminClaimPropertyDetails.query";
import AdminPropertyClaimModal from "@/app/admin/components/AdminPropertyClaimModal";
import { useUpdateAdminClaimApprovedPropertyById } from "@/Hooks/use-updateAdminClaimApproveProperty.query";
import { AdminClaimedProperty } from "@/types/admin";
import { useUpdateAdminClaimRejectPropertyById } from "@/Hooks/use-updateAdminClaimRejectProperty.query";
import AdminPropertyClaimRejectModal from "@/app/admin/components/AdminPropertyClaimRejectModal";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const pageSize = 6;

export default function AdminClaimProperty() {
  const updateClaimMutation = useUpdateAdminClaimApprovedPropertyById();
  const rejectClaimMutation = useUpdateAdminClaimRejectPropertyById();

  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetAdminClaimPropertyQuery({
    page,
    limit: pageSize,
  });
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const { data: claimDetails } = useGetAdminClaimPropertyDetailsByIdQuery(
    selectedClaimId || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectClaimId, setRejectClaimId] = useState<string | null>(null);

  const claims = data?.claims || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const paginated = claims.slice((page - 1) * pageSize, page * pageSize);

  const handleViewDetails = (id: string) => {
    setSelectedClaimId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClaimId(null);
  };

  const handleOpenRejectModal = (id: string) => {
    setRejectClaimId(id);
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectClaimId(null);
  };

  const handleRejectConfirm = () => {
    if (rejectClaimId) {
      rejectClaimMutation.mutate(
        { id: rejectClaimId, data: { status: "rejected" } },
        {
          onSuccess: () => {
            handleCloseRejectModal();
          },
          onError: (error) => {
            console.error("Reject failed:", error.message);
          },
        }
      );
    }
  };

  const transformedClaim: AdminClaimedProperty | undefined = claimDetails
    ? {
        id: claimDetails._id,
        propertyDescription:
          claimDetails.property?.propertyDetails?.description || "",
        propertyId: claimDetails.property?._id || "",
        address: claimDetails.property?.location?.fullAddress || "",
        claimant: claimDetails.claimant
          ? `${claimDetails.claimant.firstName || ""} ${
              claimDetails.claimant.lastName || ""
            } (${claimDetails.claimant.email || "example@email.com"})`
          : claimDetails.fullName || "",
        date: claimDetails.createdAt || "",
        status: claimDetails.status || "pending",
        message: claimDetails.additionalInfo || "",
        proof: claimDetails.cadastralNumber || "",
      }
    : undefined;

  const handleApprove = (id: string) => {
    updateClaimMutation.mutate(
      { id, action: "approved" },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedClaimId(null);
        },
      }
    );
  };



  const renderClaims = () => {
    if (isLoading) return <p className="text-sm md:text-base">Loading claims...</p>;
    if (error) return <p className="text-red-500 text-sm md:text-base">Error: {error.message}</p>;
    
    return (
      <>
        {/* Claims Cards */}
        <div className="space-y-4">
          {paginated.map((claim: AdminClaimedProperty) => (
            <div
              key={claim.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#2D3A4A]">
                    {claim.propertyDescription}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 mb-1">
                    <span>📍 {claim.address}</span>
                    <span>👤 Claimed by: {claim.claimant}</span>
                    <span>{claim.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[180px]">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                      statusColors[claim.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {claim.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1 rounded-lg border border-gray-200 text-[#C85212] font-semibold hover:bg-gray-50"
                      onClick={() => handleViewDetails(claim.id)}
                    >
                      View Details
                    </button>
                    {claim.status === "pending" && (
                      <>
                        <button
                          className="px-4 py-1 rounded-lg bg-[#C85212] text-white font-semibold hover:bg-[#a63e0a] disabled:opacity-50"
                          onClick={() => handleApprove(claim.id)}
                          disabled={updateClaimMutation.isPending}
                        >
                          {updateClaimMutation.isPending
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          className="px-4 py-1 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handleOpenRejectModal(claim.id)}
                          disabled={
                            updateClaimMutation.isPending ||
                            rejectClaimMutation.isPending
                          }
                        >
                          {updateClaimMutation.isPending
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-1">{(claim as AdminClaimedProperty).message}</div>
              <div className="text-xs text-gray-400 mb-2">
                Attached: {claim.proof ? "1 file(s)" : "0 file(s)"}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>
          
          {/* Always show Page 1 */}
          <button
            onClick={() => setPage(1)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              page === 1 
                ? "bg-[#C85212] text-white border border-[#C85212]" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            1
          </button>
          
          {/* Show additional pages only when there are multiple pages */}
          {totalPages > 1 && Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((number) => (
            <button
              key={number}
              onClick={() => setPage(number)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                page === number 
                  ? "bg-[#C85212] text-white border border-[#C85212]" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page + 1)}
            disabled={totalPages <= 1 || page === totalPages}
          >
            Next →
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Property Management</h1>
        
        {/* Navigation Tabs */}
        <div className="flex mb-4 md:mb-6 overflow-x-auto">
          <button
            className="flex-1 px-3 md:px-5 py-2 text-sm md:text-base font-semibold text-gray-400 bg-gray-200 border border-gray-200 rounded-l-full hover:bg-gray-100 whitespace-nowrap transition-all duration-200"
          >
            All Properties
          </button>
          <button
            className="flex-1 px-3 md:px-5 py-2 text-sm md:text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-r-full shadow-sm hover:bg-gray-50 whitespace-nowrap transition-all duration-200"
          >
            Property Claims
          </button>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search properties"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-sm md:text-base"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs md:text-sm">Sort by</span>
            <select className="border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm focus:outline-none">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {renderClaims()}

        <AdminPropertyClaimModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          claim={transformedClaim}
        />

        <AdminPropertyClaimRejectModal
          isOpen={isRejectModalOpen}
          onClose={handleCloseRejectModal}
          onConfirm={handleRejectConfirm}
          claimId={rejectClaimId}
        />
      </div>
    </div>
  );
}
