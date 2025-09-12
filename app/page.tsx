"use client";
import { useState, useEffect, Suspense } from "react";
import BlogComponent from "@/components/organisms/Blog";
import CategoryComponent from "@/components/organisms/Category";
import ExperienceComponent from "@/components/organisms/Experiences";
import Hero from "@/components/organisms/Hero";
import socket from "@/utils/socket";
import { useAppSelector } from "@/store";
import type { RootState } from "@/store";
import HomeListingsPreview from "@/components/organisms/HomeListingsPreview";
import { useGetUserLocationQuery } from "@/Hooks/use-getUserLocation.query";
import { userLocationData } from "@/types/generated";
import AparteyLoader from "@/components/atoms/Loader";

export default function Home() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  // Use the user's countryCode or fallback to "EE"
  const initialCountryCode = user?.countryCode || "EE";
  // Restrict country code to "NG" or "EE", default to "EE" if neither
  const countryCode =
    initialCountryCode === "NG" || initialCountryCode === "EE"
      ? initialCountryCode
      : "EE";

  const { data, isLoading, error } = useGetUserLocationQuery(countryCode);
  const [location, setLocation] = useState<userLocationData | null>(null);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      // Ensure stored location is either "NG" or "EE", else default to "EE"
      const validCountryCode =
        parsedLocation.countryCode === "NG" ||
        parsedLocation.countryCode === "EE"
          ? parsedLocation.countryCode
          : "EE";
      setLocation({
        countryCode: validCountryCode,
        countryName: validCountryCode === "NG" ? "Nigeria" : "Estonia",
      });
      return;
    }

    if (data) {
      // Restrict to "NG" or "EE", default to "EE" if neither
      const validCountryCode =
        data.countryCode === "NG" || data.countryCode === "EE"
          ? data.countryCode
          : "EE";
      const locationData: userLocationData = {
        countryCode: validCountryCode,
        countryName: validCountryCode === "NG" ? "Nigeria" : "Estonia",
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));
      setLocation(locationData);
    }

    if (error) {
      const defaultLocation: userLocationData = {
        countryCode: "EE",
        countryName: "Estonia",
      };
      localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
      setLocation(defaultLocation);
    }
  }, [data, error]);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <AparteyLoader />
        </div>
      }
    >
      <div>
        <Hero />
        <HomeListingsPreview />
        <CategoryComponent />
        <BlogComponent />
        <ExperienceComponent />
        {isLoading ? (
          <p>Loading location...</p>
        ) : location ? (
          <div>
            <p>
              Country: {location.countryName} ({location.countryCode})
            </p>
          </div>
        ) : (
          <p>Unable to load location</p>
        )}
      </div>
    </Suspense>
  );
}
