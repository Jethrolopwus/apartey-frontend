"use client";
import React, { useState } from "react";
import { Sparkles, HelpCircle, Diamond } from "lucide-react";

const PricingComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log("Email submitted:", email);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "Flexible Plans",
      description: "Choose from multiple subscription tiers that fit your needs",
    },
    {
      icon: HelpCircle,
      title: "Affordable Rates",
      description: "Competitive pricing designed for renters and property seekers",
    },
    {
      icon: Diamond,
      title: "Premium Features",
      description: "Access to exclusive listings and advanced search capabilities",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-800 mb-4">
            Pricing Coming Soon!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;re working hard to bring you the best pricing plans for Apartey. Stay tuned for updates!
          </p>
        </div>

        {/* What to expect section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-12">
            What to expect:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full  bg-gray-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-[#C85212]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Email notification form */}
        <div className="max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C85212] text-white font-medium rounded-md hover:bg-orange-600 transition-colors duration-200 whitespace-nowrap"
              >
                Notify me when available
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-600 font-medium mb-2">
                ✓ Thank you for subscribing!
              </div>
              <p className="text-gray-600 text-sm">
                We&apos;ll notify you as soon as our pricing plans are available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingComingSoon; 