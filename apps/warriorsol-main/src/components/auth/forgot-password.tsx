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

// Temporarily using login image for all steps until new images are added
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

  const getBackgroundImage = () => {
    // TODO: Replace LoginImage with the corresponding step image once available
    switch (step) {
      case "email":
        return ForgotPasswordImage1; // Replace with ForgotPasswordEmailImage
      case "verify":
        return ForgotPasswordImage2; // Replace with ForgotPasswordVerifyImage
      case "newPassword":
        return ForgotPasswordImage3; // Replace with ForgotPasswordNewImage
      case "success":
        return ForgotPasswordImage4; // Replace with ForgotPasswordSuccessImage
      default:
        return LoginImage;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (step) {
      case "email":
        // Handle email submission and send verification code
        console.log("Sending verification code to", formData.email);
        setStep("verify");
        break;
      case "verify":
        // Handle verification code validation
        console.log("Verifying code", formData.verificationCode);
        setStep("newPassword");
        break;
      case "newPassword":
        // Handle password update
        if (formData.newPassword === formData.confirmPassword) {
          console.log("Updating password");
          setStep("success");
        } else {
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
