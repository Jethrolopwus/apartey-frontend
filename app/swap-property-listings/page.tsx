
import SwapPropertyListings from "@/components/organisms/SwapPropertyListings";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function PropertyListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <div className="min-h-screen ">
        <SwapPropertyListings/>
      </div>
    </Suspense>
  );
}
