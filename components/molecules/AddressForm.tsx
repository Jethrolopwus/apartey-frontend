"use client";
import { useEffect, useState, useRef, useCallback } from "react"; // Add useCallback
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setMultipleFields } from "../../store/propertyReviewFormSlice";
import { useLocation } from "@/app/userLocationContext";

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

interface AddressFormProps {
  readOnly?: boolean;
  prefilledData?: {
    country: string;
    countryCode: string;
    stateOrRegion: string;
    street: string;
    apartment: string;
    district: string;
    postalCode: string;
    city: string;
    streetAddress: string;
    coordinates?: Coordinates | null;
  };
}

declare global {
  interface Window {
    google: unknown;
  }
}

const AddressForm: React.FC<AddressFormProps> = ({
  readOnly = false,
  prefilledData,
}) => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.propertyReviewForm);
  const { selectedCountryCode, location: userLocation } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const didPrefillRef = useRef<boolean>(false);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [matchedAddresses, setMatchedAddresses] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>(
    prefilledData?.countryCode?.toLowerCase() ||
      location.countryCode?.toLowerCase() ||
      selectedCountryCode ||
      "ng"
  );
  const [streetName, setStreetName] = useState(
    prefilledData?.street || location.street || ""
  );
  const [streetNumber, setStreetNumber] = useState(
    prefilledData?.streetAddress || ""
  );
  const [manualApartment, setManualApartment] = useState(
    prefilledData?.apartment || location.apartment || ""
  );
  const [apartment, setApartment] = useState(
    prefilledData?.apartment || location.apartment || ""
  );
  const [addressLine, setAddressLine] = useState(
    prefilledData?.street
      ? `${prefilledData.street}`
      : location.street
      ? `${location.street}`
      : ""
  );
  const [district, setDistrict] = useState(
    prefilledData?.district || location.district || ""
  );
  const [state, setState] = useState(
    prefilledData?.stateOrRegion || location.stateOrRegion || ""
  );
  const [country, setCountry] = useState(
    prefilledData?.country ||
      location.country ||
      userLocation?.countryName ||
      ""
  );
  const [postalCode, setPostalCode] = useState(
    prefilledData?.postalCode || location.postalCode || ""
  );
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    prefilledData?.coordinates || location.coordinates || null
  );

  // Prefill from Redux or props on first mount
  useEffect(() => {
    if (didPrefillRef.current) return;
    const source = readOnly && prefilledData ? prefilledData : location;
    setCountry(source.country || userLocation?.countryName || "");
    setState(source.stateOrRegion || "");
    setDistrict(source.district || "");
    setPostalCode(source.postalCode || "");
    setAddressLine(source.street ? `${source.street}` : "");
    setStreetName(source.street || "");
    setApartment(source.apartment || "");
    setManualApartment(source.apartment || "");
    setCountryCode(
      source.countryCode?.toLowerCase() || selectedCountryCode || "ng"
    );
    setCoordinates(source.coordinates || null);
    didPrefillRef.current = true;

    // Dispatch prefilled data to Redux if provided
    if (readOnly && prefilledData) {
      const fullAddress = [
        prefilledData.street,
        prefilledData.apartment,
        prefilledData.district,
        prefilledData.stateOrRegion,
      ]
        .filter(Boolean)
        .join(", ");
      dispatch(
        setMultipleFields({
          country: prefilledData.country || "",
          countryCode: prefilledData.countryCode?.toUpperCase() || "NG",
          stateOrRegion: prefilledData.stateOrRegion || "",
          street: prefilledData.street || "",
          district: prefilledData.district || "",
          apartment: prefilledData.apartment || "",
          postalCode: prefilledData.postalCode || "",
          fullAddress,
          coordinates: prefilledData.coordinates || null,
        })
      );
    }
  }, [
    prefilledData,
    location,
    userLocation,
    selectedCountryCode,
    readOnly,
    dispatch,
  ]);

  // Sync countryCode with selectedCountryCode from context (if not read-only)
  useEffect(() => {
    if (readOnly) return;
    setCountryCode(selectedCountryCode.toLowerCase() || "ng");
    if (userLocation?.countryName) {
      setCountry(userLocation.countryName);
      dispatch(
        setMultipleFields({
          country: userLocation.countryName,
          countryCode: selectedCountryCode.toUpperCase(),
        })
      );
    }
  }, [selectedCountryCode, userLocation, dispatch, readOnly]);

  // Memoize fetchApartments to stabilize its reference
  const fetchApartments = useCallback(
    async (address: string) => {
      if (readOnly) return;
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
    [readOnly]
  ); // Dependencies of fetchApartments

  // Google Maps Autocomplete (disabled in read-only mode)
  useEffect(() => {
    if (readOnly || !window.google) return;
    const googleObj = window.google as typeof google | undefined;
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
        const place =
          autocompleteRef.current.getPlace() as google.maps.places.PlaceResult;
        const components = place.address_components || [];
        const streetNumber =
          components.find((c) => c.types.includes("street_number"))
            ?.long_name || "";
        const streetName =
          components.find((c) => c.types.includes("route"))?.long_name || "";
        const districtRaw =
          components.find((c) => c.types.includes("sublocality"))?.long_name ||
          "";
        const countryName =
          components.find((c) => c.types.includes("country"))?.long_name || "";
        const stateRaw =
          components.find((c) =>
            c.types.includes("administrative_area_level_1")
          )?.long_name || "";
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
        setAddressLine(`${streetName} ${streetNumber}`.trim());
        setStreetName(streetName);
        setStreetNumber(streetNumber);
        setApartment("");
        await fetchApartments(`${streetName} ${streetNumber}`.trim());
        const apt = apartment || manualApartment;
        const fullAddress = [
          streetNumber && streetName
            ? `${streetNumber} ${streetName}`
            : streetName,
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
    }
    return () => {
      const googleObj = window.google as typeof google | undefined;
      if (
        autocompleteRef.current &&
        googleObj?.maps?.event?.clearInstanceListeners
      ) {
        googleObj.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [
    countryCode,
    dispatch,
    apartment,
    manualApartment,
    readOnly,
    fetchApartments,
  ]); // Added fetchApartments

  // Sync form data with Redux (disabled in read-only mode)
  useEffect(() => {
    if (readOnly || !addressLine) return;
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
  }, [
    apartment,
    manualApartment,
    district,
    addressLine,
    country,
    countryCode,
    state,
    streetName,
    streetNumber,
    postalCode,
    coordinates,
    dispatch,
    readOnly,
  ]);

  const handleManualSearch = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (readOnly || e.key !== "Enter") return;
    const value = (e.target as HTMLInputElement).value.trim();
    if (!value) return;

    const cleaned = value
      .replace(/,\s*(Estonia|Eesti|Nigeria)\s*$/i, "")
      .replace(/\d{5}/g, "")
      .trim();

    await fetchApartments(cleaned);
  };

  const addressIndicator = selectedAddress.split(",");
  const arrLength = addressIndicator.length;
  const mark = addressIndicator[arrLength - 1];

  return (
    <div className="flex justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          {/* Address Input (Hidden in read-only mode) */}
          {!readOnly && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Enter Your {country || "Country"} Address
              </label>
              <input
                ref={inputRef}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Apartment address"
                onKeyDown={handleManualSearch}
                readOnly={readOnly}
              />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <p className="text-orange-600 text-sm">Fetching apartments...</p>
          )}

          {/* Multiple Addresses Dropdown (Hidden in read-only mode) */}
          {!readOnly && !loading && matchedAddresses?.length > 1 && (
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

          {/* Apartment Selection (Hidden in read-only mode) */}
          {!readOnly && !loading && apartments.length > 0 && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Apartment:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none"
                onChange={(e) => {
                  const selectedApt = apartments.find(
                    (apt) => apt.adr_id === e.target.value
                  );
                  setApartment(selectedApt?.kort_nr || "");
                  dispatch(
                    setMultipleFields({
                      apartment: selectedApt?.kort_nr || "",
                    })
                  );
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
          {!readOnly &&
            !loading &&
            apartments.length === 0 &&
            selectedAddress && (
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
                  onChange={(e) => {
                    setManualApartment(e.target.value);
                    dispatch(
                      setMultipleFields({
                        apartment: e.target.value,
                      })
                    );
                  }}
                  readOnly={readOnly}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                    readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            )}

          {/* Address Details Form */}
          {(addressLine || readOnly) && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      dispatch(
                        setMultipleFields({
                          country: e.target.value,
                        })
                      );
                    }}
                    readOnly={readOnly || !!country}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      readOnly || country
                        ? "bg-gray-50 cursor-not-allowed"
                        : "bg-white"
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
                    onChange={(e) => {
                      setState(e.target.value);
                      dispatch(
                        setMultipleFields({
                          stateOrRegion: e.target.value,
                        })
                      );
                    }}
                    readOnly={readOnly || !!state}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      readOnly || state
                        ? "bg-gray-50 cursor-not-allowed"
                        : "bg-white"
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
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      dispatch(
                        setMultipleFields({
                          district: e.target.value,
                        })
                      );
                    }}
                    readOnly={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
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
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      dispatch(
                        setMultipleFields({
                          postalCode: e.target.value,
                        })
                      );
                    }}
                    readOnly={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
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
                  onChange={(e) => {
                    setAddressLine(e.target.value);
                    setStreetName(e.target.value);
                    dispatch(
                      setMultipleFields({
                        street: e.target.value,
                      })
                    );
                  }}
                  readOnly={readOnly || !!addressLine}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                    readOnly || addressLine
                      ? "bg-gray-50 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </div>

              {readOnly && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Apartment Number
                  </label>
                  <input
                    type="text"
                    value={manualApartment}
                    readOnly={readOnly}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 outline-none ${
                      readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
