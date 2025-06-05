import PropertyReviewForm from "@/components/molecules/PropertyReviewsForm";
// import { WritePropertyReview } from "@/components/organisms/WritePropertyReviews";



export default function WriteReviewsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

            {/* // <WritePropertyReview/> */}
            <PropertyReviewForm/>
        </div>

    )
}