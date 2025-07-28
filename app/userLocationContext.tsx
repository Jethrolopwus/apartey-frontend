"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useGetUserLocationQuery } from "@/Hooks/use-getUserLocation.query";
import type { userLocationData } from "@/types/generated";

interface LocationContextType {
  location: userLocationData | null;
  isLoading: boolean;
  error: unknown;
  selectedCountryCode: string;
  setSelectedCountryCode: (countryCode: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("EE");
  const [location, setLocation] = useState<userLocationData | null>(null);
  const { data, isLoading, error } =
    useGetUserLocationQuery(selectedCountryCode);

  // Initialize selectedCountryCode from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = localStorage.getItem("selectedCountryCode");
      if (storedCountryCode) {
        setSelectedCountryCode(storedCountryCode);
      }
    }
  }, []);

  useEffect(() => {
    // Store selected country code in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCountryCode", selectedCountryCode);
    }

    // Check localStorage for existing location data
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("userLocation");
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        // Only use stored location if it matches the selected country code
        if (parsedLocation.countryCode === selectedCountryCode) {
          setLocation(parsedLocation);
          return;
        }
      }
    }

    // If API data is available, store it and update state
    if (data) {
      const locationData: userLocationData = {
        countryCode: data.countryCode,
        countryName: data.countryName,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("userLocation", JSON.stringify(locationData));
      }
      setLocation(locationData);
    }

    // Handle errors by setting a default location
    if (error) {
      console.error("Error fetching location:", error);
      const defaultLocation: userLocationData = {
        countryCode: "UNKNOWN",
        countryName: "Unknown",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
      }
      setLocation(defaultLocation);
    }
  }, [data, error, selectedCountryCode]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        selectedCountryCode,
        setSelectedCountryCode,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
