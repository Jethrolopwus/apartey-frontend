"use client";

import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import Hero from "@/components/organisms/Hero";
import { useEffect } from "react";
import socket from "@/utils/socket";
import { useAppSelector } from "@/store";
import type { RootState } from "@/store";
import HomeListingsPreview from "@/components/organisms/HomeListingsPreview";
export default function Home() {
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div>
      <Hero />
      {/* <ReviewsSection/> */}
      <HomeListingsPreview />
      <CategoryComponent />
      <BlogComponent />
      <ExperienceComponent />
    </div>
  );
}
