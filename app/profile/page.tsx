import UserProfile from "@/components/organisms/UserProfile";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <UserProfile />
    </Suspense>
  );
}