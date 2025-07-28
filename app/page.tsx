"use client";
import { useState, useEffect } from "react";
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

export default function Home() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [location, setLocation] = useState<userLocationData | null>(null);

  const { data, isLoading, error } = useGetUserLocationQuery();

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
      setLocation(JSON.parse(storedLocation));
      return;
    }

    // If API data is available, store it and update state
    if (data) {
      const locationData: userLocationData = {
        countryCode: data.countryCode,
        countryName: data.countryName,
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));
      setLocation(locationData);
    }

    // Handle errors by setting a default location
    if (error) {
      console.error("Error fetching location:", error);
      const defaultLocation: userLocationData = {
        countryCode: "UNKNOWN",
        countryName: "Unknown",
      };
      localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
      setLocation(defaultLocation);
    }
  }, [data, error]); // Run when data or error changes

  return (
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
  );
}
