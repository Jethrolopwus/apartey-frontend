import { Suspense } from "react";
import BlogDetails from "@/components/organisms/BlogDetails";
import AparteyLoader from "@/components/atoms/Loader";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }>
        <BlogDetails id={id} />
      </Suspense>
    </div>
  );
}
