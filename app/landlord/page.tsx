import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import LandlordHomePage from "@/components/organisms/LandlordsHomePage";
import Listings from "@/components/organisms/Listing";
import RoleGuard from "@/components/molecules/RoleGuard";



export default function Landlord() {
    
  return (
    <div className="min-h-screen">
         <RoleGuard allowedRoles={["homeowner"]}>
         <LandlordHomePage/>
        <Listings/>
        <CategoryComponent/>
        <BlogComponent/>
        <ExperienceComponent/>
        </RoleGuard>
      
    </div>
  );
}