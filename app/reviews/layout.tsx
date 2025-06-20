//

"use client";
import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import { ReactNode } from "react";

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <ReviewFormProvider>{children}</ReviewFormProvider>;
}
