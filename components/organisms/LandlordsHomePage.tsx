"use client";
import Button from "@/components/atoms/Buttons/ActionButton";
import FeaturedReviews from "@/components/organisms/FeaturedReviews";
import Link from "next/link";
import LandlordsToolsSection from "../molecules/LandlordsToolSection";
import Image from "next/image";

const LandlordHomePage = () => {
  return (
    <div className="relative py-12 bg-gray-50 md:py-12 overflow-hidden">
      {/* Hero Section with background image */}
      <section className="relative w-full flex items-center justify-center min-h-[340px] mb-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/Herobg.png"
            alt="Hero background"
            fill
            className="object-cover object-center w-full h-full"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">
          <div className="text-center px-6 sm:px-16">
            <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
              Manage Your Property
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              Track tenants feedback, manage listings and grow your
              rental-business with data-driven insights
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
              <Link href="/property-listings">
                <Button variant="primary">Add Property</Button>
              </Link>
              <Link href="/reviewsPage">
                <Button variant="secondary">View Insights</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Rest of the content */}
      <FeaturedReviews />
      <LandlordsToolsSection />
    </div>
  );
};

export default LandlordHomePage;
