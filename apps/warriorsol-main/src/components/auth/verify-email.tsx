"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VerifyEmailImage1 from "@/assets/auth/verifyEmail1.svg";
import VerifyEmailImage2 from "@/assets/auth/verifyEmail2.svg";
import Logo from "@/assets/auth/logo.svg";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OtpInput } from "reactjs-otp-input";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const validateCode = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return "Verification code is required.";
    if (!/^\d{6}$/.test(trimmed)) return "Code must be 6 digits.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateCode(verificationCode);
    if (error) {
      setErrors(error);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, verificationCode }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Email verified successfully");
        setStep(2);
      } else {
        toast.dismiss();
        toast.error("Invalid verification code");
      }
    } catch (err) {
      console.error("Error during email verification:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResending(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "email" }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.dismiss();
        toast.success("Verification code resent successfully");
      } else {
        if(data.message === "Email already verified") {
          toast.dismiss();
          toast.error("Email already verified");
        }
        else {
        toast.dismiss();
        toast.error("Failed to resend verification code");
        }
      }
    } catch (err) {
      console.error("Error during resend code:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side */}
      <div className="flex w-full items-center justify-center bg-white p-6 md:w-1/2 md:p-12 md:px-24">
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="mt-12 w-full space-y-6">
            <div className="text-center md:text-left">
              <h1 className="font-[Cormorant SC] text-3xl md:text-[42px]">
                Email Verification
              </h1>
              <p className="mt-2 text-base font-light text-[#1F1F1F99] font-[Inter] md:text-lg">
                We have sent a verification code on your Email
              </p>
              <p className="text-base  text-[#EE9254] font-[Inter] md:text-lg">
                {email}
              </p>
            </div>
            <div className="space-y-4">
              <Label className="text-[#1F1F1F]" htmlFor="verificationCode">Please Enter Code</Label>
              <OtpInput
                value={verificationCode}
                onChange={(val) => {
                  setVerificationCode(val);
                  setErrors(null);
                }}
                numInputs={6}
                isInputNum
                shouldAutoFocus
                inputStyle={{
                  width: "100%",
                  height: "3rem",
                  fontSize: "1.25rem",
                  borderRadius: "0.375rem",
                  border: `1px solid ${errors ? "#ef4444" : "#d1d5db"}`,
                  outline: "none",
                  textAlign: "center",
                }}
                containerStyle={{
                  display: "flex",
                  gap: "0.5rem",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              />
              {errors && <p className="text-sm text-red-500 -mt-2">{errors}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-[#EE9254] text-white hover:bg-[#EE9254] text-lg font-[Inter] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Verify Email
            </Button>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0">
              <p className="text-center text-base font-light md:text-lg">
                Didn&apos;t receive the code?{" "}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="px-1 text-base font-bold text-black underline"
                >
                  {resending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                  )}
                  Resend Code
                </Button>
              </p>
            </div>

            <div className="flex justify-center">
              <p className="text-base font-light">
                Back to{" "}
                <a href="/login" className="font-bold underline text-black">
                  Login
                </a>
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-12 w-full text-center space-y-6">
            <h1 className="text-[#1F1F1F] text-3xl md:text-[42px] font-[Cormorant SC]">
              Account Created <br />
              Successfully
            </h1>

            <Button
              onClick={() => router.push("/login")}
              className="h-12 w-full hover:bg-[#EE9254] bg-[#EE9254] text-white font-[Inter] text-xl"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="relative h-[300px] w-full md:h-auto md:w-1/2">
        <Image
          src={step === 1 ? VerifyEmailImage1 : VerifyEmailImage2}
          alt="Verify Email Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center text-white">
          <Image
            src={Logo}
            alt="Warrior Sol Logo"
            width={100}
            height={100}
            className="h-auto w-1/3 md:w-1/2"
          />
        </div>
      </div>
    </div>
  );
}
