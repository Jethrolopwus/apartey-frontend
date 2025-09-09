"use client";
import React from "react";
import { Eye, Heart, Calendar, User, Tag } from "lucide-react";
import { useGetAdminBlogPostByIdQuery } from "@/Hooks/use-getAdminAllBlogPostById.query";
import Image from "next/image";
import Back from "@/components/atoms/Buttons/Back";

export default function BlogPostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { data: post, isLoading, error } = useGetAdminBlogPostByIdQuery(id);

  if (isLoading) {
    return <div className="text-lg text-gray-500">Loading blog post...</div>;
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-4 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">
              Error loading blog post. Please try again.
            </div>
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
    <div className="pt-3">
      <Back />
      <div className="bg-white rounded-md shadow-lg w-full p-6 mt-4">
        <h1 className="text-xl text-black font-bold">{post.title}</h1>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 mb-2">
          <div className="font-semibold">
            <User className="inline-flex -mt-1 mr-1" size={14} />
            {post.author?.firstName.charAt(0).toUpperCase() +
              post.author?.firstName.slice(1)}
          </div>

          <div>
            <Calendar className="inline-flex -mt-1 mr-1" size={14} />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div>
            <Tag className="inline-flex -mt-1 mr-1" size={14} />
            {post.category}
          </div>
          <div>
            <Eye className="inline-flex -mt-1 mr-1" size={14} />
            {post.views}
          </div>
          <div>
            <Heart className="inline-flex -mt-1 mr-1" size={14} />
            {post.likesCount}
          </div>
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
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="relative">
              <Image
                src={post.imageUrl || "/HouseRent.png"}
                alt={post.title}
                width={400}
                height={350}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div>
            <div className="bg-white p-4  max-w-none">
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
