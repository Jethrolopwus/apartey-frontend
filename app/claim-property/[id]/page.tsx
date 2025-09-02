"use client";
import React, { Suspense } from "react";
import ClaimProperty from "@/components/organisms/ClaimProperty";



export default function ClaimPropertyDetailPage() {
  return (
    <Suspense fallback={<div>Loading property details...</div>}>
      <div className="min-h-screen">
        <ClaimProperty />
      </div>
    </Suspense>
  );
}
