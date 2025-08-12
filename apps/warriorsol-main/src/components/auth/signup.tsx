"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useEffect, useState } from "react";
import SignupImage from "@/assets/auth/signup.svg";
import Logo from "@/assets/auth/logo.svg";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
  const [formErrors, setFormErrors] = useState({
    name: false,
    password: false,
    confirmPassword: false,
  });
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({ name: false, password: false, confirmPassword: false });

    const trimmedName = formData.name.trim();

    // Validate name
    if (trimmedName.length < 4) {
      setFormErrors((prev) => ({ ...prev, name: true }));
      toast.dismiss();
      toast.error("Name must be at least 4 characters long.");
      setLoading(false);
      return;
    }

    if (formData.email.trim() === "") {
      setFormErrors((prev) => ({ ...prev, name: true }));
      toast.dismiss();
      toast.error("Email is required.");
      setLoading(false);
      return;
    }

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(trimmedName)) {
      setFormErrors((prev) => ({ ...prev, name: true }));
      toast.dismiss();
      toast.error("Please enter a valid full name (letters and spaces only).");
      setLoading(false);
      return;
    }

    // Validate password
    if (formData.password.length < 8) {
      setFormErrors((prev) => ({ ...prev, password: true }));
      toast.dismiss();
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      setFormErrors((prev) => ({ ...prev, password: true }));
      toast.dismiss();
      toast.error("Password must contain at least one special character.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        password: true,
        confirmPassword: true,
      }));
      toast.dismiss();
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Send to backend
    const body = {
      name: formData.name,
      email: formData.email,
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
        toast.dismiss();

        if (response.status === 400 && data.message?.includes("not verified")) {
          toast.error(
            "Email is already registered but not verified. Please check your inbox."
          );
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}`
          );
        } else if (response.status === 400 || response.status === 409) {
          toast.error("Email is already registered. Try logging in instead.");
        } else {
          toast.error(data.message || "Signup failed. Please try again.");
        }

        return;
      }

      toast.dismiss();
      toast.success(
        "Signup successful! Please check your email to verify your account."
      );
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error("Signup error:", err);
      toast.dismiss();
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-12 md:px-24">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 md:space-y-10 mt-12"
        >
          <div>
            <h1 className="text-3xl md:text-[42px] text-[#1F1F1F] font-serif font-normal">
              Hello There!
            </h1>
            <p className="font-light text-base md:text-lg text-[#1F1F1F] opacity-[60%]">
              Welcome to warriorsol, Enter details to create your account{" "}
            </p>
          </div>

          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              className={formErrors.name ? "border-red-500" : ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className={formErrors.name ? "border-red-500" : ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`pr-10 ${formErrors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
            </div>
            <div className="space-y-2 md:space-y-4 mt-10">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pr-10 ${formErrors.confirmPassword ? "border-red-500 border-2" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EE9254] !font-[Inter] !text-xl cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Get Started"
            )}
          </Button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-gray-500 text-sm md:text-base font-light">
              OR
            </span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-black border hover:bg-white border-gray-300 rounded-lg shadow-sm hover:shadow-md transition text-sm md:text-base py-2 md:py-3"
          >
            <FcGoogle className="w-5 h-5 md:w-6 md:h-6" />
            Continue with Google
          </Button>

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

        {/* Overlay Content */}
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
