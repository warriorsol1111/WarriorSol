"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useEffect, useState } from "react";
import SignupImage from "@/assets/auth/signup.svg";
import Logo from "@/assets/auth/logo.svg";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      if (error === "GOOGLE_LOGIN_BLOCKED") {
        toast.dismiss();
        toast.error(
          "This email is registered with a password. Please use email/password to log in."
        );
      } else {
        toast.dismiss();
        toast.error("Something went wrong.");
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, error]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validation functions
  const validateName = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Name is required";
    if (trimmedName.length < 3)
      return "Name must be at least 3 characters long";
    if (name.startsWith(" ")) return "Name cannot start with a space";
    if (name.includes("  ")) return "Name cannot contain consecutive spaces";
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(trimmedName)) {
      return "Name can only contain letters and single spaces between words";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password))
      return "Password must contain at least one special character";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Also clear confirm password error when typing in password field
    if (name === "password" && formErrors.confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setFormErrors(newErrors);
      // Show the first error in toast
      const firstError = Object.values(newErrors).find((error) => error !== "");
      if (firstError) {
        toast.dismiss();
        toast.error(firstError);
      }
      setLoading(false);
      return;
    }

    // Clear all errors if validation passes
    setFormErrors({});

    // Send to backend
    const body = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.message?.includes("not verified")) {
          toast.dismiss();
          toast.error("Email is not verified. OTP has been sent again.");
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}`
          );
        } else if (response.status === 400 || response.status === 409) {
          toast.dismiss();
          toast.error("Email is already registered. Try logging in instead.");
        } else {
          toast.error(data.message || "Signup failed. Please try again.");
        }
        return;
      }

      toast.success(
        "Signup successful! Please check your email to verify your account."
      );
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-12 md:px-24">
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-12">
          <div>
            <h1 className="text-3xl md:text-[42px] text-[#1F1F1F] font-serif font-normal">
              Hello There!
            </h1>
            <p className="font-light text-base md:text-lg text-[#1F1F1F99] opacity-[60%]">
              Welcome to warriorsol, Enter details to create your account{" "}
            </p>
          </div>

          {/* Name */}
          <div className="space-y-4 w-full">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              className={`w-full ${formErrors.name ? "border-red-500" : ""}`}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-[-10px]">
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-4 w-full">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className={`w-full ${formErrors.email ? "border-red-500" : ""}`}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-[-10px]">
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-4 w-full">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pr-10 ${formErrors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-[-10px]">
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-4 w-full">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  formErrors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-[-10px]">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EE9254] !font-[Inter] !text-xl hover:bg-[#EE9254] h-10 md:h-12 text-white mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Get Started"
            )}
          </Button>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-gray-500 text-sm md:text-base font-light">
              OR
            </span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Google */}
          <Button
            type="button"
            size="lg"
            onClick={() => {
              setGoogleLoading(true);
              signIn("google", { callbackUrl: "/home" });
            }}
            className="w-full flex items-center justify-center gap-3 bg-white text-black border hover:bg-white border-gray-300 rounded-lg shadow-sm hover:shadow-md transition text-sm md:text-base py-2 md:py-3"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
            ) : (
              <>
                <FcGoogle className="w-5 h-5 md:w-6 md:h-6" />
                Continue with Google
              </>
            )}
          </Button>

          {/* Login Link */}
          <div className="flex justify-center gap-x-2 md:gap-x-4">
            <p className="text-base md:text-lg !font-[Inter] !text-[#1F1F1F] opacity-60 text-center font-light">
              Already Have An Account?{" "}
              <a href="/login" className="text-black font-bold underline">
                SignIn
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 relative h-[300px] md:h-auto">
        <Image
          src={SignupImage}
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
          <Image
            src={Logo}
            alt="Warrior Sol Logo"
            width={100}
            height={100}
            className="w-1/3 md:w-1/2 h-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default function SignupPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPage />
    </Suspense>
  );
}
