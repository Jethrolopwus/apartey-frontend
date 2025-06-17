// "use client";
// import { forwardRef, useImperativeHandle } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { ChevronDown } from "lucide-react";

// export type LocationFields = {
//   country: string;
//   city: string;
//   state: string;
//   district: string;
//   zipCode: string;
//   streetAddress: string;
// };

// export interface LocationFormRef {
//   submit: () => Promise<LocationFields>;
//   getValues: () => LocationFields;
//   setAddress: (vals: Partial<LocationFields>) => void;
// }

// const LocationForm = forwardRef<LocationFormRef>((_, ref) => {
//   const {
//     control,
//     handleSubmit,
//     getValues,
//     setValue,
//     formState: { errors },
//     watch,
//   } = useForm<LocationFields>({
//     defaultValues: {
//       country: "",
//       city: "",
//       state: "",
//       district: "",
//       zipCode: "",
//       streetAddress: "",
//     },
//   });

//   const selectedCountry = watch("country");
//   const selectedCity = watch("city");
//   const selectedState = watch("state");

//   useImperativeHandle(ref, () => ({
//     submit: () => new Promise((res, rej) => handleSubmit(res, rej)()),
//     getValues,
//     setAddress: (vals) => {
//       (Object.keys(vals) as (keyof LocationFields)[]).forEach(
//         (k) => vals[k] && setValue(k, vals[k]!)
//       );
//     },
//   }));

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white">
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Country Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Country <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Controller
//                 name="country"
//                 control={control}
//                 rules={{ required: "Country is required" }}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
//                       errors.country ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="" disabled className="text-gray-500">
//                       Select Country
//                     </option>
//                     <option value="nigeria">Nigeria</option>
//                     <option value="ghana">Ghana</option>
//                     <option value="kenya">Kenya</option>
//                     <option value="south-africa">South Africa</option>
//                   </select>
//                 )}
//               />
//               <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//             {errors.country && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.country.message}
//               </p>
//             )}
//           </div>

//           {/* City Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               City <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Controller
//                 name="city"
//                 control={control}
//                 rules={{ required: "City is required" }}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     disabled={!selectedCountry}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
//                       errors.city ? "border-red-500" : "border-gray-300"
//                     } ${
//                       !selectedCountry ? "bg-gray-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     <option value="" className="text-gray-500">
//                       Select City
//                     </option>
//                   </select>
//                 )}
//               />
//               <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//             {errors.city && (
//               <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
//             )}
//           </div>

//           {/* State Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               State <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Controller
//                 name="state"
//                 control={control}
//                 rules={{ required: "State is required" }}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     disabled={!selectedCountry}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
//                       errors.state ? "border-red-500" : "border-gray-300"
//                     } ${
//                       !selectedCountry ? "bg-gray-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     <option value="" className="text-gray-500">
//                       Select State
//                     </option>
//                   </select>
//                 )}
//               />
//               <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//             {errors.state && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.state.message}
//               </p>
//             )}
//           </div>

//           {/* District Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               District <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <Controller
//                 name="district"
//                 control={control}
//                 rules={{ required: "District is required" }}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     disabled={!selectedState}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
//                       errors.district ? "border-red-500" : "border-gray-300"
//                     } ${!selectedState ? "bg-gray-50 cursor-not-allowed" : ""}`}
//                   >
//                     <option value="" className="text-gray-500">
//                       Select District
//                     </option>
//                   </select>
//                 )}
//               />
//               <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//             {errors.district && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.district.message}
//               </p>
//             )}
//           </div>

