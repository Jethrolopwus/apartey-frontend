"use client";

import { Category } from "@/types/generated";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryComponent() {
  const router = useRouter();

  const categories: (Category & { queryParams: string })[] = [
    {
      id: 1,
      title: "Pet friendly",
      image: "/pet.png",
      queryParams: "?petPolicy=Pets allowed",
    },
    {
      id: 2,
      title: "New development",
      image: "/newHouse.png",
      queryParams: "?condition=New Building",
    },
    {
      id: 3,
      title: "Apartments",
      image: "/cleanHouse.png",
      queryParams: "?propertyType=Apartment",
    },
    {
      id: 4,
      title: "Homes swaps",
      image: "/HomeSwap.png",
      queryParams: "?category=swap",
    },
  ];

  const handleCategoryClick = (queryParams: string) => {
    router.push(`/listings${queryParams}`);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase text-gray-500 font-medium tracking-wide">
            CATEGORIES
          </p>
          <h2 className="text-2xl font-medium text-gray-800">
            Browse by categories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex bg-white shadow-md rounded-md pb-4 gap-2 flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform"
            onClick={() => handleCategoryClick(category.queryParams)}
          >
            <div className="w-full rounded-t-lg overflow-hidden mb-3 aspect-auto">
              <Image
                src={category.image}
                alt={category.title}
                width={120}
                height={120}
                className="w-full h-full object-cover"
                style={{ width: 'auto', height: 'auto' }}
                priority={false}
              />
            </div>
            <span className="text-center text-sm text-gray-700">
              {category.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
