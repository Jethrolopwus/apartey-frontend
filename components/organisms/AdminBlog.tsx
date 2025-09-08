"use client";
import React, { useState, useEffect } from "react";
import {
  Archive,
  Plus,
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Eye,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetAdminAllBlogPostQuery } from "@/Hooks/use-getAdminAllBlogPost.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AdminPost } from "@/types/admin";
import DeleteBlogPostModal from "@/app/admin/components/DeleteBlogPostModal";
import { useArchiveAdminBlogPostMutation } from "@/Hooks/use-archiveAdminBlogPost.mutation ";

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-700",
};

export default function AdminBlog() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostForDelete, setSelectedPostForDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

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

  // Reset page when sort or status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedStatus]);

  // Fetch blog posts with search, sort, and pagination
  const mapSort = (sort: string) => {
    switch (sort) {
      case "newest":
        return { sortBy: "createdAt", order: "desc" };
      case "oldest":
        return { sortBy: "createdAt", order: "asc" };
      case "most-liked":
        return { sortBy: "likesCount", order: "desc" };
      case "most-viewed":
        return { sortBy: "views", order: "desc" };
      default:
        return { sortBy: "createdAt", order: "desc" };
    }
  };

  const { sortBy: apiSortBy, order: apiOrder } = mapSort(sortBy);

  const {
    data: blogPostsData,
    isLoading,
    error,
  } = useGetAdminAllBlogPostQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    sortBy: apiSortBy,
    order: apiOrder as "asc" | "desc",
    status:
      selectedStatus !== "all"
        ? (selectedStatus.toLowerCase() as "published" | "draft")
        : undefined,
  });

  const { mutate } =
    useArchiveAdminBlogPostMutation();

  const handleDelete = (post: AdminPost) => {
    setSelectedPostForDelete({ id: post._id, title: post.title });
    setDeleteModalOpen(true);
  };

  const handleArchive = (post: AdminPost) => {
    mutate(post._id);
  };

  const handleView = (post: AdminPost) => {
    router.push(`/admin/blog/${post._id}`);
  };

  const handleEdit = (post: AdminPost) => {
    router.push(`/admin/blog/edit/${post._id}`);
  };

  const handleNewPost = () => {
    router.push("/admin/blog/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-transparent p-0 mt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-transparent p-0 mt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error loading blog posts. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const pagination = blogPostsData?.pagination;
  const posts = blogPostsData?.posts || [];

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A]">Blog Management</h2>
      <div className="flex w-full  justify-end">
        <button
          onClick={handleNewPost}
          className="flex items-center gap-2 bg-[#C85212] text-white text-sm px-3 py-1.5 mt-2 rounded-lg shadow hover:bg-[#a63e0a] transition-colors"
        >
          <Plus size={12} />
          New Post
        </button>
      </div>
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between p-2 rounded-md w-full bg-white mt-3">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none placeholder-gray-400 text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Sort by</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[180px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="mt-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-md shadow p-8 text-center">
            <div className="text-gray-500 text-lg">No blog posts found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first blog post to get started"}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-md shadow p-6 flex gap-6 items-start"
              >
                <Image
                  src={post.imageUrl || "/HouseRent.png"}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="w-32 h-32 object-cover rounded-xl border border-gray-100"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#2D3A4A] leading-tight">
                      {post.title}
                    </h3>
                    {post.archived ? (
                      <span
                        className={`ml-auto px-3 py-2 rounded-full text-xs font-semibold bg-gray-200 `}
                      >
                        Archived
                      </span>
                    ) : (
                      <span
                        className={`ml-auto px-3 py-2 rounded-full text-xs font-semibold ${
                          statusColors[post.status]
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    )}
                  </div>

                  <div
                    className="text-sm text-[#151D48] mb-2"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                    <div className="font-semibold">
                      <User className="inline-flex -mt-1 mr-1" size={14} />
                      {post.author?.firstName.charAt(0).toUpperCase() +
                        post.author?.firstName.slice(1)}
                    </div>

                    <div>
                      <Calendar className="inline-flex -mt-1 mr-1" size={14} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <span>{post.category}</span>
                    <div>
                      <Eye className="inline-flex -mt-1 mr-1" size={14} />
                      {post.views}
                    </div>
                    <div>
                      <Heart className="inline-flex -mt-1 mr-1" size={14} />
                      {post.likesCount}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="border border-[#E5E7EB] rounded-[12px] text-gray-500 p-[4px_12px] text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(post)}
                        className="px-4 py-1 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-4 py-1 rounded-lg cursor-pointer border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      {!post.archived && (
                        <button
                          onClick={() => handleArchive(post)}
                          className="px-4 py-1 rounded-lg border  cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post)}
                        className="px-4 py-1 rounded-lg cursor-pointer border border-red-200 text-red-700 text-sm hover:bg-red-50 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mb-2">
                    {post.status === "draft" && post.draftedAt && (
                      <>
                        Drafted on
                        {new Date(post.draftedAt).toLocaleDateString()}
                      </>
                    )}

                    {post.archived && post.archivedAt ? (
                      <>
                        Archived on
                        {new Date(post.archivedAt).toLocaleDateString()}
                      </>
                    ) : post.status === "draft" && post.draftedAt ? (
                      <>
                        Drafted on
                        {new Date(post.draftedAt).toLocaleDateString()}
                      </>
                    ) : (
                      <>
                        Published on
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded disabled:opacity-50 flex items-center text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page numbers with ellipsis */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (p === 1 || p === pagination.totalPages) return true;
              if (
                p >= pagination.currentPage - 1 &&
                p <= pagination.currentPage + 1
              )
                return true;
              return false;
            })
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx] - arr[idx - 1] > 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-2 rounded text-sm cursor-pointer ${
                    pagination.currentPage === p
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
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded disabled:opacity-50 flex items-center text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {selectedPostForDelete && (
        <DeleteBlogPostModal
          postId={selectedPostForDelete.id}
          postTitle={selectedPostForDelete.title}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedPostForDelete(null);
          }}
        />
      )}
    </div>
  );
}
