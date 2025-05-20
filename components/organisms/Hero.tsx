"use client";
import { useState } from "react";
import Image from "next/image";
import eclipse from "@/public/Ellipse-2.png";
import eclipse2 from "@/public/Ellipse-1.png";
import SearchInput from "@/components/atoms/Buttons/SearchInput";
import Button from "@/components/atoms/Buttons/ActionButton";
import TestimonialStrip from "@/components/molecules/TestimonialStrip";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleShareExperience = () => {
    // Handle share experience logic here
    console.log("Opening share experience form");
    // e.g., navigate to form page, open modal, etc.
  };

  const handleSearchSubmit = () => {
    // Implement search functionality here
    // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    console.log("Search query:", searchQuery);
  };

  const testimonialAvatars = [
    { src: "/api/placeholder/32/32", alt: "User avatar", isPlaceholder: true },
    { src: eclipse, alt: "User avatar" },
    { src: eclipse2, alt: "User avatar" },
  ];

  return (
    <div className="relative py-12 bg-gray-50 md:py-12  overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-center object-cover mt-32  opacity-100"
        style={{
          backgroundImage: `url('/Herobg.png')`,
        }}
      />

      {/* Main Content Container */}
      <div className="relative  z-10 max-w-5xl mx-auto px-4">
        <div className=" ">
          <div className="text-center px-16 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
              Find your perfect rental with confidence
            </h1>
            <p className="text-gray-500  text-lg mb-8">
              Discover what real tenants and homeowners are saying about local
              properties around you
            </p>
            <SearchInput
              // onSubmit={handleSearch}
              onSubmit={handleSearchSubmit}
              onChange={handleSearchChange}
            />

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <Button variant="primary" onClick={handleSearchSubmit}>
                Search Reviews
              </Button>

              <Button variant="secondary" onClick={handleShareExperience}>
                Share your experience
              </Button>
            </div>

            {/* Testimonial Section */}
            <TestimonialStrip
              avatars={testimonialAvatars}
              text="Over 30,000 trusted reviews from real renters"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
