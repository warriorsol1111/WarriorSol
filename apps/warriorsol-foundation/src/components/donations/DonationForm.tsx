"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DonationFormImage from "@/assets/donationForm.svg";
import { FaRegHeart } from "react-icons/fa6";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";
import { BiDonateHeart } from "react-icons/bi";

export default function DonationForm() {
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { data: session } = useSession();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    amount: "",
  });

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    let valid = true;
    const newErrors = { name: "", email: "", amount: "" };

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Full name is required.";
      valid = false;
    } else if (trimmedName.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      valid = false;
    } else if (!/\S/.test(trimmedName)) {
      newErrors.name = "Name cannot be just spaces.";
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }
    const selectedAmount = customAmount || amount;
    if (
      !selectedAmount ||
      isNaN(Number(selectedAmount)) ||
      Number(selectedAmount) <= 0
    ) {
      newErrors.amount = "Please enter a valid donation amount.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  async function handleDonate() {
    if (!validate()) return;
    const selectedAmount = customAmount || amount;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(selectedAmount),
        donationType,
        email,
        name,
        userId: session?.user?.id || null,
        foundation: "warriorsol-foundation",
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to create checkout session");
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-8 mt-10 md:mb-16 px-4">
        <h2 className='text-[26px] sm:text-[36px] md:text-[48px] lg:text-[62px] leading-tight font-["Cormorant_SC"] font-normal text-[#1F1F1F] mb-3'>
          Make a Difference Today
        </h2>
        <p className='text-[15px] sm:text-[17px] md:text-[20px] font-light font-["Inter"] text-[#1F1F1F]/70 mx-auto max-w-xl'>
          Every donation helps families facing their greatest challenges. Your
          support provides hope, resources, and healing.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row w-full min-h-full bg-neutral-900">
        {/* Image */}
        <div className="w-full lg:w-1/2 h-[220px] sm:h-[300px] md:h-[400px] lg:h-auto relative">
          <Image
            src={DonationFormImage}
            alt="Family Image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-[#FFEBCC] flex p-4 sm:p-6 md:p-10">
          <Card className="w-full shadow-none border-none bg-[#FFF9F5]">
            <CardContent className="flex flex-col justify-between h-full space-y-8 p-4 sm:p-6 md:p-10">
              <h2 className="text-2xl sm:text-3xl md:text-[42px] font-light font-['Cormorant_SC'] text-center flex gap-2 justify-center lg:justify-start items-center">
                <FaRegHeart className="w-8 h-8 sm:w-10 sm:h-10 mt-1 text-[#EE9254]" />
                Donation Form
              </h2>

              <div className="space-y-6 flex-grow">
                {/* Donation Type */}
                <div>
                  <Label className="text-base sm:text-lg md:text-xl mb-4 block">
                    Donation Type
                  </Label>
                  <RadioGroup
                    value={donationType}
                    onValueChange={setDonationType}
                    className="flex flex-col gap-3"
                  >
                    {[
                      { id: "one-time", label: "One-Time Donation" },
                      { id: "monthly", label: "Monthly Recurring Donation" },
                    ].map(({ id, label }) => (
                      <div
                        key={id}
                        onClick={() => setDonationType(id)}
                        className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition ${
                          donationType === id
                            ? "bg-[#EE9254] !text-white border-none"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value={id} id={id} />
                        <Label
                          htmlFor={id}
                          className={`cursor-pointer text-base sm:text-lg ${
                            donationType === id ? "text-white" : ""
                          }`}
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Donation Amount */}
                <div>
                  <Label className="text-base sm:text-lg md:text-xl mb-4 block">
                    Donation Amount
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["10", "25", "50", "100", "250", "500"].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        className={`rounded text-base hover:bg-[#EE9254] hover:text-white sm:text-lg font-[Inter] h-10 sm:h-12 ${
                          amount === val
                            ? "bg-[#EE9254] text-white border-none"
                            : "bg-white border-gray-200"
                        }`}
                        onClick={() => {
                          setAmount(val);
                          setCustomAmount("");
                        }}
                      >
                        ${val}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Input
                      placeholder={
                        donationType === "monthly"
                          ? "Custom amount not available for monthly"
                          : "Custom ($)"
                      }
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (errors.amount) setErrors({ ...errors, amount: "" });
                      }}
                      onFocus={() => setAmount("")}
                      className="rounded border-gray-200 h-10 sm:h-12"
                      disabled={donationType === "monthly"}
                    />
                  </div>
                  {errors.amount && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.amount}
                    </div>
                  )}
                </div>

                {/* Name & Email */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base sm:text-lg md:text-xl mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      placeholder="Enter your full name"
                      className="rounded bg-white border-gray-200 h-10 sm:h-12"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-base sm:text-lg md:text-xl mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      placeholder="Enter your email address"
                      className="rounded bg-white border-gray-200 h-10 sm:h-12"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-[#EE9254] hover:bg-[#e76b1f] text-lg sm:text-xl font-[Inter] font-normal rounded text-white h-12 sm:h-14"
                onClick={handleDonate}
              >
                Donate Now
                <BiDonateHeart className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
