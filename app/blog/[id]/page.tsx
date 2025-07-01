
import React, { Suspense } from 'react';
import BlogDetails from '@/components/organisms/BlogDetails';

type Props = {
  params: {
    id: number;
  };
};

export default async function BlogsDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <div className="min-h-screen">
        <BlogDetails id={String(id)} />
      </div>
    </Suspense>
  );
}
