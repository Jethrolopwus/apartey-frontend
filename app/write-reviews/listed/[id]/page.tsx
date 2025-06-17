import PropertyReviewForm from "@/components/molecules/PropertyReviewForm";

type Props = {
  params: {
    id: string;
  };
};

export default async function WriteReviewsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <PropertyReviewForm id={id} />
    </div>
  );
}
