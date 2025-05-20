import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/types/generated';

export default function CategoryComponent() {
  // Sample categories data
  const categories: Category[] = [
    {
      id: 1,
      title: "Pet friendly",
      image: "/pet.png"
    },
    {
      id: 2,
      title: "New development",
      image: "/newHouse.png"
    },
    {
      id: 3,
      title: "Apartments",
      image: "/cleanHouse.png"
    },
    {
      id: 4,
      title: "Homes swaps",
      image: "/HomeSwap.png"
    },
    {
      id: 5,
      title: "Luxury homes",
      image: "/luxury.png"
    },
    {
      id: 6,
      title: "Penthouse",
      image: "/penHouse.png"
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase text-gray-500 font-medium tracking-wide">CATEGORIES</p>
          <h2 className="text-2xl font-medium text-gray-800">Browse by categories</h2>
        </div>
        <a href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          See all
          <ChevronRight className="ml-1 h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="flex bg-white shadow-md rounded-md pb-4 gap-2  flex-col items-center">
            <div className="w-full rounded-t-lg overflow-hidden mb-3 aspect-auto">
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-center text-sm text-gray-700">{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}