"use client";
import React, { useState, useEffect } from "react";
import { Eye, CirclePower, ChevronRight, ChevronLeft } from "lucide-react";
import { useGetAllAdminUsersQuery } from "@/Hooks/use-getAllAdminUsers.query";
import AdminViewUserModal from "@/app/admin/components/AdminViewUsersModal";
import AdminFlagUserModal from "@/app/admin/components/AdminFlagUserModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeColors: Record<string, string> = {
  homeowner: "bg-[#DBEAFE] text-[#193CB8]",
  agent: "bg-[#F3E8FF] text-[#6E11B0]",
  renter: "bg-[#FCE7F3] text-[#A3004C]",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-yellow-100 text-yellow-700",
};

const pageSize = 10;

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page when searching
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const { data, isLoading, error } = useGetAllAdminUsersQuery({
    page,
    limit: pageSize,
    search: debouncedSearchTerm || undefined,
    sort: sortBy as "newest" | "oldest",
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleViewUser = (id: string) => {
    setSelectedUserId(id);
    setViewModalOpen(true);
  };

  const handleFlagUser = (id: string) => {
    setSelectedUserId(id);
    setFlagModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedUserId(null);
    setViewModalOpen(false);
    setFlagModalOpen(false);
  };
 
    if (isLoading) {
    return (
      <div className="w-full mt-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>

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
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A]">Users</h2>

      {/* Search and Sort Bar */}
      <div className="flex items-center justify-between p-2 rounded-md w-full bg-white mt-3">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearchChange}
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
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

     
      {error && (
        <p className="text-red-500 text-sm md:text-base">
          Error: {(error as Error).message}
        </p>
      )}

      {!isLoading && !error && (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {users.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-500 text-sm">No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFlagUser(user.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Deactivate"
                      >
                        <CirclePower className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span
                        className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          typeColors[user.role.toLowerCase()] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[user.status.toLowerCase()] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Properties:</span>
                      <span className="ml-1 text-gray-900">
                        {user.propertiesCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Joined:</span>
                      <span className="ml-1 text-gray-900 truncate block">
                        {user.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USER
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PROPERTIES
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JOIN DATE
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 px-6 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              typeColors[user.role.toLowerCase()] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              statusColors[user.status.toLowerCase()] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {user.propertiesCount}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900 truncate max-w-[120px]">
                          {user.createdAt}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewUser(user.id)}
                              className="text-gray-400 !cursor-pointer hover:text-gray-600"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                handleFlagUser(user.id);
                                setStatus(user.status);
                              }}
                              className="text-gray-400 !cursor-pointer hover:text-gray-600"
                              title="Deactivate"
                            >
                              <CirclePower className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-1">
              {/* Previous button */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded disabled:opacity-50 flex items-center text-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page numbers with ellipsis */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (p === 1 || p === pagination.totalPages) return true;
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
                disabled={page >= pagination.totalPages}
                className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}

      {viewModalOpen && (
        <AdminViewUserModal
          userId={selectedUserId}
          onClose={handleCloseModals}
        />
      )}

      {flagModalOpen && (
        <AdminFlagUserModal
          userId={selectedUserId}
          status={status}
          userName={
            users.find((u) => u.id === selectedUserId)?.fullName || null
          }
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
}
