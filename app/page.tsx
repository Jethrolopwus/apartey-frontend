import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import FeaturedReviews from "@/components/organisms/FeaturedReviews";
import Hero from "@/components/organisms/Hero";
import Listings from "@/components/organisms/Listing";
import ReviewsSection from "@/components/organisms/ReviewSection";


export default function Home() {
  return (
    <div>
      <Hero/>
      <ReviewsSection/>
      <FeaturedReviews/>
      <Listings/>
      <CategoryComponent/>
      <BlogComponent/>
      <ExperienceComponent/>
    </div>
  );
}
