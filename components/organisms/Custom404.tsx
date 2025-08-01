"use client";

import React from "react";
import Link from "next/link";
// import { useRouter } from 'next/navigation';
import Image from "next/image";

const Custom404: React.FC = () => {
  // const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            {/* Left side - Illustration */}
            <div className="relative mb-8 lg:mb-0 lg:w-1/2 flex items-center justify-center">
              <div
                className="flex items-center justify-center w-[400px] h-[400px] rounded-full"
                style={{ backgroundColor: "#F7DFD1" }}
              >
                <Image
                  src="/illustartion.png"
                  alt="404 Illustration"
                  width={288} // 72 * 4 = 288px
                  height={350}
                  style={{ maxHeight: "350px", width: "auto", height: "auto" }}
                  className="w-72 h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right side - Error message */}
            <div className="lg:w-1/2 text-center lg:text-left lg:pl-12">
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
                  404
                </h1>
                <div className="text-orange-600 text-sm font-medium mb-2">
                  ERROR 404
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sorry, we can&apos;t
                  <br />
                  find that page
                </h2>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                  <div>
                    <div className="font-medium">Accommodation</div>
                    <div className="font-medium">Purchase</div>
                  </div>
                  <div>
                    <div className="font-medium">Reviews</div>
                    <div className="font-medium">Real Estate</div>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="inline-block px-8 py-3 text-white font-medium rounded-md transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: "#C85212" }}
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-500">
        © 2024 All rights reserved. apartey 2024.
      </footer>
    </div>
  );
};

export default Custom404;
