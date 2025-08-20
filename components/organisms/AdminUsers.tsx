"use client";
import React, { useState, useEffect } from "react";
import { Eye, CirclePower } from "lucide-react";
import { useGetAllAdminUsersQuery } from "@/Hooks/use-getAllAdminUsers.query";
import AdminViewUserModal from "@/app/admin/components/AdminViewUsersModal";
import AdminEditUserModal from "@/app/admin/components/AdminEditUserModal";
import AdminDeleteUserModal from "@/app/admin/components/AdminDeleteUserModal";
import { AdminUser } from "@/types/admin";

const typeColors: Record<string, string> = {
  landlord: "bg-blue-100 text-blue-700",
  developer: "bg-purple-100 text-purple-700",
  tenant: "bg-pink-100 text-pink-700",
  agent: "bg-blue-100 text-blue-700",
  renter: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-yellow-100 text-yellow-700",
};

const pageSize = 6;

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const { data, isLoading, error } = useGetAllAdminUsersQuery({
    limit: pageSize,
    byId: undefined,
    search: debouncedSearchTerm || undefined,
    sort: sortBy as "newest" | "oldest"
  });

  const users = data?.users || [];
  const totalPages = data?.pagination.totalPages || 1;
  const paginated = users.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleViewUser = (id: string) => {
    setSelectedUserId(id);
  };

  const handleDeleteUser = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Users</h1>
        
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6">
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
            <select 
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-200 rounded-lg px-2 md:px-3 py-2 bg-white text-gray-700 text-xs md:text-sm focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {isLoading && <p className="text-sm md:text-base">Loading users...</p>}
        {error && <p className="text-red-500 text-sm md:text-base">Error: {error.message}</p>}

        {!isLoading && !error && (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginated.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <p className="text-gray-500 text-sm">No users found</p>
                </div>
              ) : (
                paginated.map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
                          onClick={() => handleDeleteUser(user.id)}
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
                            typeColors[user.role.toLowerCase()] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[user.status.toLowerCase()] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Properties:</span>
                        <span className="ml-1 text-gray-900">{user.propertiesCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Joined:</span>
                        <span className="ml-1 text-gray-900 truncate block">{user.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      paginated.map((user) => (
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
                                typeColors[user.role.toLowerCase()] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                statusColors[user.status.toLowerCase()] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                                className="text-gray-400 hover:text-gray-600"
                                title="View"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-gray-400 hover:text-gray-600"
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
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-sm md:text-base"
              >
                Previous
              </button>
              <span className="text-sm md:text-base">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-sm md:text-base"
              >
                Next
              </button>
            </div>
          </>
        )}

        <AdminViewUserModal userId={selectedUserId} onClose={handleCloseModal} />
        <AdminEditUserModal user={selectedUser} onClose={handleCloseModal} />
        <AdminDeleteUserModal
          userId={isDeleteModalOpen ? selectedUserId : null}
          userName={
            isDeleteModalOpen
              ? users.find((u) => u.id === selectedUserId)?.fullName || null
              : null
          }
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
