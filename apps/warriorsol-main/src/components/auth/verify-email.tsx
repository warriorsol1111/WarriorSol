"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupImage from "@/assets/auth/signup.svg";
import Logo from "@/assets/auth/logo.svg";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setErrors(null); // clear error on change
  };

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verificationCode }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Email verified successfully");
        router.push("/login");
      } else {
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, type: "email" }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Verification code resent successfully");
      } else {
        toast.error("Failed to resend verification code");
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
      {/* Left Section */}
      <div className="flex w-full items-center justify-center bg-white p-6 md:w-1/2 md:p-12 md:px-24">
        <form
          onSubmit={handleSubmit}
          className="mt-12 w-full space-y-4 md:space-y-6"
        >
          <div className="text-center md:text-left">
            <h1 className="font-serif text-3xl font-normal md:text-5xl">
              Verify Your Email
            </h1>
            <p className="mt-2 text-base font-light md:text-lg">
              Please enter the verification code sent to your email address
            </p>
          </div>

          <div className="space-y-4">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              value={verificationCode}
              onChange={handleChange}
              placeholder="Enter your verification code"
              className={clsx(
                "w-full",
                errors && "border-red-500 focus:ring-red-300"
              )}
            />
            {errors && (
              <p className="text-sm text-red-500 -mt-2">{errors}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full cursor-pointer bg-[#EE9254] text-white hover:bg-[#EE9254] flex items-center justify-center gap-2"
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
                className="cursor-pointer px-1 text-base font-bold text-black underline md:text-lg"
              >
                {resending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                )}
                Resend Code
              </Button>
            </p>
          </div>

          <div className="flex justify-center gap-x-4">
            <p className="text-center text-base font-light md:text-lg">
              Back to{" "}
              <a href="/login" className="font-bold text-black underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="relative h-[300px] w-full md:h-auto md:w-1/2">
        <Image
          src={SignupImage}
          alt="Verify Email Background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay Content */}
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
