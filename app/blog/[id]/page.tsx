import React, { Suspense } from "react";
import BlogDetails from "@/components/organisms/BlogDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BlogsDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <div className="min-h-screen">
        <BlogDetails id={id} />
      </div>
    </Suspense>
  );
}
