import BlogDetails from "@/components/organisms/BlogDetails";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <BlogDetails id={id} />
    </div>
  );
}
