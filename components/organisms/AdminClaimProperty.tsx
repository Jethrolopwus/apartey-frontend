"use client";
import React, { useEffect, useState } from "react";
import { useGetAdminClaimPropertyQuery } from "@/Hooks/use-getAllAdminClaimProperty.query";
import { useGetAdminClaimPropertyDetailsByIdQuery } from "@/Hooks/use-getAdminClaimPropertyDetails.query";
import AdminPropertyClaimModal from "@/app/admin/components/AdminPropertyClaimModal";
import { useUpdateAdminClaimApprovedPropertyById } from "@/Hooks/use-updateAdminClaimApproveProperty.query";
import { AdminClaimedProperty } from "@/types/admin";
import { useUpdateAdminClaimRejectPropertyById } from "@/Hooks/use-updateAdminClaimRejectProperty.query";
import AdminPropertyClaimRejectModal from "@/app/admin/components/AdminPropertyClaimRejectModal";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPinIcon,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const pageSize = 10;

export default function AdminClaimProperty() {
  const updateClaimMutation = useUpdateAdminClaimApprovedPropertyById();
  const rejectClaimMutation = useUpdateAdminClaimRejectPropertyById();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const { data, isLoading, error, refetch } = useGetAdminClaimPropertyQuery({
    page,
    limit: pageSize,
    search: debouncedSearchTerm,
    sortBy: sortBy as "newest" | "oldest",
  });
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const { data: claimDetails } = useGetAdminClaimPropertyDetailsByIdQuery(
    selectedClaimId || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectClaimId, setRejectClaimId] = useState<string | null>(null);
  const [rejectPropertyId, setRejectPropertyId] = useState<string | null>(null);
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

  const handleOpenRejectModal = (claimId: string, propertyId: string) => {
    setRejectClaimId(claimId);
    setRejectPropertyId(propertyId);
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectClaimId(null);
  };

  const handleRejectConfirm = (
    claimId: string | null,
    propertyId: string | null,
    reason: string
  ) => {
    if (rejectClaimId) {
      rejectClaimMutation.mutate(
        {
          claimId: claimId as string,
          propertyId: propertyId as string,
          data: { reason },
        },
        {
          onSuccess: () => {
            handleCloseRejectModal();
            refetch();
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

  const handleApprove = (claimId: string, propertyId: string) => {
    updateClaimMutation.mutate(
      { claimId, propertyId },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedClaimId(null);
        },
      }
    );
  };

  const renderClaims = () => {
    if (error)
      return (
        <p className="text-red-500 text-sm md:text-base">
          Error: {error.message}
        </p>
      );
    if (isLoading) {
      return (
        <div className="w-full mt-4">
          <div className="animate-pulse">

            <div className="flex justify-between items-center">
              <div className="h-11 mt2 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="h-11 mt2 bg-gray-200 rounded w-48 mb-8"></div>
            </div>
            <div className="flex flex-col space-y-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="bg-gray-200 w-full h-10"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <>
        {/* Claims Cards */}
        <div className="space-y-4 mt-4">
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
                    <span>
                      {" "}
                      <MapPinIcon
                        className="inline-flex -mt-1 mr-1"
                        size={14}
                      />{" "}
                      {claim.address}
                    </span>
                    <span>
                      {" "}
                      <User className="inline-flex -mt-1 mr-1" size={14} />{" "}
                      Claimed by: {claim.claimant}
                    </span>
                    <span>
                      {" "}
                      <Calendar className="inline-flex -mt-1 mr-1" size={14} />
                      {claim.date}
                    </span>
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
                      className="px-4 py-1 cursor-pointer text-sm rounded-lg border border-gray-200 text-[#C85212] font-semibold hover:bg-gray-50"
                      onClick={() => handleViewDetails(claim.id)}
                    >
                      View Details
                    </button>
                    {claim.status === "pending" && (
                      <>
                        <button
                          className="px-4 py-1 text-sm rounded-lg bg-[#C85212] cursor-pointer text-white font-semibold hover:bg-[#a63e0a] disabled:opacity-50"
                          onClick={() =>
                            handleApprove(claim.id, claim.propertyId)
                          }
                          disabled={updateClaimMutation.isPending}
                        >
                          {updateClaimMutation.isPending
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          className="px-4 py-1 text-sm rounded-lg border cursor-pointer border-gray-200 text-gray-700  bg-[#ECECEC] font-semibold hover:bg-gray-50 disabled:opacity-50"
                          onClick={() =>
                            handleOpenRejectModal(claim.id, claim.propertyId)
                          }
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
              <div className="text-sm text-gray-700 mb-1">
                {(claim as AdminClaimedProperty).message}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Attached: {claim.proof ? "1 file(s)" : "0 file(s)"}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded disabled:opacity-50 flex items-center text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page numbers with ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (p === 1 || p === totalPages) return true;
              if (p >= page - 1 && p <= page + 1) return true;
              return false;
            })
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx] - arr[idx - 1] > 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded text-sm cursor-pointer ${
                    page === p
                      ? "bg-[#C85212] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}

          {/* Next button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="w-full mt-4">
      {/* Search and Sort Bar */}
      <div className="flex items-center justify-between p-2 rounded-md w-full bg-white mt-3">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[140px] border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm focus:outline-none">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="status-pending">Pending</SelectItem>
              <SelectItem value="status-approved">Approved</SelectItem>
              <SelectItem value="status-rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
        propertyId={rejectPropertyId}
        isLoading={rejectClaimMutation.isPending}
      />
    </div>
  );
}
