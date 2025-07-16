"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ForgotPasswordImage1 from "@/assets/auth/forgotPassword1.svg";
import ForgotPasswordImage2 from "@/assets/auth/forgotPassword2.svg";
import ForgotPasswordImage3 from "@/assets/auth/forgotPassword3.svg";
import ForgotPasswordImage4 from "@/assets/auth/forgotPassword4.svg";
import Logo from "@/assets/auth/logo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

import LoginImage from "@/assets/auth/login.svg";

type ForgotPasswordStep = "email" | "verify" | "newPassword" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const isValidPassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const getBackgroundImage = () => {
    switch (step) {
      case "email":
        return ForgotPasswordImage1;
      case "verify":
        return ForgotPasswordImage2;
      case "newPassword":
        return ForgotPasswordImage3;
      case "success":
        return ForgotPasswordImage4;
      default:
        return LoginImage;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (step) {
      case "email":
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email }),
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          toast.success("Verification code sent successfully");
          setStep("verify");
        } else {
          if (
            data.message &&
            data.message.includes(
              "This email is linked to a Google account. Please sign in with Google."
            )
          ) {
            toast.error(
              "This email is linked to a Google account. Please sign in with Google."
            );
          } else {
            toast.error("Failed to send verification code");
          }
        }
        break;
      case "verify":
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              verificationCode: formData.verificationCode,
              type: "forget_password",
            }),
          }
        );
        const verifyData = await verifyResponse.json();
        if (verifyData.status === "success") {
          toast.success("Verification code verified successfully");
          setStep("newPassword");
        } else {
          toast.error("Failed to verify verification code");
        }
        break;
      case "newPassword":
        if (!isValidPassword(formData.newPassword)) {
          toast.error(
            "Password must be at least 8 characters and include a letter, number, and special character"
          );
          return;
        }

        if (formData.newPassword === formData.confirmPassword) {
          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: formData.email,
                newPassword: formData.newPassword,
              }),
            }
          );
          const updateData = await updateResponse.json();
          if (updateData.status === "success") {
            if (
              updateData.message ===
              "New password cannot be the same as your current password"
            ) {
              toast.error(
                "New password cannot be the same as your current password"
              );
            } else {
              toast.success("Password updated successfully");
              setStep("success");
            }
          } else {
            toast.error("Failed to update password");
          }
        } else {
          toast.error("Passwords don't match");
          console.error("Passwords don't match");
        }
        break;

      default:
        break;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal">
                Forgot Password
              </h1>
              <p className="font-light text-base md:text-lg">
                Enter Your email, we&apos;ll send a verification code
              </p>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              Send Code
            </Button>
          </>
        );

      case "verify":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal">
                Email Verification
              </h1>
              <p className="font-light text-base md:text-lg">
                We have sent a verification code to your email address
              </p>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                value={formData.verificationCode}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              Verify Code
            </Button>
          </>
        );

      case "newPassword":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal">
                Create New Password
              </h1>
              <p className="font-light text-base md:text-lg">
                Enter your new password{" "}
              </p>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative w-full">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 md:w-5 h-4 md:h-5" />
                  ) : (
                    <FaEye className="w-4 md:w-5 h-4 md:h-5" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative w-full">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-4 md:w-5 h-4 md:h-5" />
                  ) : (
                    <FaEye className="w-4 md:w-5 h-4 md:h-5" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              Continue
            </Button>
          </>
        );

      case "success":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal">
                Password Changed Successfully
              </h1>
              <p className="font-light text-base md:text-lg">
                Your password has been updated successfully
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              Back to Login
            </Button>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="flex-1 md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 md:px-24">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {renderStepContent()}
        </form>
      </div>

      {/* Right Section */}
      <div className="flex-1 md:w-1/2 relative min-h-[300px] md:h-auto">
        <Image
          src={getBackgroundImage()}
          alt="Forgot Password Background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
          <Image
            src={Logo}
            alt="Warrior Sol Logo"
            width={100}
            height={100}
            className="mb-4 w-32 md:w-1/2 h-auto md:h-1/2"
          />
        </div>
      </div>
    </div>
  );
}
