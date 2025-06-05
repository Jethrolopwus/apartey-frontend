"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EmailVerified() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center shadow-m border border-gray-100 bg-gray-100 px-4 text-center">
    
      <div className="mb-12">
        <Image
          src="/logo.png"
          alt="Apartey Logo"
          width={140}
          height={40}
          className="mx-auto"
        />
      </div>

      {/* Checkmark Icon */}
      <div className="mb-8">
        <svg
          className="w-20 h-20 text-orange-500 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4"
          />
        </svg>
      </div>

    
      <h2 className="text-2xl font-semibold text-black mb-2">Email verified</h2>
      <p className="text-sm text-gray-600 mb-10">
        Congratulations, your email has been verified
      </p>

     
      <button
        onClick={() => router.push("/onboarding")} 
        className="bg-orange-500 hover:bg-orange-600  text-white font-medium py-2 px-6 rounded-md transition duration-200"
      >
        Continue
      </button>
    </div>
  );
}
