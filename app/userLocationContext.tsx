"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useGetUserLocationQuery, useDetectUserLocation } from "@/Hooks/use-getUserLocation.query";
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isManualChange, setIsManualChange] = useState(false);
  
  // Use IP detection for initial location
  const { data: ipLocationData, isLoading: ipLoading, error: ipError } = useDetectUserLocation();
  const { data, isLoading, error } = useGetUserLocationQuery(selectedCountryCode);

  // Initialize selectedCountryCode from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = localStorage.getItem("selectedCountryCode");
      if (storedCountryCode) {
        setSelectedCountryCode(storedCountryCode);
      }
    }
  }, []);

  // Handle IP-based location detection
  useEffect(() => {
    if (ipLocationData && !hasInitialized) {
      // console.log("🌍 IP location detected:", ipLocationData);
      
      // Set the country code based on IP detection
      setSelectedCountryCode(ipLocationData.countryCode);
      
      // Store the detected location
      if (typeof window !== "undefined") {
        localStorage.setItem("userLocation", JSON.stringify(ipLocationData));
        localStorage.setItem("selectedCountryCode", ipLocationData.countryCode);
        // console.log("📍 Location stored in localStorage:", ipLocationData);
      }
      
      setLocation(ipLocationData);
      setHasInitialized(true);
    }
  }, [ipLocationData, hasInitialized]);

  // Handle IP detection errors
  useEffect(() => {
    if (ipError && !hasInitialized) {
      // console.error("❌ IP location detection failed:", ipError);
      const defaultLocation: userLocationData = {
        countryCode: "EE",
        countryName: "Estonia",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
        localStorage.setItem("selectedCountryCode", "EE");
      }
      setLocation(defaultLocation);
      setHasInitialized(true);
    }
  }, [ipError, hasInitialized]);

  // Handle manual country code changes
  useEffect(() => {
    if (hasInitialized && isManualChange) {
      // console.log("🔄 User manually changed country code to:", selectedCountryCode);
      
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
            setIsManualChange(false);
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
        setIsManualChange(false);
      }

      // Handle errors by setting a default location
      if (error && !location) {
        console.error("Error fetching location:", error);
        const defaultLocation: userLocationData = {
          countryCode: "EE",
          countryName: "Estonia",
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
        }
        setLocation(defaultLocation);
        setIsManualChange(false);
      }
    }
  }, [selectedCountryCode, data, error, hasInitialized, isManualChange, location]);

  // Custom setter for selectedCountryCode that marks manual changes
  const handleCountryCodeChange = (countryCode: string) => {
    if (hasInitialized) {
      setIsManualChange(true);
    }
    setSelectedCountryCode(countryCode);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading: ipLoading || isLoading,
        error: ipError || error,
        selectedCountryCode,
        setSelectedCountryCode: handleCountryCodeChange,
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

