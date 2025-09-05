"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllBlogPostQuery } from "@/Hooks/use-getAllBlogPost.query";
import { useGetAllBlogPostByIdQuery } from "@/Hooks/use-getAllBlogPostById.query";
import { BlogPost } from "@/types/blog";

interface BlogDetailsProps {
  id?: string;
}

// Interface for single blog post (different from list response)
interface SingleBlogPost {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: string;
  author?: {
    name: string;
    avatar: string;
  };
}

// Custom Image component with error handling
const SafeImage: React.FC<{
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
}> = ({ src, alt, fallbackSrc = "/HouseRent.png", className, fill, priority, width, height }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={handleError}
      unoptimized={imgSrc.startsWith('http')} // Don't optimize external images
    />
  );
};

const BlogDetails: React.FC<BlogDetailsProps> = ({ id }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get('query') || '');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [postsPerPage, setPostsPerPage] = useState(parseInt(searchParams.get('limit') || '3'));

  // Always call hooks unconditionally
  const singlePostQuery = useGetAllBlogPostByIdQuery(id || "");
  const allPostsQuery = useGetAllBlogPostQuery({
    search: debouncedSearchQuery || undefined,
    limit: postsPerPage,
    page: currentPage,
  });

  // Search and pagination handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (postsPerPage !== 3) params.set('limit', postsPerPage.toString());
    
    const queryString = params.toString();
    router.push(`/blog${queryString ? `?${queryString}` : ''}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    params.set('page', newPage.toString());
    if (postsPerPage !== 3) params.set('limit', postsPerPage.toString());
    
    const queryString = params.toString();
    router.push(`/blog?${queryString}`);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsDebouncing(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsDebouncing(false);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  // Update URL when search params change
  useEffect(() => {
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '3');
    
    setSearchQuery(query);
    setDebouncedSearchQuery(query);
    setCurrentPage(page);
    setPostsPerPage(limit);
  }, [searchParams]);

  // Render single post view if id is provided
  if (id) {
    const { data, isLoading, error } = singlePostQuery;

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
          Failed to load blog post.
        </div>
      );
    }

    const post = (data as SingleBlogPost) || ({} as SingleBlogPost);
    const authorName = post?.author?.name || "Apartey Team";
    const authorAvatar = post?.author?.avatar || "/aparteyLogo.png";
    const publishedAt = post.publishedAt || new Date().toISOString();
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const readTime = "8";
    const category = post.category || "General";
    const imageUrl = post.image || post.imageUrl || "/HouseRent.png";
    const content = post.content || "";

    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6 flex items-center gap-2">
            <Link
              href="/blog"
              className="flex items-center text-gray-500 hover:text-orange-600 text-sm font-medium"
            >
              <span className="mr-1">←</span> Back to Blog
            </Link>
          </div>
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative w-full h-64 md:h-96">
              <SafeImage
                src={imageUrl}
                alt={post.title}
                fallbackSrc="/cover-image.png"
                fill
                className="object-cover w-full h-full rounded-b-none rounded-t-xl"
                priority={false}
              />
            </div>
            <div className="p-6 md:p-10">
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                {category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <SafeImage
                    src={authorAvatar}
                    alt={authorName}
                    fallbackSrc="/aparteyLogo.png"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{authorName}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span>{formattedDate}</span>
                <span className="hidden md:inline">•</span>
                <span>{readTime} min read</span>
              </div>
              <div className="prose max-w-none text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>
          </article>
        </main>
      </div>
    );
  }

  // Render all posts
  const { data, isLoading, error } = allPostsQuery;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load blog posts.
      </div>
    );
  }

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-4">
              Apartey Blog
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              Insights, tips, and stories about real estate and living spaces in
              Nigeria
            </p>
          </div>
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Articles..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="submit"
                disabled={isLoading || isDebouncing}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isLoading || isDebouncing
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isLoading ? 'Searching...' : isDebouncing ? 'Typing...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Articles"}
            </h2>
            {pagination && (
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.postsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.postsPerPage, pagination.totalPosts)} of {pagination.totalPosts} articles
              </div>
            )}
          </div>

          {posts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery ? `No articles found for "${searchQuery}"` : "No articles available"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    router.push('/blog');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear search and show all articles
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post: BlogPost) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                passHref
                legacyBehavior
              >
                <a className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group block">
                  <div className="relative h-48 md:h-56">
                    <SafeImage
                      src={post.imageUrl || "/HouseRent.png"}
                      alt={post.title}
                      fallbackSrc="/cover-image.png"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {stripHtmlTags(post.excerpt)}
                    </p>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <div className="flex items-center justify-center mt-12 gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              {/* Always show Page 1 */}
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pagination.currentPage === 1 
                    ? "bg-[#C85212] text-white border border-[#C85212]" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                1
              </button>
              
              {/* Show additional pages only when there are multiple pages */}
              {pagination.totalPages > 1 && Array.from({ length: pagination.totalPages - 1 }, (_, i) => i + 2).map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pagination.currentPage === number 
                      ? "bg-[#C85212] text-white border border-[#C85212]" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.totalPages <= 1 || !pagination.hasNextPage}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BlogDetails;
