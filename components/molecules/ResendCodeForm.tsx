"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormValues } from "@/types/generated";
import { ResetPasswordFormProps } from "@/types/generated";
import ResendCodeButton from "../atoms/Buttons/ResendCodeButton";

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const {
    register,

    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  return (
    <div>
      <div className="mb-4 ">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-400 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          className={`w-full px-3 py-2 bg-white border ${
            errors.email ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
          placeholder="example@email.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <ResendCodeButton />
    </div>
  );
};
export default ResetPasswordForm;
