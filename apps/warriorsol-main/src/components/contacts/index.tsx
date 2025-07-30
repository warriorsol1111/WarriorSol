"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import FormImage from "@/assets/formImage.svg";
import { useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";

type FormData = {
  fullName: string;
  email: string;
  message: string;
};

const Contacts = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.email) {
      return toast.error("You must be logged in to send a message.");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to send message");

      toast.success("Message sent successfully!");
      reset();
    } catch (err) {
      console.error("Send message error:", err);
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-16 px-6 sm:px-12 lg:px-24">
      <h1 className="text-4xl md:text-[62px] text-[#1F1F1F] text-center font-semibold">
        Contact
      </h1>
      <p className="text-center mt-4 text-lg font-[Inter] opacity-70 sm:text-xl text-[#1F1F1F] mx-auto">
        Whether you have questions about our products, need assistance with your
        order, or just want to say hello, feel free to reach out. Our dedicated
        team is here to help you with any inquiries you may have.
      </p>

      <div className="mt-12 flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2">
          <Image
            src={FormImage}
            alt="Contact Form Illustration"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 bg-[#FFEBCC] rounded-lg p-6 sm:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white h-full p-6 sm:p-8 rounded-md space-y-6 shadow-md"
          >
            {/* Full Name */}
            <div>
              <Label className="block text-sm font-medium mb-1">
                Full Name
              </Label>
              <Input
                {...register("fullName", {
                  validate: (value) => {
                    const trimmed = value?.trim();

                    if (!trimmed || trimmed.length < 3) {
                      return "Name must be at least 3 characters.";
                    }

                    const wordCount = trimmed.split(/\s+/).length;
                    if (wordCount < 2 && !/^[A-Za-z]{4,}$/.test(trimmed)) {
                      return "Please enter a valid full name.";
                    }

                    return true;
                  },
                })}
                type="text"
                placeholder="Enter your full name"
                className={clsx(
                  "w-full px-4 py-2 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300",
                  errors.fullName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="block text-sm font-medium mb-1">
                Email Address
              </Label>
              <Input
                {...register("email", {
                  validate: (value) => {
                    if (!value) return "Email is required.";
                    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                    if (!pattern.test(value)) return "Invalid email address.";
                    return true;
                  },
                })}
                type="email"
                placeholder="Enter your email address"
                className={clsx(
                  "w-full px-4 py-2 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300",
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label className="block text-sm font-medium mb-1">Message</Label>
              <Textarea
                {...register("message", {
                  validate: (value) => {
                    if (!value || value.trim().length < 10)
                      return "Message must be at least 10 characters.";
                    return true;
                  },
                })}
                placeholder="Your Message..."
                className={clsx(
                  "w-full h-[300px] px-4 py-2 rounded-md border text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none overflow-y-auto",
                  errors.message
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300"
                )}
              />

              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={loading}
              className="w-full py-3 rounded-md text-xl font-[Inter] text-white bg-[#EE9254] hover:bg-[#e9823b] font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : 
              <>
              <span className="text-lg">Send Message</span>
              <FaArrowRightLong className="h-5 w-5" />
              </>
            }
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
