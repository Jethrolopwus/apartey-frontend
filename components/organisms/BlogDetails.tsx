// app/blog/page.tsx
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Article,  } from '@/types/generated';



const BlogDetails: React.FC = () => {
  const articles: Article[] = [
    {
      id: '1',
      title: 'Converting Your Home to a Rental: 6 Tips to Protect You & Your Property',
      description: 'Converting Your Home to a Rental: 6 Tips to Protect You & Your Property',
      image: '/HouseRent.png', 
      category: 'Renting',
      featured: true
    },
    {
      id: '2',
      title: 'Converting Your Home to a Rental: 6 Tips to Protect You & Your Property',
      description: 'Converting Your Home to a Rental: 6 Tips to Protect You & Your Property',
      image: '/HouseRent.png',
      category: 'Renting'
    },
    {
      id: '3',
      title: 'Understanding Local Rental Regulations: What You Need to Know',
      description: 'Understanding Local Rental Regulations: What You Need to Know',
      image: '/HouseRent.png',
      category: 'Renting'
    },
    {
      id: '4',
      title: 'Setting the Right Rental Price: How to Evaluate Your Property\'s Worth',
      description: 'Setting the Right Rental Price: How to Evaluate Your Property\'s Worth',
      image: '/HouseRent.png',
      category: 'Renting'
    },
    {
      id: '5',
      title: 'Preparing Your Home for Tenants: Essential Maintenance Checklist',
      description: 'Preparing Your Home for Tenants: Essential Maintenance Checklist',
      image: '/HouseRent.png',
      category: 'Renting'
    },
    {
      id: '6',
      title: 'Choosing the Right Tenants: Screening Tips for Landlords',
      description: 'Choosing the Right Tenants: Screening Tips for Landlords',
      image: '/HouseRent.png',
      category: 'Renting'
    },
    {
      id: '7',
      title: 'Creating a Solid Rental Agreement: Key Clauses',
      description: 'Creating a Solid Rental Agreement: Key Clauses',
      image: '/HouseRent.png',
      category: 'Renting'
    }
  ];

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Apartey Blog
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              Insights, tips, and stories about real estate and living spaces in Nigeria
            </p>
          </div>

          {/* Search Bar */}
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
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm md:text-base">
                    {featuredArticle.description}
                  </p>
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors w-fit">
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Articles Section */}
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

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 md:h-56">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDetails;