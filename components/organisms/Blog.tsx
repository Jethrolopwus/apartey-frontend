import { ArrowRight, ChevronRight } from "lucide-react";
import { BlogPost } from "@/types/generated";
import Link from "next/link";

export default function BlogComponent() {
  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      excerpt:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      image: "/HouseRent.png",
      date: "OCTOBER 10, 2023",
    },
    {
      id: 2,
      title:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      excerpt:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      image: "/HouseRent.png",
      date: "OCTOBER 10, 2023",
    },
    {
      id: 3,
      title:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      excerpt:
        "Converting Your Home to a Rental: 6 Tips to Protect You & Your Property.",
      image: "/HouseRent.png",
      date: "OCTOBER 10, 2023",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase text-gray-500 font-medium tracking-wide">
            {blogPosts[0].date}
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
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="flex shadow-md rounded-md pb-4 gap-2  flex-col items-center"
          >
            <div className="w-full rounded-t-lg overflow-hidden mb-4 aspect-auto">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
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
