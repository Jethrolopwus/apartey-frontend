"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import HomeSwapDetails from "@/components/organisms/HomeSwapDetails";

export default function HomeSwapDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <div className="min-h-screen">
        <HomeSwapDetails id={id} />
      </div>
    </Suspense>
  );
}
