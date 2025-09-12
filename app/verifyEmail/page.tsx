"use client";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import ContinueButton from "@/components/atoms/Buttons/ContinueButton";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "@/Hooks/use.verifyEmail.mutation";
import ResendCodeButton from "@/components/atoms/Buttons/ResendCodeButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/molecules/inputOtp";
import { TokenManager } from "@/utils/tokenManager";

interface FormValues {
  code: string;
}

export default function VerifyEmail() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();
  const [submitError, setSubmitError] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  const { mutate, isLoading } = useVerifyEmailMutation();

  const onSubmit = (formData: FormValues) => {
    const email = localStorage.getItem("email");

    mutate(
      { email: email as string, code: formData.code, password: "", confirmPassword: "" },
      {
        onSuccess: (response) => {

        TokenManager.setToken(response.token);
        localStorage.removeItem("pendingVerification"); // Clear verification flag
        router.push("/onboarding");
        },

        onError: () => {
          setSubmitError("Invalid verification code.");
          setError("code", {
            type: "manual",
            message: "Invalid verification code",
          });
        },
      }
    );
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const pendingVerification = localStorage.getItem("pendingVerification");

    if (!email || pendingVerification !== "true") {
      router.push("/signup");
    } else {
      setUserEmail(email);
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center px-6 shadow-xl bg-white rounded-xl mb-4 border border-gray-100">
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Apartey Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl font-semibold text-black mb-2">Verify Email</h1>
        <p className="text-sm text-gray-500 mb-8">
          We have sent you a four digit code in your email
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center">
            <Controller
              name="code"
              control={control}
              defaultValue=""
              rules={{
                required: "Please enter the verification code",
                minLength: {
                  value: 4,
                  message: "Code must be 4 digits",
                },
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Code must contain only numbers",
                },
              }}
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={errors.code ? "border-red-500" : ""}
                >
                  <InputOTPGroup>
                    <InputOTPSlot 
                      index={0} 
                      className={`w-14 h-14 text-xl ${
                        errors.code ? "border-red-500" : ""
                      }`}
                    />
                    <InputOTPSlot 
                      index={1} 
                      className={`w-14 h-14 text-xl ${
                        errors.code ? "border-red-500" : ""
                      }`}
                    />
                    <InputOTPSlot 
                      index={2} 
                      className={`w-14 h-14 text-xl ${
                        errors.code ? "border-red-500" : ""
                      }`}
                    />
                    <InputOTPSlot 
                      index={3} 
                      className={`w-14 h-14 text-xl ${
                        errors.code ? "border-red-500" : ""
                      }`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>

          {(submitError || errors.code) && (
            <p className="text-red-500 text-sm mt-2">
              {submitError || errors.code?.message}
            </p>
          )}

          <ContinueButton
            label={isLoading ? "Verifying..." : "Continue"}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center">
            {!canResend && (
              <p className="text-sm text-gray-500 mb-1">
                Code expires in {timeLeft} second{timeLeft !== 1 ? "s" : ""}
              </p>
            )}
            <ResendCodeButton disabled={!canResend} email={userEmail} />
          </div>
        </form>
      </div>
    </div>
  );
}