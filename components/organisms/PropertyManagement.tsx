// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useGetAdminPropertiesQuery } from "@/Hooks/use-getAdminAllProperties.query";
// import { useDeleteAdminPropertyById } from "@/Hooks/use-deleteAdminPropertyById.query";
// import { useUpdateAdminPropertyById } from "@/Hooks/use-updateAdminProperty.query";
// import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import AdminViewPropertyModal from "@/app/admin/components/AdminViewPropertyModal";
// import AdminDeletePropertyModal from "@/app/admin/components/AdminDeletePropertyModal";
// import AdminEditPropertyModal from "@/app/admin/components/AdminEditPropertyModal";
// import toast from "react-hot-toast";

// export interface Property {
//   id: string;
//   title: string;
//   type: string;
//   price: string;
//   location: string;
//   addedDate: string;
//   status: string;
//   lister: string;
//   description: string;
// }

// export default function AdminPropertiesPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(
//     null
//   );
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const limit = 10;
//   const router = useRouter();

//   const { data, isLoading, error, refetch } = useGetAdminPropertiesQuery({
//     limit,
//     byId: currentPage,
//   });

//   const {
//     mutate: updateProperty,
//     isPending: isUpdating,
//     error: updateError,
//   } = useUpdateAdminPropertyById();

//   const { mutate: deleteProperty, isPending: isDeleting } =
//     useDeleteAdminPropertyById();

//   const properties = data?.properties || [];
//   const totalPages = data?.totalPages || 1;
//   const currentPageFromApi = data?.currentPage || 1;

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       refetch();
//     }
//   };

//   const handleView = (property: Property) => {
//     setSelectedProperty(property);
//     setIsViewModalOpen(true);
//   };

//   const handleEdit = (property: Property) => {
//     setSelectedProperty(property);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = (property: Property) => {
//     setSelectedProperty(property);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (selectedProperty) {
//       deleteProperty(selectedProperty.id, {
//         onSuccess: () => {
//           refetch();
//           setIsDeleteModalOpen(false);
//           setSelectedProperty(null);
//           toast.success("Property deleted successfully!");
//         },
//         onError: (error) => {
//           toast.error(`Error deleting property: ${error.message}`);
//         },
//       });
//     }
//   };

//   const handleUpdateProperty = (data: Property) => {
//     if (selectedProperty) {
//       const payload = {
//         id: selectedProperty.id,
//         data: {
//           title: data.title,
//           type: data.type,
//           price: data.price,
//           location: data.location,
//           status: data.status,
//           lister: data.lister,
//         },
//       };
//       console.log("Sending payload:", payload);
//       updateProperty(payload, {
//         onSuccess: () => {
//           console.log("Property updated successfully:", data);
//           refetch();
//           setIsEditModalOpen(false);
//           setSelectedProperty(null);
//           toast.success("Property updated successfully!");
//         },
//         onError: (error) => {
//           console.error("Error updating property:", error.message);
//           toast.error("Error updating property. Please try again.");
//         },
//       });
//     }
//   };

//   const handleCloseViewModal = () => {
//     setIsViewModalOpen(false);
//     setSelectedProperty(null);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedProperty(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedProperty(null);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Available":
//         return "bg-green-200 text-green-800";
//       case "Rented":
//         return "bg-yellow-200 text-yellow-800";
//       case "Sold":
//         return "bg-blue-200 text-blue-800";
//       case "Swapped":
//         return "bg-red-200 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Properties</h1>

//       {isLoading && <p>Loading properties...</p>}
//       {error && <p className="text-red-500">Error: {error.message}</p>}
//       {isDeleting && <p>Deleting property...</p>}
//       {isUpdating && <p>Updating property...</p>}
//       {updateError && (
//         <p className="text-red-500">Error: {updateError.message}</p>
//       )}

//       {!isLoading && !error && (
//         <>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-200">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="py-2 px-4 border-b text-left">ID</th>
//                   <th className="py-2 px-4 border-b text-left">Title</th>
//                   <th className="py-2 px-4 border-b text-left">Added Date</th>
//                   <th className="py-2 px-4 border-b text-left">Type</th>
//                   <th className="py-2 px-4 border-b text-left">Location</th>
//                   <th className="py-2 px-4 border-b text-left">Price</th>
//                   <th className="py-2 px-4 border-b text-left">Status</th>
//                   <th className="py-2 px-4 border-b text-left">Lister</th>
//                   <th className="py-2 px-4 border-b text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {properties.map((property) => (
//                   <tr key={property.id} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border-b truncate max-w-[100px]">
//                       {property.id}
//                     </td>
//                     <td className="py-2 px-4 border-b truncate max-w-[150px]">
//                       {property.title}
//                     </td>
//                     <td className="py-2 px-4 border-b">{property.addedDate}</td>
//                     <td className="py-2 px-4 border-b">{property.type}</td>
//                     <td className="py-2 px-4 border-b">{property.location}</td>
//                     <td className="py-2 px-4 border-b">{property.price}</td>
//                     <td className="py-2 px-4 border-b">
//                       <span
//                         className={`inline-block px-2 py-1 rounded ${getStatusColor(
//                           property.status
//                         )}`}
//                       >
//                         {property.status}
//                       </span>
//                     </td>
//                     <td className="py-2 px-4 border-b">{property.lister}</td>
//                     <td className="py-2 px-4 border-b">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleView(property as Property)}
//                           className="p-1 text-blue-600 hover:text-blue-800"
//                           title="View"
//                         >
//                           <EyeIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(property as Property)}
//                           className="p-1 text-green-600 hover:text-green-800"
//                           title="Edit"
//                         >
//                           <PencilIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(property as Property)}
//                           className="p-1 text-red-600 hover:text-red-800"
//                           title="Delete"
//                           disabled={isDeleting}
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="mt-4 flex justify-center items-center space-x-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPageFromApi} of {totalPages}
//             </span>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}

