"use client";
import { Suspense } from "react";
import ClaimProperty from "@/components/organisms/ClaimProperty";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ClaimProperty />
    </Suspense>
  );
} 