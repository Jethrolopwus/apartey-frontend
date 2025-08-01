import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import LandlordHomePage from "@/components/organisms/LandlordsHomePage";
import RoleGuard from "@/components/molecules/RoleGuard";
import HomeListingsPreview from "@/components/organisms/HomeListingsPreview";

export default function Landlord() {
  return (
    <div className="min-h-screen">
      <RoleGuard>
        <LandlordHomePage />
        {/* <Listings /> */}
        <HomeListingsPreview/>
        <CategoryComponent />
        <BlogComponent />
        <ExperienceComponent />
      </RoleGuard>
    </div>
  );
}
