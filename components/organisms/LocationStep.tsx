"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { StepProps } from '@/types/propertyListing';

// Estonian Address API Types
interface Apartment {
  adr_id: string;
  kort_nr: string;
}

interface Building {
  onkort: string;
  appartments: Apartment[];
  pikkaadress: string;
}

interface ApiResponse {
  addresses: Building[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: unknown;
  }
}

const LocationStep: React.FC<StepProps> = ({ onNext, onBack, formData, setFormData }) => {
  // Form state
  const [searchAddress, setSearchAddress] = useState(formData.searchAddress || '');
  const [country, setCountry] = useState(formData.country || '');
  const [city, setCity] = useState(formData.city || '');
  const [district, setDistrict] = useState(formData.district || '');
  const [zipCode, setZipCode] = useState(formData.zipCode || '');
  const [streetAddress, setStreetAddress] = useState(formData.streetAddress || '');
  const [apartment, setApartment] = useState(formData.apartment || '');
  const [countryCode] = useState(formData.countryCode || 'NG');
  const [state, setState] = useState(formData.state || '');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    formData.location?.coordinates ? {
      lat: formData.location.coordinates.latitude || 0,
      lng: formData.location.coordinates.longitude || 0
    } : null
  );

  // Google Maps and Address API state
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [matchedAddresses, setMatchedAddresses] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [manualApartment, setManualApartment] = useState(formData.apartment || "");

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Memoize fetchApartments to stabilize its reference
  const fetchApartments = useCallback(
    async (address: string) => {
      setLoading(true);
      setApartments([]);
      setMatchedAddresses([]);
      setSelectedAddress(address);

      try {
        const encoded = encodeURIComponent(address);
        const response = await fetch(
          `https://inaadress.maaamet.ee/inaadress/gazetteer?address=${encoded}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const text = await response.text();
        const jsonStr = text.replace(/^callback\(|\);$/g, "");
        const data: ApiResponse = JSON.parse(jsonStr);

        const buildings = data.addresses?.filter(
          (b) => b.onkort === "1" && Array.isArray(b.appartments)
        );

        setMatchedAddresses(buildings);

        if (buildings?.length > 0) {
          setApartments(buildings[0].appartments);
          setSelectedAddress(buildings[0].pikkaadress);
        }
      } catch (err) {
        console.error("Failed to fetch apartments:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initialize Google Maps
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const googleObj = window.google as typeof google;
    
    // Initialize map
    const map = new googleObj.maps.Map(mapRef.current, {
      center: coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : { lat: 9.0579, lng: 7.4951 }, // Default to Abuja
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add marker if coordinates exist
    if (coordinates) {
      const marker = new googleObj.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map: map,
        draggable: true,
        title: "Property Location",
      });

      markerRef.current = marker;

      // Handle marker drag
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          const newCoordinates = {
            lat: position.lat(),
            lng: position.lng(),
          };
          setCoordinates(newCoordinates);
        }
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [coordinates]);

  // Google Maps Autocomplete
  useEffect(() => {
    if (!window.google) return;
    
    const googleObj = window.google as typeof google;
    if (inputRef.current && googleObj?.maps?.places?.Autocomplete) {
      autocompleteRef.current = new googleObj.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: countryCode },
        }
      );

      autocompleteRef.current.addListener("place_changed", async () => {
        if (!autocompleteRef.current) return;
        
        const place = autocompleteRef.current.getPlace() as google.maps.places.PlaceResult;
        const components = place.address_components || [];
        
        // Parse address components
        const streetNumber = components.find((c) => c.types.includes("street_number"))?.long_name || "";
        const streetName = components.find((c) => c.types.includes("route"))?.long_name || "";
        const districtRaw = components.find((c) => c.types.includes("sublocality"))?.long_name || "";
        const countryName = components.find((c) => c.types.includes("country"))?.long_name || "";
        const stateRaw = components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name || "";
        const postal = components.find((c) => c.types.includes("postal_code"))?.long_name || "";
        const cityName = components.find((c) => c.types.includes("locality"))?.long_name || "";
        
        const capitalize = (str: string) =>
          str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
        
        const district = capitalize(districtRaw);
        const state = capitalize(stateRaw);
        
        // Get coordinates
        const newCoordinates: Coordinates | null = place.geometry?.location
          ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          : null;

        // Update form state
        setCoordinates(newCoordinates);
        setCountry(countryName);
        setState(state);
        setDistrict(district);
        setZipCode(postal);
        setCity(cityName);
        setStreetAddress(streetName);
        setSearchAddress(`${streetName} ${streetNumber}`.trim());
        setApartment("");
        setManualApartment("");

        // Update map
        if (newCoordinates && mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat: newCoordinates.lat, lng: newCoordinates.lng });
          
          if (markerRef.current) {
            markerRef.current.setPosition({ lat: newCoordinates.lat, lng: newCoordinates.lng });
          } else {
            const googleObj = window.google as typeof google;
            markerRef.current = new googleObj.maps.Marker({
              position: { lat: newCoordinates.lat, lng: newCoordinates.lng },
              map: mapInstanceRef.current,
              draggable: true,
              title: "Property Location",
            });

            markerRef.current.addListener("dragend", () => {
              const position = markerRef.current?.getPosition();
              if (position) {
                const updatedCoordinates = {
                  lat: position.lat(),
                  lng: position.lng(),
                };
                setCoordinates(updatedCoordinates);
              }
            });
          }
        }

        // Fetch apartments for Estonian addresses
        if (countryCode.toLowerCase() === 'ee') {
          await fetchApartments(`${streetName} ${streetNumber}`.trim());
        }
      });
    }

    return () => {
      const googleObj = window.google as typeof google;
      if (autocompleteRef.current && googleObj?.maps?.event?.clearInstanceListeners) {
        googleObj.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [countryCode, fetchApartments]);

  // Handle manual search
  const handleManualSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const value = (e.target as HTMLInputElement).value.trim();
    if (!value) return;

    const cleaned = value
      .replace(/,\s*(Estonia|Eesti|Nigeria)\s*$/i, "")
      .replace(/\d{5}/g, "")
      .trim();

    if (countryCode.toLowerCase() === 'ee') {
      await fetchApartments(cleaned);
    }
  };

  // Update form data when any field changes
  useEffect(() => {
    if (setFormData) {
      const locationData = {
        country,
        countryCode,
        stateOrRegion: state,
        district,
        street: streetAddress,
        apartment: apartment || manualApartment,
        postalCode: zipCode,
        fullAddress: searchAddress,
        coordinates: coordinates ? {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        } : undefined,
        displayOnMap: true
      };

      setFormData(prev => ({
        ...prev,
        searchAddress,
        country,
        city,
        district,
        zipCode,
        streetAddress,
        apartment: apartment || manualApartment,
        countryCode,
        state,
        location: locationData
      }));
    }
  }, [
    searchAddress, country, city, district, zipCode, streetAddress, 
    apartment, manualApartment, countryCode, state, coordinates, setFormData
  ]);

  const handleNext = () => {
    onNext();
  };

  const addressIndicator = selectedAddress.split(",");
  const arrLength = addressIndicator.length;
  const mark = addressIndicator[arrLength - 1];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Location</h1>
      
      {/* Search Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search address <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyDown={handleManualSearch}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          placeholder="Enter address or search for location"
        />
        <p className="text-xs text-gray-500 mt-1">Try searching: &quot;29 Ilesa-Ife Road, Ilesa, Osun&quot;</p>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-orange-600 text-sm mb-4">Fetching apartments...</p>
      )}

      {/* Multiple Addresses Dropdown */}
      {!loading && matchedAddresses?.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matched Addresses:
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
            onChange={(e) => {
              const index = parseInt(e.target.value);
              setApartments(matchedAddresses[index].appartments);
              setSelectedAddress(matchedAddresses[index].pikkaadress);
            }}
          >
            {matchedAddresses.map((b, i) => (
              <option key={i} value={i}>
                {b.pikkaadress}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Apartment Selection */}
      {!loading && apartments.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Apartment:
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white"
            onChange={(e) => {
              const selectedApt = apartments.find(
                (apt) => apt.adr_id === e.target.value
              );
              setApartment(selectedApt?.kort_nr || "");
            }}
          >
            {apartments.map((apt, idx) => (
              <option key={idx} value={apt.adr_id}>
                {mark}–{apt.kort_nr || `${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Manual Apartment Entry */}
      {!loading && apartments.length === 0 && selectedAddress && (
        <div className="mb-6">
          <p className="text-gray-500 mb-2 text-sm">
            No registered apartments found. You can manually enter the apartment number.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment Number:
          </label>
          <input
            type="text"
            placeholder="e.g., Flat 2A, Room 3B, Left Wing"
            value={manualApartment}
            onChange={(e) => setManualApartment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
      )}

      {/* Location Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Enter country"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Enter city"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Enter district"
          />
        </div>

        {/* Zip Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Enter zip code"
          />
        </div>
      </div>

      {/* Street Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          placeholder="Enter street address"
        />
      </div>

      {/* Additional Location Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Apartment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment/Unit <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={apartment || manualApartment}
            onChange={(e) => {
              if (apartments.length > 0) {
                setApartment(e.target.value);
              } else {
                setManualApartment(e.target.value);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="e.g., Flat 2B, Apt 15"
          />
        </div>
      </div>

      {/* State/Region */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/Region <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          placeholder="Enter state or region"
        />
      </div>

      {/* Real Map Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Display on the map</h3>
        <p className="text-xs text-gray-500 mb-4">You can change the position of the mark on the map</p>
        
        {/* Real Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200"
        >
          {/* Map will be rendered here by Google Maps */}
        </div>
        
        {/* Coordinates Display */}
        {coordinates && (
          <div className="mt-2 text-xs text-gray-500">
            Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C85212' }}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default LocationStep; 