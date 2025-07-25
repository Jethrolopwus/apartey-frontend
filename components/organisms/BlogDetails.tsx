"use client";
import React from "react";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllBlogPostQuery } from "@/Hooks/use-getAllBlogPost.query";
import { useGetAllBlogPostByIdQuery } from "@/Hooks/use-getAllBlogPostById.query";

interface BlogDetailsProps {
  id?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt?: string;
  category?: string;
  excerpt?: string;
  author?: { name: string; avatar: string };
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ id }) => {
  // Always call hooks unconditionally
  const singlePostQuery = useGetAllBlogPostByIdQuery(id || "");
  const allPostsQuery = useGetAllBlogPostQuery();

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

    const post = (data as BlogPost) || ({} as BlogPost);
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
    const imageUrl = post.imageUrl || "/HouseRent.png";
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
              <Image
                src={imageUrl}
                alt={post.title}
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
                  <Image
                    src={authorAvatar}
                    alt={authorName}
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

  const posts = (data as unknown as { posts?: BlogPost[] })?.posts || [];

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
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              All Articles
            </h2>
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
              <span className="text-sm md:text-base mr-2">See all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

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
                    <Image
                      src={post.imageUrl || "/HouseRent.png"}
                      alt={post.title}
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
                      {post.excerpt}
                    </p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDetails;
