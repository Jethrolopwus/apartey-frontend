"use client";
import { Suspense } from "react";
import AllReviews from "@/components/organisms/AllReviews";

function ReviewsLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ReviewsLoading />}>
        <AllReviews className="min-h-screen" showHeader={true} />
      </Suspense>
    </div>
  );
}
