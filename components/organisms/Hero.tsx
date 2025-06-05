"use client";
import { useState } from "react";
import Image from "next/image";
import eclipse from "@/public/Ellipse-2.png";
import eclipse2 from "@/public/Ellipse-1.png";
import SearchInput from "@/components/atoms/Buttons/SearchInput";
import Button from "@/components/atoms/Buttons/ActionButton";
import TestimonialStrip from "@/components/molecules/TestimonialStrip";
import FeaturedReviews from "@/components/organisms/FeaturedReviews";
import { useRouter } from "next/navigation";
import ReviewsSection from "./ReviewSection";
import Link from "next/link";

export default function Hero() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSearchSubmit = () => {
    if (!inputValue) return;
    router.push(`/searchReview?q=${encodeURIComponent(inputValue)}`);
  };

  const testimonialAvatars = [
    { src: eclipse, alt: "User avatar" },
    { src: eclipse2, alt: "User avatar" },
  ];

  return (
    <div className="relative py-12 bg-gray-50 md:py-12 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center px-6 sm:px-16 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
            Find your perfect rental with confidence
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Discover what real tenants and homeowners are saying about local
            properties around you
          </p>

          <SearchInput
            placeholder="Search locations in Nigeria and Estonia"
            countryRestrictions={["ng", "ee"]}
            onPlaceSelect={(place) => {
              setInputValue(place.description);
              router.push(
                `/searchReview?q=${encodeURIComponent(place.description)}`
              );
            }}
            onChange={(value) => setInputValue(value)}
            onSubmit={(value) => {
              if (value) {
                router.push(`/searchReview?q=${encodeURIComponent(value)}`);
              }
            }}
            onLocationSelect={function (location: string): void {
              throw new Error("Function not implemented.");
            }}
          />

          <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
            <Link href="/reviewsPage">
              <Button variant="primary">Share your experience</Button>
            </Link>
            <Link href="/writeReviews">
              <Button variant="secondary">Leave a review</Button>
            </Link>
          </div>

          <TestimonialStrip
            avatars={testimonialAvatars}
            text="Over 30,000 trusted reviews from real renters"
          />
        </div>
      </div>
      <ReviewsSection />
      <FeaturedReviews searchTerm="" />
    </div>
  );
}
