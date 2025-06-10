
import { WriteUnlistedPropertyReview } from "@/components/organisms/WriteUnlistedPropertyReviews";

// import PropertyReviewForm from "@/components/molecules/PropertyReviewForm";



export default function WriteReviewsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

            <WriteUnlistedPropertyReview/>
            {/* <PropertyReviewForm/> */}
        </div>

    )
}