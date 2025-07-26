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

  const [activeTab, setActiveTab] = useState<"all" | "claims">("claims");
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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // New state for reject modal
  const [rejectClaimId, setRejectClaimId] = useState<string | null>(null); // New state for reject ID

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
          setIsModalOpen(false); // Close modal on success
          setSelectedClaimId(null); // Reset selected claim
        },
      }
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReject = (id: string) => {
    updateClaimMutation.mutate(
      { id, action: "rejected" },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedClaimId(null);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
      <div className="">
        <h2 className="text-xl font-semibold text-[#2D3A4A] mb-8">
          Property Management
        </h2>
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl gap-2 px-2 py-1 shadow-sm">
          <button
            className={`px-5 py-2 cursor-pointer rounded-lg text-base font-semibold transition-colors text-gray-500 hover:bg-gray-50`}
            onClick={() => setActiveTab("all")}
          >
            All Properties
          </button>
          <button
            className={`px-5 py-2 cursor-pointer rounded-lg text-base font-semibold transition-colors ${
              activeTab === "claims"
                ? "bg-[#2D3A4A] text-white shadow"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("claims")}
          >
            Property Claims
          </button>
        </div>
      </div>
      <div className="flex items-center mt-4 justify-between border-b border-gray-200 mb-6 w-full">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search properties"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-base"
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
          <span className="text-gray-500 text-sm">Sort by</span>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {paginated.map((claim) => (
          <div
            key={claim.id}
            className="bg-[#FCFCFC] rounded-2xl border border-gray-100 p-6 flex flex-col gap-2"
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
                        onClick={() => handleOpenRejectModal(claim.id)} // Changed to open modal
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
            <div className="text-sm text-gray-700 mb-1">{claim.message}</div>
            <div className="text-xs text-gray-400 mb-2">
              Attached: {claim.proof ? "1 file(s)" : "0 file(s)"}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="text-gray-400 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &lt; Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-[#2D3A4A] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="text-gray-400 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next {">"}
        </button>
      </div>
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
  );
}
