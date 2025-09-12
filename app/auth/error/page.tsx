"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 px-6 py-8 shadow-xl bg-white rounded-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error during authentication:
          </p>
          <p className="text-sm bg-gray-100 p-3 rounded font-mono">
            {error || "Unknown error"}
          </p>
          <div className="mt-6 space-y-2">
            <Link
              href="/signin"
              className="block w-full bg-[#C85212] text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
