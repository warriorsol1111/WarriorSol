"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupImage from "@/assets/auth/signup.svg";
import Logo from "@/assets/auth/logo.svg";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Verifying email with code:", verificationCode);
  };

  const handleResendCode = () => {
    console.log("Resending verification code");
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
              required
              placeholder="Enter your verification code"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full cursor-pointer bg-[#EE9254] text-white hover:bg-[#EE9254]"
          >
            Verify Email
          </Button>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-center text-base font-light md:text-lg">
              Didn&apos;t receive the code?{" "}
              <Button
                variant="ghost"
                onClick={handleResendCode}
                className="cursor-pointer px-1 text-base font-bold text-black underline md:text-lg"
              >
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
