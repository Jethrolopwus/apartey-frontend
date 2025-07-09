import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import Hero from "@/components/organisms/Hero";
import Listings from "@/components/organisms/Listing";



export default function Home() {
  return (
    <div>
      <Hero/>
      {/* <ReviewsSection/> */}
      <Listings/>
      <CategoryComponent/>
      <BlogComponent/>
      <ExperienceComponent/>
    </div>
  );
}
