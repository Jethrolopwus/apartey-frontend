"use client";
import React from "react";
import { Eye, Archive, Plus } from "lucide-react";
import Image from "next/image";

const mockBlogs = [
  {
    title:
      "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
    subtitle:
      "Essential tips for first-time property buyers to make informed decisions.",
    author: "Andrew",
    date: "1/15/2025",
    category: "Buying Guide",
    views: 1250,
    comments: 102,
    tags: ["Tips", "Buying", "Property"],
    status: "Published",
    published: "1/15/2024",
    image: "/HouseRent.png",
  },
  {
    title:
      "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
    subtitle:
      "Essential tips for first-time property buyers to make informed decisions.",
    author: "Andrew",
    date: "1/15/2025",
    category: "Buying Guide",
    views: 1250,
    comments: 102,
    tags: ["Tips", "Buying", "Property"],
    status: "Draft",
    published: "1/15/2024",
    image: "/HouseRent.png",
  },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
};

export default function AdminBlog() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-transparent p-0 mt-4">
      <h2 className="text-2xl font-semibold text-[#2D3A4A] mb-8">
        Blog Management
      </h2>
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Blog posts"
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
          <button className="ml-4 flex items-center gap-2 bg-[#C85212] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#a63e0a] transition-colors">
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {mockBlogs.map((blog, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 flex gap-6 items-start"
          >
            <Image
              src={blog.image}
              alt="Blog"
              width={100}
              height={100}
              className="w-32 h-32 object-cover rounded-xl border border-gray-100"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-[#2D3A4A] leading-tight">
                  {blog.title}
                </h3>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[blog.status]
                  }`}
                >
                  {blog.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">{blog.subtitle}</div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-[#2D3A4A]">
                    {blog.author}
                  </span>
                </span>
                <span>{blog.date}</span>
                <span>{blog.category}</span>
                <span>👁 {blog.views}</span>
                <span>💬 {blog.comments}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Published on {blog.published}
              </div>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">
                  View
                </button>
                <button className="px-4 py-1 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-1 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 flex items-center gap-1">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