//           {/* Zip Code Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Postal code <span className="text-red-500">*</span>
//             </label>
//             <Controller
//               name="zipCode"
//               control={control}
//               rules={{
//                 required: "Zip code is required",
//                 pattern: {
//                   value: /^\d{5,6}$/,
//                   message: "Please enter a valid zip code (5-6 digits)",
//                 },
//               }}
//               render={({ field }) => (
//                 <input
//                   {...field}
//                   type="text"
//                   placeholder="11237"
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 ${
//                     errors.zipCode ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//               )}
//             />
//             {errors.zipCode && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.zipCode.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Street Address Field */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Street address <span className="text-red-500">*</span>
//           </label>
//           <Controller
//             name="streetAddress"
//             control={control}
//             rules={{
//               required: "Street address is required",
//               minLength: {
//                 value: 5,
//                 message: "Street address must be at least 5 characters",
//               },
//             }}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 placeholder="Kafur-Funtua Road"
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 ${
//                   errors.streetAddress ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//             )}
//           />
//           {errors.streetAddress && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.streetAddress.message}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// LocationForm.displayName = "LocationForm";
// export default LocationForm;

// components/molecules/LocationForm.tsx
"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types the parent relies on                                         */
/* ------------------------------------------------------------------ */
export type LocationFields = {
  country: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  streetAddress: string;
};

export interface LocationFormRef {
  submit: () => Promise<LocationFields>;
  getValues: () => LocationFields;
  /** called by handlePlaceSelect → fills everything */
  setAddress: (vals: Partial<LocationFields>) => void;
}

/* ------------------------------------------------------------------ */
/*  Option helpers                                                     */
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
};

const CITY_OPTIONS: Record<string, string[]> = {
  nigeria: ["Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt"],
  ghana: ["Accra", "Kumasi", "Tamale", "Cape Coast"],
  kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  "south-africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
};

const DISTRICT_OPTIONS: Record<string, string[]> = {
  "Abuja FCT": ["Wuse", "Garki", "Maitama", "Asokoro", "Gwarinpa"],
  Lagos: ["Victoria Island", "Ikeja", "Lekki", "Surulere", "Yaba"],
  "Greater Accra": ["Tema", "East Legon", "Osu", "Adabraka"],
  Nairobi: ["Westlands", "Karen", "Kilimani", "CBD"],
  "Western Cape": ["City Bowl", "Sea Point", "Camps Bay", "Constantia"],
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
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  /* expose methods to parent */
  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => handleSubmit(resolve, reject)()),
    getValues,
    /* 👉 parent calls this after Google‑Places lookup */
    setAddress: (vals) => {
      /* order matters – set country first so dependent <select>s enable */
      if (vals.country) setValue("country", vals.country);
      if (vals.state) setValue("state", vals.state);
      if (vals.city) setValue("city", vals.city);
      if (vals.district) setValue("district", vals.district);
      if (vals.zipCode) setValue("zipCode", vals.zipCode);
      if (vals.streetAddress) setValue("streetAddress", vals.streetAddress);
    },
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ----------------- Country ----------------- */}
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
          ]}
        />

        {/* ----------------- City -------------------- */}
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

        {/* ----------------- State ------------------- */}
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

        {/* ----------------- District ---------------- */}
        <FormSelect
          label="District"
          name="district"
          control={control}
          rules={{ required: "District is required" }}
          error={errors.district?.message}
          disabled={!selectedState}
          options={[
            { value: "", label: "Select District" },
            ...(DISTRICT_OPTIONS[selectedState] ?? []).map((d) => ({
              value: d,
              label: d,
            })),
          ]}
        />

        {/* ----------------- Zip Code --------------- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal code <span className="text-red-500">*</span>
          </label>
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: "Zip code is required",
              pattern: {
                value: /^\d{5,6}$/,
                message: "Please enter a valid zip code (5–6 digits)",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="900101"
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

      {/* ----------------- Street Address ----------- */}
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
              placeholder="4 Kwame Nkrumah Cres"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.streetAddress ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.streetAddress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.streetAddress.message}
          </p>
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Extracted reusable <select> using RHF’s Controller                 */
/* ------------------------------------------------------------------ */
interface FormSelectProps {
  label: string;
  name: keyof LocationFields;
  control: any;
  rules: any;
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
