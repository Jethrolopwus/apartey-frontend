//   "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { EyeIcon } from "lucide-react";
// import { EyeSlashIcon } from "@heroicons/react/24/outline";
// import ResetPasswordButton from "../atoms/Buttons/ResetPasswordButton";

// interface FormData {
//   code: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// interface ResetPasswordFormProps {
//   onSubmit: (data: FormData) => Promise<void> | void;
//   isLoading?: boolean;
// }

// const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
//   onSubmit, 
//   isLoading = false 
// }) => {
//   const [showCode, setShowCode] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const toggleCodeVisibility = () => {
//     setShowCode(!showCode);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     mode: "onChange",
//   });

//   const watchPassword = watch("password");

//   const handleFormSubmit = async (data: FormData) => {
//     try {
//       await onSubmit(data);
//     } catch (error) {
//       console.error("Form submission error:", error);
//     }
//   };

//   const isFormSubmitting = isSubmitting || isLoading;

//   return (
//     <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
//       <div className="space-y-4">
//         {/* Code field - 4 digits */}
//         <div>
//           <label
//             htmlFor="code"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Code
//           </label>
//           <div className="relative">
//             <input
//               id="code"
//               type={showCode ? "text" : "password"}
//               {...register("code", {
//                 required: "Code is required",
//                 pattern: {
//                   value: /^[0-9]{4}$/,
//                   message: "Code must be exactly 4 digits",
//                 },
//                 minLength: {
//                   value: 4,
//                   message: "Code must be 4 digits",
//                 },
//                 maxLength: {
//                   value: 4,
//                   message: "Code must be 4 digits",
//                 },
//               })}
//               className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
//                 errors.code
//                   ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                   : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
//               }`}
//               placeholder="1234"
//               maxLength={4}
//               disabled={isFormSubmitting}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
//               onClick={toggleCodeVisibility}
//               disabled={isFormSubmitting}
//             >
//               {showCode ? (
//                 <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               ) : (
//                 <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               )}
//             </button>
//           </div>
//           {errors.code && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.code.message}
//             </p>
//           )}
//         </div>

//         {/* Email field */}
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             {...register("email", {
//               required: "Email is required",
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: "Please enter a valid email address",
//               },
//             })}
//             className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
//               errors.email
//                 ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                 : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
//             }`}
//             placeholder="example@email.com"
//             disabled={isFormSubmitting}
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.email.message}
//             </p>
//           )}
//         </div>

//         {/* Password field */}
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Password
//           </label>
//           <div className="relative">
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 digits long",
//                 },
//                 pattern: {
//                   value: /^[02468]{6,}$/,
//                   message: "Password must contain only even digits (0,2,4,6,8)",
//                 },
//               })}
//               className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
//                 errors.password
//                   ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                   : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
//               }`}
//               placeholder="Enter your password"
//               disabled={isFormSubmitting}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
//               onClick={togglePasswordVisibility}
//               disabled={isFormSubmitting}
//             >
//               {showPassword ? (
//                 <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               ) : (
//                 <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               )}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         {/* Confirm Password field */}
//         <div>
//           <label
//             htmlFor="confirmPassword"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Confirm Password
//           </label>
//           <div className="relative">
//             <input
//               id="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               {...register("confirmPassword", {
//                 required: "Please confirm your password",
//                 minLength: {
//                   value: 6,
//                   message: "Confirm password must be at least 6 digits long",
//                 },
//                 pattern: {
//                   value: /^[02468]{6,}$/,
//                   message: "Confirm password must contain only even digits (0,2,4,6,8)",
//                 },
//                 validate: (value) =>
//                   value === watchPassword || "Passwords do not match",
//               })}
//               className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
//                 errors.confirmPassword
//                   ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
//                   : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
//               }`}
//               placeholder="Confirm your password"
//               disabled={isFormSubmitting}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
//               onClick={toggleConfirmPasswordVisibility}
//               disabled={isFormSubmitting}
//             >
//               {showConfirmPassword ? (
//                 <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               ) : (
//                 <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//               )}
//             </button>
//           </div>
//           {errors.confirmPassword && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.confirmPassword.message}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Submit button */}
//       <ResetPasswordButton isSubmitting={isFormSubmitting} />
//     </form>
//   );
// };

// export default ResetPasswordForm;


"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon } from "lucide-react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import ResetPasswordButton from "../atoms/Buttons/ResetPasswordButton";

interface FormData {
  code: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (data: FormData) => Promise<void> | void;
  isLoading?: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [showCode, setShowCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleCodeVisibility = () => {
    setShowCode(!showCode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const watchPassword = watch("password");

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isFormSubmitting = isSubmitting || isLoading;

  return (
    <form className="mt-8 space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        {/* Code field - 4 digits */}
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Code
          </label>
          <div className="relative">
            <input
              id="code"
              type={showCode ? "text" : "password"}
              {...register("code", {
                required: "Code is required",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Code must be exactly 4 digits",
                },
                minLength: {
                  value: 4,
                  message: "Code must be 4 digits",
                },
                maxLength: {
                  value: 4,
                  message: "Code must be 4 digits",
                },
              })}
              className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                errors.code
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="1234"
              maxLength={4}
              disabled={isFormSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
              onClick={toggleCodeVisibility}
              disabled={isFormSubmitting}
            >
              {showCode ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
              errors.email
                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
            }`}
            placeholder="example@email.com"
            disabled={isFormSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 digits long",
                },
                pattern: {
                  value: /^\d{6,}$/,
                  message: "Password must contain only digits",
                },
              })}
              className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                errors.password
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="Enter your password"
              disabled={isFormSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
              onClick={togglePasswordVisibility}
              disabled={isFormSubmitting}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                minLength: {
                  value: 6,
                  message: "Confirm password must be at least 6 digits long",
                },
                pattern: {
                  value: /^\d{6,}$/,
                  message: "Confirm password must contain only digits",
                },
                validate: (value) =>
                  value === watchPassword || "Passwords do not match",
              })}
              className={`appearance-none relative block w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                errors.confirmPassword
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="Confirm your password"
              disabled={isFormSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 mb-4"
              onClick={toggleConfirmPasswordVisibility}
              disabled={isFormSubmitting}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <ResetPasswordButton isSubmitting={isFormSubmitting} />
    </form>
  );
};

export default ResetPasswordForm;
