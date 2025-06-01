
"use client";
import { useRouter } from "next/navigation";

interface Props {
  disabled?: boolean;
}

export default function ResendCodeButton({ disabled }: Props) {
  const router = useRouter();

  const handleResend = () => {
    if (!disabled) {
      router.push("/resendCode");
    }
  };

  return (
    <button
      onClick={handleResend}
      type="button"
      disabled={disabled}
      className={`text-sm mt-4 mb-3 cursor-pointer hover:underline transition-opacity ${
        disabled ? "text-black  cursor-not-allowed" : "text-black hover:text-orange-500 "
      }`}
    >
      Resend code
    </button>
  );
}
