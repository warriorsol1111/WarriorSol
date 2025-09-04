"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "../../../../warriorsol-main/src/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ForgotPasswordImage1 from "@/assets/auth/forgotPassword1.svg";
import ForgotPasswordImage2 from "@/assets/auth/forgotPassword2.svg";
import ForgotPasswordImage3 from "@/assets/auth/forgotPassword3.svg";
import ForgotPasswordImage4 from "@/assets/auth/forgotPassword4.svg";
import Logo from "@/assets/auth/logo.svg";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import LoginImage from "@/assets/auth/login.svg";
import { OtpInput } from "reactjs-otp-input";

type ForgotPasswordStep = "email" | "verify" | "newPassword" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resending, setResending] = useState(false);

  // Handle browser back button and history
  useEffect(() => {
    // Push initial state when component mounts
    window.history.pushState({ step: "email" }, "", window.location.pathname);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setStep(event.state.step);
      } else {
        // If no state, go back to login
        window.location.href = "/login";
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Update history when step changes
  useEffect(() => {
    if (step !== "email") {
      window.history.pushState({ step }, "", window.location.pathname);
    }
  }, [step]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (!isValidPassword(password)) {
      return "Password must be at least 8 characters and include a capital letter, number, and special character";
    }
    return "";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords don't match";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!isValidEmail(email)) return "Please enter a valid email address";
    return "";
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

  const handleResendCode = async () => {
    try {
      setResending(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            type: "forget_password",
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.dismiss();
        toast.success("Verification code resent successfully");
      } else {
        if (data.message === "Email already verified") {
          toast.dismiss();
          toast.error("Email already verified");
        } else {
          toast.dismiss();
          toast.error("Failed to resend verification code");
        }
      }
    } catch (err) {
      console.error("Error during resend code:", err);
      toast.dismiss();
      toast.error("Something went wrong. Try again.");
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case "verify":
        setStep("email");
        break;
      case "newPassword":
        setStep("verify");
        break;
      case "success":
        // Don't allow going back from success step
        break;
      default:
        // For email step, go to login page
        window.location.href = "/login";
        break;
    }
  };

  const canGoBack = () => {
    return step !== "success"; // Can go back from all steps except success
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Also clear confirm password error when typing in new password
    if (name === "newPassword" && errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (step) {
        case "email":
          // Validate email
          const emailError = validateEmail(formData.email);
          if (emailError) {
            setErrors({ ...errors, email: emailError });
            toast.dismiss();
            toast.error(emailError);
            setLoading(false);
            return;
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email }),
            }
          );
          const data = await response.json();
          if (data.status === "success") {
            toast.dismiss();
            toast.success("Verification code sent successfully");
            setStep("verify");
          } else {
            if (
              data.message?.includes(
                "This email is linked to a Google account. Please sign in with Google."
              )
            ) {
              toast.dismiss();
              toast.error(
                "This email is linked to a Google account. Please sign in with Google."
              );
            } else {
              toast.dismiss();
              toast.error("Failed to send verification code");
            }
          }
          break;

        case "verify":
          const verifyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email,
                verificationCode: formData.verificationCode,
                type: "forget_password",
              }),
            }
          );
          const verifyData = await verifyResponse.json();
          if (verifyData.status === "success") {
            toast.dismiss();
            toast.success("Verification code verified successfully");
            setStep("newPassword");
          } else {
            if (verifyData.message === "Invalid verification code") {
              toast.dismiss();
              toast.error("Invalid verification code");
            } else {
              toast.dismiss();
              toast.error("Failed to verify verification code");
            }
          }
          break;

        case "newPassword":
          // Validate both passwords
          const newPasswordError = validatePassword(formData.newPassword);
          const confirmPasswordError = validateConfirmPassword(
            formData.newPassword,
            formData.confirmPassword
          );

          if (newPasswordError || confirmPasswordError) {
            setErrors({
              ...errors,
              newPassword: newPasswordError,
              confirmPassword: confirmPasswordError,
            });
            toast.dismiss();
            toast.error(newPasswordError || confirmPasswordError);
            setLoading(false);
            return;
          }

          // Reset errors if validation passes
          setErrors({ email: "", newPassword: "", confirmPassword: "" });

          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
              toast.dismiss();
              toast.error(
                "New password cannot be the same as your current password"
              );
            } else {
              toast.dismiss();
              toast.success("Password updated successfully");
              setStep("success");
            }
          } else {
            toast.dismiss();
            toast.error("Failed to update password");
          }
          break;
      }
    } catch (err) {
      console.error("Error during forgot password process:", err);
      toast.dismiss();
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const Spinner = <Loader2 className="w-5 h-5 animate-spin" />;

    switch (step) {
      case "email":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-[42px] text-[#1F1F1F]  font-normal">
                Forgot Password
              </h1>
              <p className=" text-[#1F1F1F99]  text-base md:text-lg">
                Enter Your email, we&apos;ll send a verification code
              </p>
            </div>
            <div className="space-y-4 w-full">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE9254] ! !text-xl  cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              {loading ? Spinner : "Send Code"}
            </Button>
          </>
        );

      case "verify":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-[42px] text-[#1F1F1F]  font-normal">
                Email Verification
              </h1>
              <p className=" text-[#1F1F1F99]  text-base md:text-lg">
                We have sent a verification code to your email address
              </p>
              <p className="text-base  text-[#EE9254]  md:text-lg">
                {formData.email}
              </p>
            </div>

            <div className="space-y-4 w-full">
              <Label>Please Enter Code</Label>
              <div className="flex gap-2 justify-center">
                <OtpInput
                  value={otpValues.join("")}
                  onChange={(val) => {
                    setOtpValues(val.split(""));
                    setFormData({ ...formData, verificationCode: val });
                  }}
                  numInputs={6}
                  isInputNum
                  shouldAutoFocus
                  inputStyle={{
                    width: "100%",
                    height: "3rem",
                    fontSize: "1.25rem",
                    borderRadius: "0.375rem",
                    border: `1px solid #d1d5db`,
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
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || otpValues.some((val) => val === "")}
              className="w-full bg-[#EE9254] cursor-pointer ! !text-xl hover:bg-[#EE9254] h-10 md:h-12 text-white disabled:opacity-50"
            >
              {loading ? Spinner : "Verify Code"}
            </Button>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 mt-4">
              <p className="text-center text-base  md:text-lg">
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

            <div className="flex justify-center mt-2">
              <p className="text-base ">
                Back to{" "}
                <a href="/login" className="font-bold underline text-black">
                  Login
                </a>
              </p>
            </div>
          </>
        );

      case "newPassword":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-[42px] text-[#1F1F1F]  font-normal">
                Create New Password
              </h1>
              <p className=" text-[#1F1F1F99]   text-base md:text-lg">
                Enter your new password{" "}
              </p>
            </div>
            <div className="space-y-4 w-full">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative w-full">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full pr-10 ${
                    errors.newPassword ? "border-red-500" : ""
                  }`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-[-10px]">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-4 w-full">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative w-full">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-[-10px]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE9254] cursor-pointer ! !text-xl hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              {loading ? Spinner : "Continue"}
            </Button>
          </>
        );

      case "success":
        return (
          <>
            <div>
              <h1 className="text-3xl md:text-[42px] text-[#1F1F1F]  font-normal">
                Password Changed Successfully
              </h1>
              <p className=" text-[#1F1F1F]  opacity-60 text-base md:text-lg">
                Your password has been updated successfully
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-[#EE9254] cursor-pointer ! !text-xl hover:bg-[#EE9254] h-10 md:h-12 text-white"
            >
              Back to Login
            </Button>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      <div className="flex-1 md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 md:px-24">
        <div className="w-full space-y-6">
          {/* Back Button */}
          {canGoBack() && (
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 text-[#1F1F1F] hover:bg-gray-100 p-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className=" text-sm">Back</span>
              </Button>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
          </form>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
        <Image
          src={getBackgroundImage()}
          alt="Forgot Password Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 text-white text-center px-4">
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
