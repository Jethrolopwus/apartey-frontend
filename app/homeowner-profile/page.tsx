import HomeownerProfile from "@/components/organisms/HomeownerProfile";
import RoleGuard from "@/components/molecules/RoleGuard";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function HomeownerProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <div className="min-h-screen">
        <RoleGuard>
          <HomeownerProfile />
        </RoleGuard>
      </div>
    </Suspense>
  );
}