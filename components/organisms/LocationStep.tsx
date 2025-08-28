"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
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

// Form data interface
interface LocationFormData {
  searchAddress: string;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  streetAddress: string;
  apartment: string;
  state: string;
}

declare global {
  interface Window {
    google: unknown;
  }
}

const LocationStep: React.FC<StepProps> = ({ onNext, onBack, formData, setFormData }) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LocationFormData>({
    mode: 'onBlur',
    defaultValues: {
      searchAddress: formData.searchAddress || '',
      country: formData.country || '',
      city: formData.city || '',
      district: formData.district || '',
      zipCode: formData.zipCode || '',
      streetAddress: formData.streetAddress || '',
      apartment: formData.apartment || '',
      state: formData.state || '',
    }
  });

  // Watch form values for real-time updates (removed to prevent infinite loops)

  // Form state
  const [countryCode] = useState(formData.countryCode || 'NG');
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

        // Update form state using react-hook-form
        setValue('country', countryName);
        setValue('state', state);
        setValue('district', district);
        setValue('zipCode', postal);
        setValue('city', cityName);
        setValue('streetAddress', streetName);
        setValue('searchAddress', `${streetName} ${streetNumber}`.trim());
        setValue('apartment', '');
        setManualApartment("");

        // Update coordinates
        setCoordinates(newCoordinates);

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
  }, [countryCode, fetchApartments, setValue]);

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

  // Remove the automatic form data update to prevent infinite loops
  // Form data will be updated only when the form is submitted

  // Form submission handler
  const onSubmit = (data: LocationFormData) => {
    if (setFormData) {
      const locationData = {
        country: data.country,
        countryCode,
        stateOrRegion: data.state,
        district: data.district,
        street: data.streetAddress,
        apartment: data.apartment || manualApartment,
        postalCode: data.zipCode,
        fullAddress: data.searchAddress,
        coordinates: coordinates ? {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        } : undefined,
        displayOnMap: true
      };

      setFormData(prev => ({
        ...prev,
        searchAddress: data.searchAddress,
        country: data.country,
        city: data.city,
        district: data.district,
        zipCode: data.zipCode,
        streetAddress: data.streetAddress,
        apartment: data.apartment || manualApartment,
        countryCode,
        state: data.state,
        location: locationData
      }));
    }
    onNext();
  };

  const addressIndicator = selectedAddress.split(",");
  const arrLength = addressIndicator.length;
  const mark = addressIndicator[arrLength - 1];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Location</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}> 
        
        {/* Search Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search address <span className="text-red-500">*</span>
          </label>
                      <input
              {...register('searchAddress', { 
                required: 'Please enter a search address'
              })}
            ref={(e) => {
              register('searchAddress').ref(e);
              inputRef.current = e;
            }}
            onKeyDown={handleManualSearch}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
              errors.searchAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter address or search for location"
          />
          <p className="text-xs text-gray-500 mt-1">Try searching: &quot;29 Ilesa-Ife Road, Ilesa, Osun&quot;</p>
          {errors.searchAddress && (
            <p className="mt-2 text-sm text-red-600">{errors.searchAddress.message}</p>
          )}
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
                setValue('apartment', selectedApt?.kort_nr || "");
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
              {...register('country', { 
                required: 'Please enter a country'
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              {...register('city', { 
                required: 'Please enter a city'
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District <span className="text-red-500">*</span>
            </label>
            <input
              {...register('district', { 
                required: 'Please enter a district'
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                errors.district ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter district"
            />
            {errors.district && (
              <p className="mt-2 text-sm text-red-600">{errors.district.message}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal code <span className="text-red-500">*</span>
            </label>
            <input
              {...register('zipCode', { 
                required: 'Please enter a postal code'
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter zip code"
            />
            {errors.zipCode && (
              <p className="mt-2 text-sm text-red-600">{errors.zipCode.message}</p>
            )}
          </div>
        </div>

        {/* Street Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street address <span className="text-red-500">*</span>
          </label>
          <input
                          {...register('streetAddress', { 
                required: 'Please enter a street address'
              })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
              errors.streetAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter street address"
          />
          {errors.streetAddress && (
            <p className="mt-2 text-sm text-red-600">{errors.streetAddress.message}</p>
          )}
        </div>

        {/* Additional Location Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Apartment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment/Unit <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              {...register('apartment')}
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
                          {...register('state', { 
                required: 'Please enter a state/region'
              })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter state or region"
          />
          {errors.state && (
            <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>
          )}
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
        <div className="border-t-2 border-[#C85212] mt-8 pt-8"></div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            type="submit"
            className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#C85212' }}
            disabled={Object.keys(errors).length > 0}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationStep; 