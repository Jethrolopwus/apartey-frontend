import WriteUnlistedPropertyReview from "@/components/organisms/WriteUnlistedPropertyReviews";
import { ReviewFormProvider } from "@/app/context/RevievFormContext";

export default function WriteReviewsPage() {
  return (
    <ReviewFormProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <WriteUnlistedPropertyReview />
      </div>
    </ReviewFormProvider>
  );
}
