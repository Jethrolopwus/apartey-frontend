import React, { Suspense } from "react";
import ClaimProperty from "@/components/organisms/ClaimProperty";

export default async function ClaimPropertyDetailPage() {
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <div className="min-h-screen">
        <ClaimProperty />
      </div>
    </Suspense>
  );
}
