"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "../../../../warriorsol-main/src/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useEffect, useState, Suspense } from "react";
import LoginImage from "@/assets/auth/login.svg";
import Logo from "@/assets/auth/logo.svg";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "./login-schema";
import { Loader2 } from "lucide-react";

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Custom validation first
    if (!validateForm()) {
      if (fieldErrors.email) {
        toast.dismiss();
        toast.error(fieldErrors.email);
      } else if (fieldErrors.password) {
        toast.dismiss();
        toast.error(fieldErrors.password);
      }
      setLoading(false);
      return;
    }

    // Schema validation as backup
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid input";
      toast.dismiss();
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    const { email, password } = validation.data;
    const callbackUrl = searchParams.get("callbackUrl") || "/home";
    const isCommunity = callbackUrl === "/community";

    const response = await signIn("credentials", {
      email,
      password,
      redirect: isCommunity,
      callbackUrl,
    });

    console.log("signIn response →", response);

    const error = response?.error?.toLowerCase().trim();

    if (error) {
      if (error.includes("user is not verified")) {
        toast.dismiss();
        toast.error("Email is not verified. OTP has been sent again.");
        router.push(`/verify-email?email=${email}`);
      } else if (error.includes("invalid credentials")) {
        toast.dismiss();
        toast.error("Invalid email or password");
      } else if (
        error.includes("linked to a google account") ||
        error.includes("sign in with google")
      ) {
        toast.dismiss();
        toast.error(
          "This account is linked to Google. Please sign in with Google."
        );
      } else if (
        error.includes("account is locked") ||
        error.includes("disabled")
      ) {
        toast.dismiss();
        toast.error("Your account has been locked or disabled.");
      } else {
        toast.dismiss();
        toast.error("Something went wrong. Please try again.");
        console.error("Uncaught login error →", response?.error);
      }
    } else {
      toast.dismiss();
      toast.success("Login successful");

      // 🚀 If not community → manually redirect using response.url
      if (!isCommunity) {
        router.replace(response?.url || callbackUrl);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 md:px-24">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 md:space-y-10"
        >
          <div>
            <h1 className="text-3xl md:text-[42px] text-[#1F1F1F] ! font-normal">
              Welcome Back!
            </h1>
            <p className="font-light font-[Inter] text-[#1F1F1F99] opacity-60 text-base md:text-lg">
              Enter Your Credentials To Access Your Account
            </p>
          </div>

          <div className="space-y-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`pr-10 ${fieldErrors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
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
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
            <div className="text-right text-sm md:text-lg text-[#1F1F1F] opacity-60 font-[Inter] font-light mt-2">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#e97e3a] h-10 md:h-12 text-white text-base md:text-xl font-[Inter]"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
            ) : (
              "Login"
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
            onClick={() => {
              setGoogleLoading(true);
              signIn("google", {
                callbackUrl: searchParams.get("callbackUrl") || "/home",
              });
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

          <div className="flex justify-center gap-x-2 md:gap-x-4 pt-2">
            <p className="text-base md:text-lg font-[Inter] opacity-60 text-[#1F1F1F] text-center font-light">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#1F1F1F] font-bold underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
        <Image
          src={LoginImage}
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

function LoginPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}

export default LoginPageWithSuspense;
