"use client";
import { useResendCodeMutation } from "@/Hooks/use.resendCode.mutation";
import { toast } from "react-hot-toast";

interface Props {
  disabled?: boolean;
  email: string;
}

export default function ResendCodeButton({ disabled, email }: Props) {
  const { mutate, isLoading } = useResendCodeMutation();

  const handleResend = () => {
    if (!disabled && !isLoading) {
      mutate(
        { email, password: "", confirmPassword: "", code: "" },
        {
          onSuccess: () => {
            toast.success("A new code has been sent to your email.");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to resend code. Please try again.");
          },
        }
      );
    }
  };

  return (
    <button
      onClick={handleResend}
      type="button"
      disabled={disabled || isLoading}
      className={`text-sm mt-4 mb-3 cursor-pointer hover:underline transition-opacity ${
        disabled || isLoading
          ? "text-black cursor-not-allowed opacity-50"
          : "text-black hover:text-[#C85212]"
      }`}
    >
      {isLoading ? "Sending..." : "Resend code"}
    </button>
  );
}
