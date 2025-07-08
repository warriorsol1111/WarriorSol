"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import LoginImage from "@/assets/auth/login.svg";
import Logo from "@/assets/auth/logo.svg";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      if (response.error.includes("User is not verified")) {
        toast.error("User not verified");
        router.push(`/verify-email?email=${email}`);
      } else if (response.error.includes("Invalid credentials")) {
        toast.error("Invalid credentials");
      } else if (
        response.error.includes("linked to a Google account") ||
        response.error.includes("sign in with Google")
      ) {
        toast.error(
          "This account is linked to Google. Please sign in with Google."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("Login successful");
      router.push("/home");
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 md:px-24">
        <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal">
              Welcome Back!
            </h1>
            <p className="font-light text-base md:text-lg">
              Enter Your Credentials To Access Your Account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
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
            <div className="text-right text-base md:text-lg text-[#1F1F1F99] font-light mt-2">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <span className="text-base md:text-lg">Or</span>
          </div>

          <div className="flex gap-8 md:gap-24 justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="text-3xl md:text-4xl !w-1/2 !h-1/2" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <FaFacebook className="text-xl md:text-2xl text-[#1877F2] !w-1/2 !h-1/2" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <FaApple className="text-xl md:text-2xl !w-1/2 !h-1/2" />
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#EE9254] cursor-pointer hover:bg-[#EE9254] h-10 md:h-12 text-white text-base md:text-lg"
          >
            Sign In
          </Button>
          <div className="flex justify-center gap-x-2 md:gap-x-4">
            <p className="text-base md:text-lg text-center font-light">
              Don&apos;t Have An Account?{" "}
              <a href="/signup" className="text-black font-bold underline">
                SignUp
              </a>
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
