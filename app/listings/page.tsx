import { Suspense } from "react";
import Listings from "@/components/organisms/Listing";
import AparteyLoader from "@/components/atoms/Loader";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <Listings />
    </Suspense>
  );
}
