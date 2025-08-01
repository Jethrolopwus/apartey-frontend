import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import WriteListedPropertyReviews from "@/components/organisms/WriteListedPropertyReviews";

export default async function WriteReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string; propertyId?: string }>;
}) {
  const params = await searchParams;
  return (
    <ReviewFormProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
              <WriteListedPropertyReviews 
        prefilledAddress={params.address}
        propertyId={params.propertyId}
      />
      </div>
    </ReviewFormProvider>
  );
}
