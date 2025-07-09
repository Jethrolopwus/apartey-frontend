"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useForm, Controller, Control, RegisterOptions } from "react-hook-form";
import { ChevronDown } from "lucide-react";

export type LocationFields = {
  country: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  streetAddress: string;
  apartmentNumber?: string;
};

export interface LocationFormRef {
  submit: () => Promise<LocationFields>;
  getValues: () => LocationFields;
  setAddress: (vals: Partial<LocationFields>) => void;
}

interface EstonianBuilding {
  pikkaadress: string;
  appartments: Array<{
    adr_id: string;
    kort_nr: string;
  }>;
  onkort: string;
}

interface EstonianApiResponse {
  addresses: EstonianBuilding[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/* ------------------------------------------------------------------ */
/*  Static Data for African Countries                                 */
/* ------------------------------------------------------------------ */
const STATE_OPTIONS: Record<string, string[]> = {
  nigeria: [
    "Abuja FCT",
    "Lagos",
    "Kano",
    "Rivers",
    "Oyo",
    "Kaduna",
    "Ogun",
    "Katsina",
    "Cross River",
    "Delta",
  ],
  ghana: [
    "Greater Accra",
    "Ashanti",
    "Northern",
    "Central",
    "Eastern",
    "Western",
    "Volta",
    "Upper East",
  ],
  kenya: [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Thika",
    "Malindi",
    "Kitale",
  ],
  "south-africa": [
    "Western Cape",
    "Gauteng",
    "KwaZulu-Natal",
    "Eastern Cape",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Free State",
    "Northern Cape",
  ],
  estonia: [
    "Harju County",
    "Tartu County",
    "Ida-Viru County",
    "Pärnu County",
    "Lääne-Viru County",
  ],
};

const CITY_OPTIONS: Record<string, string[]> = {
  nigeria: ["Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt"],
  ghana: ["Accra", "Kumasi", "Tamale", "Cape Coast"],
  kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  "south-africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
  estonia: ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve"],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const LocationForm = forwardRef<LocationFormRef>((_, ref) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFields>({
    defaultValues: {
      country: "",
      city: "",
      state: "",
      district: "",
      zipCode: "",
      streetAddress: "",
      apartmentNumber: "",
    },
  });

  const selectedCountry = watch("country");
  const streetAddress = watch("streetAddress");

  const [countryCode, setCountryCode] = useState("ng");
  const [matchedAddresses, setMatchedAddresses] = useState<EstonianBuilding[]>(
    []
  );
  const [apartments, setApartments] = useState<
    Array<{ adr_id: string; kort_nr: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] =
    useState<EstonianBuilding | null>(null);

