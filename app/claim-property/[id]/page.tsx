"use client";
import React, { Suspense } from "react";
import ClaimProperty from "@/components/organisms/ClaimProperty";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ClaimPropertyDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Loading property details...</div>}>
      <div className="min-h-screen">
        <ClaimProperty />
      </div>
    </Suspense>
  );
}
