import AgentProfile from "@/components/organisms/AgentProfile";
import RoleGuard from "@/components/molecules/RoleGuard";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function Agent() {
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
          <AgentProfile />
        </RoleGuard>
      </div>
    </Suspense>
  );
}