"use client";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import ContinueButton from "@/components/atoms/Buttons/ContinueButton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useVerifyEmailMutation } from "@/Hooks/use.verifyEmail.mutation";
import ResendCodeButton from "@/components/atoms/Buttons/ResendCodeButton";

interface FormValues {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
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

  const { mutate, data, error, isLoading } = useVerifyEmailMutation();

  const onSubmit = (formData: FormValues) => {
    const code =
      formData.code1 + formData.code2 + formData.code3 + formData.code4;
    const email = localStorage.getItem("email");

    mutate(
      { email: email as string, code },
      {
        onSuccess: () => {
          //   toast.success("Email verified successfully!");
          router.push("/emailVerified");
        },

        onError: () => {
          setSubmitError("Invalid verification code.");
          // Highlight all code boxes as invalid
          ["code1", "code2", "code3", "code4"].forEach((field) =>
            setError(field as keyof FormValues, {
              type: "manual",
              message: " ",
            })
          );
        },
      }
    );
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      router.push("/signup");
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
          <div className="flex justify-between space-x-2">
            {["code1", "code2", "code3", "code4"].map((field) => (
              <Controller
                key={field}
                name={field as keyof FormValues}
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  maxLength: 1,
                  minLength: 1,
                  pattern: /[0-9]/,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    maxLength={1}
                    className={`w-14 h-14 text-center border rounded-md text-xl outline-none ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
            ))}
          </div>

          {submitError && (
            <p className="text-red-500 text-sm mt-2">{submitError}</p>
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
            <ResendCodeButton disabled={!canResend} />
          </div>
        </form>
      </div>
    </div>
  );
}
