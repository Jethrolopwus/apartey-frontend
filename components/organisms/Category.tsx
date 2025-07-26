import { Category } from "@/types/generated";
import Image from "next/image";

export default function CategoryComponent() {
  const categories: Category[] = [
    {
      id: 1,
      title: "Pet friendly",
      image: "/pet.png",
    },
    {
      id: 2,
      title: "New development",
      image: "/newHouse.png",
    },
    {
      id: 3,
      title: "Apartments",
      image: "/cleanHouse.png",
    },
    {
      id: 4,
      title: "Homes swaps",
      image: "/HomeSwap.png",
    },
  ];

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
            className="flex bg-white shadow-md rounded-md pb-4 gap-2 flex-col items-center"
          >
            <div className="w-full rounded-t-lg overflow-hidden mb-3 aspect-auto">
              <Image
                src={category.image}
                alt={category.title}
                width={120}
                height={120}
                className="w-full h-full object-cover"
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
