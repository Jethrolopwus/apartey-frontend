"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Eye, Heart, MessageCircle, Calendar, User, Tag } from 'lucide-react';
import { useGetAdminBlogPostByIdQuery } from '@/Hooks/use-getAdminAllBlogPostById.query';
import Image from 'next/image';

// Custom Image component with error handling for blog detail
const SafeImage: React.FC<{
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, fallbackSrc = "/cover-image.png", className, width, height }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // If no image URL is provided, show a placeholder
  if (!src || src.trim() === "") {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border border-gray-200`}>
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-xs">No Image</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={imgSrc.startsWith('http')} // Don't optimize external images
    />
  );
};

export default function BlogPostDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = React.useState<string>('');
  
  React.useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);
  
  const { data: post, isLoading, error } = useGetAdminBlogPostByIdQuery(id);

  const handleClose = () => {
    router.push('/admin/blog');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-4 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-500">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-4 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">Error loading blog post. Please try again.</div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-[#C85212] text-white rounded-lg hover:bg-[#a63e0a] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#2D3A4A]">{post.title}</h1>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[post.status]
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="relative">
                  <SafeImage
                    src={post.imageUrl || ""}
                    alt={post.title}
                    fallbackSrc="/cover-image.png"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              {/* Blog Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 prose prose-sm max-w-none">
                  <div className="text-gray-700">
                    {post.excerpt}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{post.author.firstName}</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <span className="text-gray-600">{post.category}</span>
              </div>

              {/* Date Added */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Added
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Published Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statistics
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">0 comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{post.likes.length} likes</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post ID
                </label>
                <span className="text-gray-500 text-sm font-mono">{post._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-[#C85212] text-white rounded-lg hover:bg-[#a63e0a] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 