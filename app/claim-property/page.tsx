"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page since no property ID is provided
    router.push("/homeowner-profile");
  }, [router]);

  return (
    <div className="p-8 text-center">
      <div className="text-gray-500 mb-4">Redirecting...</div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212] mx-auto"></div>
    </div>
  );
} 