  // Google Maps refs
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  /* ------------------------------------------------------------------ */
  /*  Auto-detect user country via IP (like App component)             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Detected country:", data.country);
        if (data.country === "EE" || data.country === "NG") {
          setCountryCode(data.country.toLowerCase());

          // Auto-set the country in form based on detection
          const countryMapping: Record<string, string> = {
            EE: "estonia",
            NG: "nigeria",
          };

          const detectedCountryKey = countryMapping[data.country] || "";
          if (detectedCountryKey) {
            setValue("country", detectedCountryKey);
          }
        }
      })
      .catch((err) => console.log("IP detection failed:", err));
  }, [setValue]);

  /* ------------------------------------------------------------------ */
  /*  Google Maps Autocomplete Setup (exactly like App component)      */
  /* ------------------------------------------------------------------ */
  const fetchEstonianApartments = useCallback(async (address: string) => {
    setLoading(true);
    setApartments([]);
    setMatchedAddresses([]);
    setSelectedBuilding(null);

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
      const data: EstonianApiResponse = JSON.parse(jsonStr);

      const buildings = data.addresses.filter(
        (b) => b.onkort === "1" && Array.isArray(b.appartments)
      );

      setMatchedAddresses(buildings);

      if (buildings.length > 0) {
        setSelectedBuilding(buildings[0]);
        setApartments(buildings[0].appartments);
        setValue("streetAddress", buildings[0].pikkaadress);
      }
    } catch (err) {
      console.error("Failed to fetch apartments:", err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setApartments, setMatchedAddresses, setSelectedBuilding, setValue]);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: countryCode },
      }
    );

    if (!autocompleteRef.current) return;

    autocompleteRef.current.addListener("place_changed", async () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place) return;

      const components = place.address_components as AddressComponent[] || [];

      const streetNumber =
        components.find((c) => c.types.includes("street_number"))?.long_name || "";
      const streetName =
        components.find((c) => c.types.includes("route"))?.long_name || "";
      const city =
        components.find((c) => c.types.includes("locality"))?.long_name ||
        components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name ||
        "";
      const countryName =
        components.find((c) => c.types.includes("country"))?.long_name ||
        "";
      console.log("Google Maps country:", countryName);
      const stateName =
        components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name || "";
      const postal =
        components.find((c) => c.types.includes("postal_code"))?.long_name || "";

      const cleanedAddress = `${streetName} ${streetNumber}, ${city}`;

      // Auto-fill form fields
      setValue(
        "country",
        countryName.toLowerCase() === "estonia"
          ? "estonia"
          : countryName.toLowerCase()
      );
      setValue("state", stateName);
      setValue("city", city);
      setValue("zipCode", postal);
      setValue("streetAddress", `${streetName} ${streetNumber}`);

      await fetchEstonianApartments(cleanedAddress);
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [countryCode, setValue, fetchEstonianApartments]);

  /* ------------------------------------------------------------------ */
  /*  Manual search handler (exactly like App component)               */
  /* ------------------------------------------------------------------ */
  const handleManualSearch = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (!value) return;

      const cleaned = value
        .replace(/,\s*(Estonia|Eesti)\s*$/i, "")
        .replace(/\d{5}/g, "")
        .trim();

      await fetchEstonianApartments(cleaned);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Expose methods to parent                                          */
  /* ------------------------------------------------------------------ */
  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => handleSubmit(resolve, reject)()),
    getValues,
    setAddress: (vals) => {
      Object.keys(vals).forEach((key) => {
        const value = vals[key as keyof LocationFields];
        if (value) {
          setValue(key as keyof LocationFields, value);
        }
      });
    },
  }));

  /* ------------------------------------------------------------------ */
  /*  Render Helpers                                                    */
  /* ------------------------------------------------------------------ */
  const isEstonia = selectedCountry === "estonia";

  const getAddressIndicator = () => {
    if (!selectedBuilding) return "";
    const addressIndicator = selectedBuilding.pikkaadress.split(",");
    const arrLength = addressIndicator.length;
    return addressIndicator[arrLength - 1];
  };

  return (
    <div className="space-y-6">
      {(countryCode === "ee" || countryCode === "ng") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter {countryCode === "ee" ? "Estonian" : "Nigerian"} Address
          </label>
          <input
            ref={inputRef}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="apartment address"
            onKeyDown={handleManualSearch}
          />
          {loading && (
            <p className="text-orange-500 mt-2 text-sm">
              Fetching apartments...
            </p>
          )}
        </div>
      )}

      {/* Multiple Address Selection for Estonia */}
      {!loading && matchedAddresses.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matched Addresses
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => {
              const index = parseInt(e.target.value);
              const building = matchedAddresses[index];
              setSelectedBuilding(building);
              setApartments(building.appartments);
              setValue("streetAddress", building.pikkaadress);
            }}
          >
            {matchedAddresses.map((building, i) => (
              <option key={i} value={i}>
                {building.pikkaadress}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Standard Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Country"
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          error={errors.country?.message}
          options={[
            { value: "", label: "Select Country", disabled: true },
            { value: "nigeria", label: "Nigeria" },
            { value: "ghana", label: "Ghana" },
            { value: "kenya", label: "Kenya" },
            { value: "south-africa", label: "South Africa" },
            { value: "estonia", label: "Estonia" },
          ]}
        />

        {/* City Field */}
        <FormSelect
          label="City"
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          error={errors.city?.message}
          disabled={!selectedCountry}
          options={[
            { value: "", label: "Select City" },
            ...(CITY_OPTIONS[selectedCountry] ?? []).map((c) => ({
              value: c,
              label: c,
            })),
          ]}
        />

        {/* State Field - Only for non-Estonia countries */}
        {!isEstonia && (
          <FormSelect
            label="State"
            name="state"
            control={control}
            rules={{ required: "State is required" }}
            error={errors.state?.message}
            disabled={!selectedCountry}
            options={[
              { value: "", label: "Select State" },
              ...(STATE_OPTIONS[selectedCountry] ?? []).map((s) => ({
                value: s,
                label: s,
              })),
            ]}
          />
        )}

        {/* Postal Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal code <span className="text-red-500">*</span>
          </label>
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: "Postal code is required",
              pattern: {
                value: isEstonia ? /^\d{5}$/ : /^\d{5,6}$/,
                message: isEstonia
                  ? "Please enter a valid Estonian postal code (5 digits)"
                  : "Please enter a valid postal code (5–6 digits)",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder={isEstonia ? "10101" : "900101"}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.zipCode.message}
            </p>
          )}
        </div>
      </div>

      {/* Street Address Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street address <span className="text-red-500">*</span>
        </label>
        <Controller
          name="streetAddress"
          control={control}
          rules={{
            required: "Street address is required",
            minLength: { value: 5, message: "Must be at least 5 characters" },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder={isEstonia ? "Tallinna tn 1" : "4 Kwame Nkrumah Cres"}
              readOnly={isEstonia && !!streetAddress}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.streetAddress ? "border-red-500" : "border-gray-300"
              } ${isEstonia && streetAddress ? "bg-gray-50" : ""}`}
            />
          )}
        />
        {errors.streetAddress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.streetAddress.message}
          </p>
        )}
      </div>

      {/* Estonia Apartment Selection */}
      {!loading && apartments.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Apartment
          </label>
          <Controller
            name="apartmentNumber"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Apartment</option>
                {apartments.map((apt, idx) => (
                  <option key={apt.adr_id} value={apt.kort_nr || `${idx + 1}`}>
                    {getAddressIndicator()}–{apt.kort_nr || `${idx + 1}`}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      )}

      {/* Manual Apartment Input for Estonia (when no apartments found) */}
      {!loading &&
        selectedCountry === "estonia" &&
        streetAddress &&
        apartments.length === 0 && (
          <div>
            <p className="text-gray-500 mb-2 text-sm">
              No registered apartments found. You can manually enter the
              apartment number.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment Number
            </label>
            <Controller
              name="apartmentNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g., Flat 2A, Room 3B, Left Wing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            />
          </div>
        )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Reusable FormSelect Component                                     */
/* ------------------------------------------------------------------ */
interface FormSelectProps {
  label: string;
  name: keyof LocationFields;
  control: Control<LocationFields, unknown>;
  rules?: RegisterOptions<LocationFields, keyof LocationFields>;
  options: { value: string; label: string; disabled?: boolean }[];
  error?: string;
  disabled?: boolean;
}

const FormSelect = ({
  label,
  name,
  control,
  rules,
  options,
  error,
  disabled = false,
}: FormSelectProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <select
            {...field}
            disabled={disabled}
            className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
          >
            {options.map((opt) => (
              <option
                key={opt.value || opt.label}
                value={opt.value}
                disabled={opt.disabled}
                className="text-gray-500"
              >
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
      <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

LocationForm.displayName = "LocationForm";
export default LocationForm;
