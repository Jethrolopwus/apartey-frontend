"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setField, setMultipleFields } from '../../store/propertyReviewFormSlice';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Place {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

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
    google: any;
  }
}

const AddressForm: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.propertyReviewForm);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // Local state for UI only, but always sync with Redux
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [matchedAddresses, setMatchedAddresses] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>(location.countryCode?.toLowerCase() || "ng");
  const [streetName, setStreetName] = useState(location.street || "");
  const [streetNumber, setStreetNumber] = useState("");
  const [manualApartment, setManualApartment] = useState(location.apartment || "");
  const [apartment, setApartment] = useState(location.apartment || "");
  const [addressLine, setAddressLine] = useState(location.street ? `${location.street}` : "");
  const [district, setDistrict] = useState(location.district || "");
  const [state, setState] = useState(location.stateOrRegion || "");
  const [country, setCountry] = useState(location.country || "");
  const [postalCode, setPostalCode] = useState(location.postalCode || "");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(location.coordinates || null);
  const [city, setCity] = useState("");

  // Only prefill from Redux on first mount/restore
  const didPrefillRef = useRef(false);
  useEffect(() => {
    if (location && !didPrefillRef.current) {
      setCountry(location.country || "");
      setState(location.stateOrRegion || "");
      setDistrict(location.district || "");
      setPostalCode(location.postalCode || "");
      setAddressLine(location.street ? `${location.street}` : "");
      setStreetName(location.street || "");
      setApartment(location.apartment || "");
      setManualApartment(location.apartment || "");
      setCountryCode(location.countryCode?.toLowerCase() || "ng");
      setCoordinates(location.coordinates || null);
      didPrefillRef.current = true;
    }
  }, [location]);

  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.country === "EE" || data.country === "NG") {
          setCountryCode(data.country.toLowerCase());
        } else {
          setCountryCode("ng"); // fallback
        }
      })
      .catch(() => {
        setCountryCode("ng"); // fallback
      });
  }, []);

  useEffect(() => {
    if (!window.google) return;
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: countryCode },
      }
    );
    autocompleteRef.current.addListener("place_changed", async () => {
      const place: Place = autocompleteRef.current.getPlace();
      const components = place.address_components;
      const streetNumber =
        components.find((c) => c.types.includes("street_number"))?.long_name ||
        "";
      const streetName =
        components.find((c) => c.types.includes("route"))?.long_name || "";
      const districtRaw =
        components.find((c) => c.types.includes("sublocality"))?.long_name ||
        "";
      const countryName =
        components.find((c) => c.types.includes("country"))?.long_name || "";
      const stateRaw =
        components.find((c) => c.types.includes("administrative_area_level_1"))
          ?.long_name || "";
      const postal =
        components.find((c) => c.types.includes("postal_code"))?.long_name ||
        "";
      const capitalize = (str: string) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
      const district = capitalize(districtRaw);
      const state = capitalize(stateRaw);
      const coordinates: Coordinates | null = place.geometry?.location
        ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        : null;
      setCoordinates(coordinates);
      setCountry(countryName);
      setState(state);
      setDistrict(district);
      setPostalCode(postal);
      setAddressLine(`${streetName} ${streetNumber}`);
      setStreetName(streetName);
      setStreetNumber(streetNumber);
      setApartment("");
      await fetchApartments(`${streetName} ${streetNumber}`);
      const apt = apartment || manualApartment;
      const fullAddress = [
        streetNumber && streetName ? `${streetNumber} ${streetName}` : streetName,
        apt,
        district,
        state,
      ]
        .filter(Boolean)
        .join(", ");
      const locationPayload = {
        country: countryName,
        countryCode: countryCode.toUpperCase(),
        stateOrRegion: state,
        street: streetName,
        district: district,
        apartment: apt,
        postalCode: postal,
        fullAddress,
        coordinates,
      };
      dispatch(setMultipleFields(locationPayload));
      console.log("the Payload", locationPayload);
    });
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [countryCode, dispatch, apartment, manualApartment]);

  useEffect(() => {
    if (!addressLine) return;
    const apt = apartment || manualApartment;
    const fullAddress = [
      streetNumber && streetName ? `${streetNumber} ${streetName}` : streetName,
      apt,
      district,
      state,
    ]
      .filter(Boolean)
      .join(", ");
    const locationPayload = {
      country,
      countryCode: countryCode.toUpperCase(),
      stateOrRegion: state,
      street: streetName,
      district,
      apartment: apt,
      postalCode,
      fullAddress,
      coordinates,
    };
    dispatch(setMultipleFields(locationPayload));
    console.log("the Payload", locationPayload);
  }, [apartment, manualApartment, district, addressLine, country, countryCode, state, streetName, streetNumber, postalCode, coordinates, dispatch]);

  const handleManualSearch = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value.trim();
      if (!value) return;

      const cleaned = value
        .replace(/,\s*(Estonia|Eesti)\s*$/i, "")
        .replace(/\d{5}/g, "")
        .trim();

      await fetchApartments(cleaned);
    }
  };

  const fetchApartments = async (address: string) => {
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
  };

  const addressIndicator = selectedAddress.split(",");
  const arrLength = addressIndicator.length;
  const mark = addressIndicator[arrLength - 1];

  return (
    <div className="flex justify-center bg-gray-50 py-8 ">
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          {/* Address Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter Your country Address
            </label>
            <input
              ref={inputRef}
              className="w-full p-3 border border-gray-300 rounded-md frounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="apartment address"
              onKeyDown={handleManualSearch}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <p className="text-orange-600 text-sm">Fetching apartments...</p>
          )}

          {/* Multiple Addresses Dropdown */}
          {!loading && matchedAddresses?.length > 1 && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Matched Addresses:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Apartment:
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none">
                {apartments.map((apt, idx) => (
                  <option key={idx} value={apt.adr_id}>
                    {mark}–{apt.kort_nr || `${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual Apartment Entry */}
          {!loading && selectedAddress && apartments.length === 0 && (
            <div>
              <p className="text-gray-500 mb-2 text-sm">
                No registered apartments found. You can manually enter the
                apartment number.
              </p>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Apartment Number:
              </label>
              <input
                type="text"
                placeholder="e.g., Flat 2A, Room 3B, Left Wing"
                value={manualApartment}
                onChange={(e) => setManualApartment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          )}

          {/* Address Details Form */}
          {addressLine && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    readOnly={!!country}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      country ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    readOnly={!!state}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      state ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    // readOnly={!!district}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      district ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    readOnly={!!postalCode}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      postalCode ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  readOnly={!!addressLine}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                    addressLine ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Map Preview */}
          {/* {coordinates && (
            <div className="pt-4 border-t border-gray-200">
               <label className="block mb-2 text-sm font-medium text-gray-700">
                Location Preview
              </label> *
               <img
                className="w-full h-64 object-cover rounded-lg border border-gray-300"
                alt="Map preview"
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=16&size=600x300&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=AIzaSyC_mwAjirr_vXt1xL1WlL-entKBwD7FkqY`}
              /> 
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
