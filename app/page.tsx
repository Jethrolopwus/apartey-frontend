import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import Hero from "@/components/organisms/Hero";
import HomeListingsPreview from "@/components/organisms/HomeListingsPreview";


export default function Home() {
  return (
    <div>
      <Hero/>
      {/* <ReviewsSection/> */}
      <HomeListingsPreview/>
      <CategoryComponent/>
      <BlogComponent/>
      <ExperienceComponent/>
    </div>
  );
}
