"use client";

import { Suspense } from "react";
import ReviewSearchContainer from "@/components/organisms/SearchReviewContainer";

function SearchReviewLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function SearchReviewPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<SearchReviewLoading />}>
        <ReviewSearchContainer />
      </Suspense>
    </div>
  );
}
