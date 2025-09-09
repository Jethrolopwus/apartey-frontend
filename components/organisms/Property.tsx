"use client";
import { useState, useEffect } from "react";
import { useGetAdminPropertiesQuery } from "@/Hooks/use-getAdminAllProperties.query";
import { useDeleteAdminPropertyById } from "@/Hooks/use-deleteAdminPropertyById.query";
import { useUpdateAdminPropertyById } from "@/Hooks/use-updateAdminProperty.query";
import { EyeIcon } from "@heroicons/react/24/outline";
import { ChevronLeft, ChevronRight, CirclePower } from "lucide-react";
import AdminViewPropertyModal from "@/app/admin/components/AdminViewPropertyModal";
import AdminDeletePropertyModal from "@/app/admin/components/AdminDeletePropertyModal";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  location: string;
  category: string;
  claimed: string;
  addedDate: string;
  status: string;
  lister: string;
  description: string;
}

export default function AdminPropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const limit = 10;

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const { data, isLoading, error, refetch } = useGetAdminPropertiesQuery({
    limit,
    page: currentPage,
    search: debouncedSearchTerm || undefined,
    sortBy: sortBy as "newest" | "oldest",
  });

  const {
    isPending: isUpdating,
    error: updateError,
  } = useUpdateAdminPropertyById();

  const { mutate: deleteProperty, isPending: isDeleting } =
    useDeleteAdminPropertyById();

  const properties = data?.properties || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProperty) {
      deleteProperty(selectedProperty.id, {
        onSuccess: () => {
          refetch();
          setIsDeleteModalOpen(false);
          setSelectedProperty(null);
          toast.success("Property deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting property: ${error.message}`);
        },
      });
    }
  };

  // const handleUpdateProperty = (data: Property) => {
  //   if (selectedProperty) {
  //     const payload = {
  //       id: selectedProperty.id,
  //       data: {
  //         title: data.title,
  //         type: data.type,
  //         price: data.price,
  //         location: data.location,
  //         status: data.status,
  //         lister: data.lister,
  //       },
  //     };
  //     console.log("Sending payload:", payload);
  //     updateProperty(payload, {
  //       onSuccess: () => {
  //         console.log("Property updated successfully:", data);
  //         refetch();
  //         setSelectedProperty(null);
  //         toast.success("Property updated successfully!");
  //       },
  //       onError: (error) => {
  //         console.error("Error updating property:", error.message);
  //         toast.error("Error updating property. Please try again.");
  //       },
  //     });
  //   }
  // };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProperty(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "for rent":
        return "bg-green-100 text-green-700";
      case "rented":
        return "bg-yellow-100 text-yellow-700";
      case "sold":
        return "bg-blue-100 text-blue-700";
      case "swapped":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const claimStatusColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <div>
      {/* Search and Sort Bar */}
      <div className="flex items-center justify-between p-2 rounded-md w-full bg-white mt-3">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search properties"
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

      {isLoading && (
        <p className="text-sm md:text-base">Loading properties...</p>
      )}
      {error && (
        <p className="text-red-500 text-sm md:text-base">
          Error: {error.message}
        </p>
      )}
      {isDeleting && (
        <p className="text-sm md:text-base">Deleting property...</p>
      )}
      {isUpdating && (
        <p className="text-sm md:text-base">Updating property...</p>
      )}
      {updateError && (
        <p className="text-red-500 text-sm md:text-base">
          Error: {updateError.message}
        </p>
      )}

      {!isLoading && !error && (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {property.title?.slice(0, 30) + "..."}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Added {property.addedDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleView(property as Property)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="View"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property as Property)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Deactivate"
                      disabled={isDeleting}
                    >
                      <CirclePower className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-1 text-gray-900 truncate block">
                      {property.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-1 text-gray-900 truncate block">
                      {property.price}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-1 text-gray-900 truncate block">
                      {property.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <span className="ml-1 text-gray-900 truncate block">
                      {property.lister}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PROPERTY
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CATEGORY
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LOCATION
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CLAIMED
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OWNER
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {property.title?.slice(0, 30) + "..."}
                          </div>
                          <div className="text-sm text-gray-500">
                            Added {property.addedDate}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 ">
                        {property.type}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 truncate max-w-[100px]">
                        {property.category}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 truncate max-w-[150px]">
                        {property.location}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {property.price}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`${
                            claimStatusColor[property.claimed]
                          } inline-flex px-3 py-1 text-xs font-medium rounded-full`}
                        >
                          {property.claimed}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 truncate max-w-[120px]">
                        {property.lister}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleView(property as Property)}
                            className="cursor-pointer text-gray-400 hover:text-gray-600"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(property as Property)}
                            className="cursor-pointer text-gray-400 hover:text-gray-600"
                            title="Deactivate"
                            disabled={isDeleting}
                          >
                            <CirclePower className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center space-x-1">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (page === 1 || page === totalPages) return true; // Always show first & last
                if (page >= currentPage - 1 && page <= currentPage + 1)
                  return true; 
                return false;
              })
              .map((page, idx, arr) => (
                <div key={page}>
                  
                  {idx > 0 && arr[idx] - arr[idx - 1] > 1 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded text-sm cursor-pointer ${
                      currentPage === page
                        ? "bg-[#C85212] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </>
      )}

      {/* View Modal */}
      <AdminViewPropertyModal
        property={selectedProperty}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
      />

      {/* Delete Confirmation Modal */}
      <AdminDeletePropertyModal
        property={selectedProperty}
        isOpen={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Modal */}
      {/* <AdminEditPropertyModal
        property={selectedProperty}
        isOpen={isEditModalOpen}
        onCancel={handleCloseEditModal}
        onSubmit={handleUpdateProperty}
      /> */}
    </div>
  );
}
