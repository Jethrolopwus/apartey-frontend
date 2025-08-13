"use client";
import React, { useState } from "react";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data, isLoading, error } = useGetAllAdminUsersQuery({
    limit: pageSize,
    byId: undefined,
  });

  const users = data?.users || [];
  const totalPages = data?.pagination.totalPages || 1;
  const paginated = users.slice((page - 1) * pageSize, page * pageSize);

  const handleViewUser = (id: string) => {
    setSelectedUserId(id);
  };

  // const handleEditUser = (user: AdminUser) => {
  //   setSelectedUser(user);
  // };

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
      <div className="w-full max-w-[1440px] px-6 md:px-10 pt-2 pb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>
        
        {/* Search and Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search Users"
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

        {isLoading && <p>Loading users...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {!isLoading && !error && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                              <div className="text-sm font-semibold text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
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
                          <td className="py-4 px-6 text-sm text-gray-900">
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
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
