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

// Helper function to strip HTML tags from text
const stripHtmlTags = (html: string): string => {
  if (typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
};

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
        {isLoading && <div className="col-span-3 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212]"></div></div>}
        {error && <div className="col-span-3 text-center text-red-500">Failed to load blog posts.</div>}
        {posts.slice(0, 3).map((post: BlogPost) => (
          <Link
            key={post._id}
            href={`/blog/${post._id}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group block"
          >
              <div className="relative h-48 md:h-56">
                <Image
                  src={post.imageUrl || "/HouseRent.png"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={false}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
