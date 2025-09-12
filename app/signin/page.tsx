import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import SignIn from "@/components/organisms/SignIn";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <ReviewFormProvider>
        <SignIn />
      </ReviewFormProvider>
    </Suspense>
  );
}