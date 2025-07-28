import { Suspense } from "react";
import Listings from "@/components/organisms/Listing";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <span className="text-gray-500">Loading listings...</span>
        </div>
      }
    >
      <Listings />
    </Suspense>
  );
}
