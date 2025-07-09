"use client";
import Button from "@/components/atoms/Buttons/ActionButton";
import FeaturedReviews from "@/components/organisms/FeaturedReviews";
import Link from "next/link";
import AgentsToolSection from "../molecules/AgentsToolSection";

const AgentsHomePage = () => {
  return (
    <div className="relative py-12 bg-gray-50 md:py-12 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center px-6 sm:px-16 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
            Grow Your Real Estate Business
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Connect with potentials clients, showcase your project and build
            trust through verify reviews and testimonials
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
            <Link href="/writeReviews">
              <Button variant="primary">List Property</Button>
            </Link>
            <Link href="/reviewsPage">
              <Button variant="secondary">View Portfolio</Button>
            </Link>
          </div>
        </div>
      </div>

      <FeaturedReviews />
      <AgentsToolSection />
    </div>
  );
};
export default AgentsHomePage;
