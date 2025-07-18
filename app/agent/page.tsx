import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import RoleGuard from "@/components/molecules/RoleGuard";
import HomeListingsPreview from "@/components/organisms/HomeListingsPreview";
import AgentsSection from "@/components/organisms/AgentsSection";
import AgentHeroSection from "@/components/organisms/AgentHeroSection";

export default function Landlord() {
  return (
    <div className="min-h-screen">
      <RoleGuard>
        <AgentHeroSection/>
        <HomeListingsPreview/>
        <AgentsSection/>
        {/* <Listings /> */}
        <CategoryComponent />
        <BlogComponent />
        <ExperienceComponent />
      </RoleGuard>
    </div>
  );
}
