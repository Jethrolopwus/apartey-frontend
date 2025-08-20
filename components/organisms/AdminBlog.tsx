"use client";
import React, { useState, useEffect } from "react";
import { Archive, Plus, Search, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetAdminAllBlogPostQuery } from "@/Hooks/use-getAdminAllBlogPost.query";

import { AdminPost } from "@/types/admin";
import EditBlogPostModal from "@/app/admin/components/EditBlogPostModal";
import DeleteBlogPostModal from "@/app/admin/components/DeleteBlogPostModal";

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
  Archived: "bg-gray-100 text-gray-700",
};

export default function AdminBlog() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostForDelete, setSelectedPostForDelete] = useState<{ id: string; title: string } | null>(null);

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
  const { data: blogPostsData, isLoading, error } = useGetAdminAllBlogPostQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm || undefined,
    sort: sortBy as "newest" | "oldest" | "most-liked" | "most-viewed",
    status: selectedStatus !== "all" ? selectedStatus as "Published" | "Draft" | "Archived" : undefined
  });
  
  const handleDelete = (post: AdminPost) => {
    setSelectedPostForDelete({ id: post.id, title: post.title });
    setDeleteModalOpen(true);
  };

  const handleArchive = (post: AdminPost) => {
    // TODO: Implement archive functionality
    console.log("Archive post:", post.id);
  };

  const handleView = (post: AdminPost) => {
    router.push(`/admin/blog/${post.id}`);
  };

  const handleEdit = (post: AdminPost) => {
    setSelectedPostId(post.id);
    setEditModalOpen(true);
  };

  const handleNewPost = () => {
    router.push('/admin/create-blogpost');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
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
          <div className="text-lg text-red-500">Error loading blog posts. Please try again.</div>
        </div>
      </div>
    );
  }

  const pagination = blogPostsData?.pagination;
  const posts = blogPostsData?.posts || [];

  return (
    <div className="w-full max-w-5xl mx-auto bg-transparent p-0 mt-4">
      <h2 className="text-2xl font-semibold text-[#2D3A4A] mb-8">
        Blog Management
      </h2>
      
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="relative w-64">
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
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-liked">Most Liked</option>
            <option value="most-viewed">Most Viewed</option>
          </select>
          
          <select 
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          
          <button 
            onClick={handleNewPost}
            className="ml-4 flex items-center gap-2 bg-[#C85212] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#a63e0a] transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-gray-500 text-lg">No blog posts found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first blog post to get started"
              }
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow p-6 flex gap-6 items-start"
            >
              <Image
                src={post.image || "/HouseRent.png"}
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
                  <span
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[post.status]
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">{post.subtitle}</div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-[#2D3A4A]">
                      {post.author}
                    </span>
                  </span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>{post.category}</span>
                  <span>👁 {post.views}</span>
                  <span>💬 {post.comments}</span>
                  <span>❤️ {post.likes}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs text-gray-400 mb-2">
                  Published on {new Date(post.published).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleView(post)}
                    className="px-4 py-1 rounded-lg border cursor-pointer border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(post)}
                    className="px-4 py-1 rounded-lg cursor-pointer border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleArchive(post)}
                    className="px-4 py-1 rounded-lg border  cursor-pointer border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button 
                    onClick={() => handleDelete(post)}
                    className="px-4 py-1 rounded-lg cursor-pointer border border-red-200 text-red-700 font-semibold hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-4">
          <div className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.postsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.postsPerPage, pagination.totalPosts)} of{" "}
            {pagination.totalPosts} posts
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === pagination.currentPage
                      ? "bg-[#C85212] text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditBlogPostModal
        postId={selectedPostId}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

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
