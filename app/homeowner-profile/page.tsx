import HomeownerProfile from "@/components/organisms/HomeownerProfile";
import RoleGuard from "@/components/molecules/RoleGuard";

export default function HomeownerProfilePage() {
  return (
    <div className="min-h-screen">
      <RoleGuard>
        <HomeownerProfile />
      </RoleGuard>
    </div>
  );
}