//       {/* View Modal */}
//       <AdminViewPropertyModal
//         property={selectedProperty}
//         isOpen={isViewModalOpen}
//         onClose={handleCloseViewModal}
//       />

//       {/* Delete Confirmation Modal */}
//       <AdminDeletePropertyModal
//         property={selectedProperty}
//         isOpen={isDeleteModalOpen}
//         onCancel={handleCloseDeleteModal}
//         onConfirm={handleConfirmDelete}
//       />

//       {/* Edit Modal */}
//       <AdminEditPropertyModal
//         property={selectedProperty}
//         isOpen={isEditModalOpen}
//         onCancel={handleCloseEditModal}
//         onSubmit={handleUpdateProperty}
//       />
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAdminPropertiesQuery } from "@/Hooks/use-getAdminAllProperties.query";
import { useDeleteAdminPropertyById } from "@/Hooks/use-deleteAdminPropertyById.query";
import { useUpdateAdminPropertyById } from "@/Hooks/use-updateAdminProperty.query";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AdminViewPropertyModal from "@/app/admin/components/AdminViewPropertyModal";
import AdminDeletePropertyModal from "@/app/admin/components/AdminDeletePropertyModal";
import AdminEditPropertyModal from "@/app/admin/components/AdminEditPropertyModal";
import toast from "react-hot-toast";

export interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  location: string;
  addedDate: string;
  status: string;
  lister: string;
  description: string;
}

export default function AdminPropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const limit = 10;
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetAdminPropertiesQuery({
    limit,
    byId: currentPage,
  });

  const {
    mutate: updateProperty,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateAdminPropertyById();

  const { mutate: deleteProperty, isPending: isDeleting } =
    useDeleteAdminPropertyById();

  const properties = data?.properties || [];
  const totalPages = data?.totalPages || 1;
  const currentPageFromApi = data?.currentPage || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
    }
  };

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
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

  const handleUpdateProperty = (data: Property) => {
    if (selectedProperty) {
      const payload = {
        id: selectedProperty.id,
        data: {
          title: data.title,
          type: data.type,
          price: data.price,
          location: data.location,
          status: data.status,
          lister: data.lister,
        },
      };
      console.log("Sending payload:", payload); // Debug payload
      updateProperty(payload, {
        onSuccess: () => {
          console.log("Property updated successfully:", data);
          refetch();
          setIsEditModalOpen(false);
          setSelectedProperty(null);
          toast.success("Property updated successfully!");
        },
        onError: (error) => {
          console.error("Error updating property:", error.message);
          toast.error("Error updating property. Please try again.");
        },
      });
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-200 text-green-800";
      case "Rented":
        return "bg-yellow-200 text-yellow-800";
      case "Sold":
        return "bg-blue-200 text-blue-800";
      case "Swapped":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Management</h1>
      <div className="flex justify-between items-center mb-6">
        <button className="px-5 py-2 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          All Properties
        </button>
        <button
          className="px-5 py-2 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          onClick={() => router.push("/admin/admin-property-claim")}
        >
          Property Claims
        </button>
      </div>
      <div className="flex items-center justify-between border-b border-gray-200 mb-6 w-full">
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

      {isLoading && <p>Loading properties...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {isDeleting && <p>Deleting property...</p>}
      {isUpdating && <p>Updating property...</p>}
      {updateError && (
        <p className="text-red-500">Error: {updateError.message}</p>
      )}

      {!isLoading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Added Date</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">Location</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Lister</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b truncate max-w-[100px]">
                      {property.id}
                    </td>
                    <td className="py-2 px-4 border-b truncate max-w-[150px]">
                      {property.title}
                    </td>
                    <td className="py-2 px-4 border-b">{property.addedDate}</td>
                    <td className="py-2 px-4 border-b">{property.type}</td>
                    <td className="py-2 px-4 border-b">{property.location}</td>
                    <td className="py-2 px-4 border-b">{property.price}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`inline-block px-2 py-1 rounded ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{property.lister}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(property as Property)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(property as Property)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(property as Property)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                          disabled={isDeleting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPageFromApi} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
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
      <AdminEditPropertyModal
        property={selectedProperty}
        isOpen={isEditModalOpen}
        onCancel={handleCloseEditModal}
        onSubmit={handleUpdateProperty}
      />
    </div>
  );
}
