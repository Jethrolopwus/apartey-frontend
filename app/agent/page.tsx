import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import Listings from "@/components/organisms/Listing";
import AgentsHomePage from "@/components/organisms/AgentsHomePage ";
import RoleGuard from "@/components/molecules/RoleGuard";



export default function Agent() {
  return (
    <div className="min-h-screen">
      <RoleGuard>
      <AgentsHomePage/>
      <Listings/>
      <CategoryComponent/>
      <BlogComponent/>
      <ExperienceComponent/>
      </RoleGuard>
      
    </div>
  );
}