"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/atoms/Buttons/ActionButton";
import { useRouter } from "next/navigation";

const AgentHeroSection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="relative w-full min-h-[340px] flex items-center justify-center bg-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/Herobg.png"
          alt="Hero background"
          fill
          className="object-cover object-center w-full h-full"
          priority
        />
        {/* Removed white overlay for better visibility */}
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-800 text-center mb-3 tracking-tight">
          Real People.... Real Experiences
        </h1>
        <p className="text-gray-600 text-base md:text-lg text-center mb-8 max-w-2xl">
          Connect with potential clients, showcase your projects, and build trust through verified reviews and testimonials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            className="px-10 py-2 text-base font-semibold flex items-center justify-center"
            onClick={() => router.push("/property-listings")}
          >
            <span className="mr-2"> {/* Optionally add an icon here */} </span>
            List Property
          </Button>
          <button
            className="px-10 py-2 text-base font-semibold border border-[#C85212] text-[#C85212] bg-white rounded-md hover:bg-orange-50 transition-colors flex items-center justify-center"
            onClick={() => router.push("/agent-profile")}
          >
            View Portfolio
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgentHeroSection; 