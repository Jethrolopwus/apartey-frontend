  

"use client";
import AllReviews from "@/components/organisms/AllReviews";
export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <AllReviews 
        className="min-h-screen"
        showHeader={true}
      />
    </div>
  );
}