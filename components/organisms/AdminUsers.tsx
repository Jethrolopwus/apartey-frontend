"use client";
import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useGetAllAdminUsersQuery } from "@/Hooks/use-getAllAdminUsers.query";
import AdminViewUserModal from "@/app/admin/components/AdminViewUsersModal";
import AdminEditUserModal from "@/app/admin/components/AdminEditUserModal";
import AdminDeleteUserModal from "@/app/admin/components/AdminDeleteUserModal";
import { AdminUser } from "@/types/admin";

const typeColors: Record<string, string> = {
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

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
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
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A] mb-8">Users</h2>
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Users"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Eye className="w-5 h-5" />
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
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr className="text-[#2D3A4A] font-semibold text-base">
              <th className="py-4 px-4">USER</th>
              <th className="py-4 px-4">TYPE</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4">PROPERTIES</th>
              <th className="py-4 px-4">JOIN DATE</th>
              <th className="py-4 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-3 px-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-3 px-4 text-center text-red-500">
                  Error: {error.message}
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-3 px-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#2D3A4A]">
                      {user.fullName}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        typeColors[user.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[user.status.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.propertiesCount}</td>
                  <td className="py-3 px-4">{user.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Eye
                        className="w-5 h-5 text-gray-400 hover:text-[#2D3A4A] cursor-pointer"
                        onClick={() => handleViewUser(user.id)}
                      />
                      <Pencil
                        className="w-5 h-5 text-gray-400 hover:text-[#2D3A4A] cursor-pointer"
                        onClick={() => handleEditUser(user)}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-400 hover:text-red-600 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
          Next &gt;
        </button>
      </div>
    </div>
  );
}
