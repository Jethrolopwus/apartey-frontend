"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { useLocation } from "@/app/userLocationContext";

const Footer: React.FC = () => {
  const { selectedCountryCode, setSelectedCountryCode } = useLocation();

  const countries = [
    { code: "EE", name: "Estonia" },
    { code: "NG", name: "Nigeria" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
  ];

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCountryCode(event.target.value);
  };

  return (
    <footer className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/aparteyLogo.png"
                alt="Apartey Logo"
                width={120}
                height={40}
                className="h-auto w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
              Apartey is a community-powered rent intelligence platform designed
              to help renters make better, smarter housing decisions. It&#39;s a
              space where renters share honest reviews, experiences, and
              insights about the homes they&#39;ve lived in.
            </p>
          </div>

          {/* Center Section - Links */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Links</h3>
            <nav className="space-y-4">
              <Link
                href="/reviews"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                Reviews
              </Link>
              <Link
                href="/home-listings"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                Home listings
              </Link>
              <Link
                href="/insights"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                Insights
              </Link>
              <Link
                href="/user-price-list"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                User Price List
              </Link>
              <Link
                href="/about"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Right Section - Contact and Country Selection */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Contact
            </h3>
            <div className="space-y-4">
              <Link
                href="tel:+11234567890"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                +1 (123) 456-7890
              </Link>
              <Link
                href="mailto:hello@apartey.com"
                className="block text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base"
              >
                hello@apartey.com
              </Link>
            </div>

            {/* Country Selection */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Select Your Country
              </h3>
              <div className="flex flex-wrap gap-4">
                {countries.map((country) => (
                  <label
                    key={country.code}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      value={country.code}
                      checked={selectedCountryCode === country.code}
                      onChange={handleCountryChange}
                      className="form-radio text-blue-600"
                      aria-label={`Select ${country.name}`}
                    />
                    <span className="text-sm text-gray-600 lg:text-base">
                      {country.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex space-x-4">
              <Link
                href="https://web.facebook.com/people/Apartey/61578878727888/?mibextid=wwXIfr&rdid=R6EjNcu0XiQfdFO4&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F16nciE51Yv%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr"
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="Facebook"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/hey_apartey/"
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="Instagram"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/hey_apartey"
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="Twitter"
                target="_blank"
              >
                <X className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/apartey/"
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="LinkedIn"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
            <p className="text-sm text-gray-600">
              © 2025 Apartey. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center space-x-6 lg:justify-end">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-settings"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Cookies Settings
              </Link>
              <Link
                href="/content-policy"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Content policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
