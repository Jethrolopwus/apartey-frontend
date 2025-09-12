"use client";
import SignUp from "@/components/organisms/SignUp";
import AparteyLoader from "@/components/atoms/Loader";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <SignUp />
    </Suspense>
  );
}




