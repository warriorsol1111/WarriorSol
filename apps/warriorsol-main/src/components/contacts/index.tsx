"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import FormImage from "@/assets/formImage.svg";
import { useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";

type FormData = {
  fullName: string;
  email: string;
  message: string;
};

const Contacts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // TODO: Implement form submission logic
    console.log("Form submitted:", data);
  };

  return (
    <section className="w-full bg-white py-16 px-6 sm:px-12 lg:px-24">
      <h1 className="text-4xl sm:text-5xl text-center font-semibold">
        Contact
      </h1>
      <p className="text-center mt-4 text-lg sm:text-xl text-gray-600 mx-auto">
        Whether you have questions about our products, need assistance with your
        order, or just want to say hello, feel free to reach out. Our dedicated
        team is here to help you with any inquiries you may have.
      </p>

      <div className="mt-12 flex flex-col lg:flex-row items-stretch">
        {/* Left image */}
        <div className="w-full lg:w-1/2">
          <Image
            src={FormImage}
            alt="Contact Form Illustration"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 bg-[#FFEBCC] rounded-lg p-6 sm:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white h-full  p-6 sm:p-8 rounded-md space-y-6 shadow-md"
          >
            <div>
              <Label className="block text-sm font-medium mb-1">
                Full Name
              </Label>
              <Input
                {...register("fullName", { required: "Full name is required" })}
                type="text"
                placeholder="Daniyal Khan"
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">
                Email Address
              </Label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Daniyal.Khan@Ccript.Com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Message</Label>
              <Textarea
                {...register("message", { required: "Message is required" })}
                placeholder="Your Message..."
                className="w-full min-h-[300px] px-4 py-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
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
              className="w-full py-3 rounded-md text-white bg-[#EE9254] hover:bg-[#e9823b] font-medium flex items-center justify-center gap-2"
            >
              Send Message <span className="text-lg">➜</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
