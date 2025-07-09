import React, { Suspense } from "react";
import ReviewDetails from "@/components/organisms/ReviewsDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <div className="min-h-screen">
        <ReviewDetails id={id} />
      </div>
    </Suspense>
  );
}
