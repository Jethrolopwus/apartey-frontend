"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGetAllBlogPostQuery } from "@/Hooks/use-getAllBlogPost.query";
import Image from "next/image";

// Define a BlogPost type if not imported
interface BlogPost {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  excerpt: string;
  publishedAt?: string;
}

export default function BlogComponent() {
  // Fetch blog posts from backend (limit 3)
  const { data, isLoading, error } = useGetAllBlogPostQuery({ limit: 3 });
  const posts = ((data as unknown) as { posts?: BlogPost[] })?.posts || [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase text-gray-500 font-medium tracking-wide">
            {posts[0]?.publishedAt ? new Date(posts[0].publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </p>
          <h2 className="text-2xl font-medium text-gray-800">
            Latest from Our Blog
          </h2>
        </div>
        <Link href="/blog">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
            <span className="text-sm md:text-base mr-2">See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading && <div className="col-span-3 text-center">Loading...</div>}
        {error && <div className="col-span-3 text-center text-red-500">Failed to load blog posts.</div>}
        {posts.slice(0, 3).map((post: BlogPost) => (
          <div
            key={post._id}
            className="flex shadow-md rounded-md pb-4 gap-2 flex-col items-center"
          >
            <div className="w-full rounded-t-lg overflow-hidden mb-4 aspect-auto">
              <Image
                src={post.imageUrl || "/HouseRent.png"}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-full object-cover"
                priority={false}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
