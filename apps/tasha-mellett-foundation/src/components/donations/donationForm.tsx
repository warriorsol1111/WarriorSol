"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DonorWallImage from "@/assets/donorWallImage.svg";
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

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
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
      <div className="text-center mb-8 mt-10 md:mb-16 px-4">
        <h2 className="text-[44px] text-center font-extrabold ">
          Make a Difference Today
        </h2>
        <p className="text-[27px] text-[#999999] font-medium text-center ">
          Every donation helps families facing their greatest challenges. Your
          support provides hope, resources, and healing.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full min-h-full bg-neutral-900">
        {/* Image */}

        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-[#FFEBCC] flex p-6 sm:p-8 md:p-12">
          <Card className="w-full shadow-none border-none bg-[#FFF9F5]">
            <CardContent className="flex flex-col justify-between h-full space-y-8 p-6 sm:p-8">
              <h2 className="text-3xl sm:text-[52px] font-light font-['Cormorant_SC'] text-center flex gap-2 justify-start items-center">
                <FaRegHeart className="w-10 h-10 mt-1 text-[#EE9254]" />
                Donation Form
              </h2>

              <div className="space-y-6 flex-grow">
                {/* Donation Type */}
                <div>
                  <Label className="text-lg sm:text-xl mb-4 block">
                    Donation Type
                  </Label>
                  <RadioGroup
                    value={donationType}
                    onValueChange={setDonationType}
                    className="flex flex-col gap-4"
                  >
                    {[
                      { id: "one-time", label: "One-Time Donation" },
                      { id: "monthly", label: "Monthly Recurring Donation" },
                    ].map(({ id, label }) => (
                      <div
                        key={id}
                        onClick={() => setDonationType(id)}
                        className={`flex items-center gap-2 p-3 border rounded cursor-pointer ${
                          donationType === id
                            ? "bg-[#EE9254] text-white border-none"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <RadioGroupItem
                          value={id}
                          id={id}
                          className={
                            donationType === id
                              ? "text-white"
                              : "text-[#EE9254]"
                          }
                        />
                        <Label htmlFor={id} className="cursor-pointer text-lg">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Donation Amount */}
                <div>
                  <Label className="text-lg sm:text-xl mb-4 block">
                    Donation Amount
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["10", "25", "50", "100", "250", "500"].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        className={`rounded text-lg font-[Inter] h-10 sm:h-12 ${
                          amount === val
                            ? "bg-[#EE9254] text-white border-none"
                            : "bg-white border-gray-200"
                        }`}
                        onClick={() => setAmount(val)}
                      >
                        ${val}
                      </Button>
                    ))}
                  </div>
                  {donationType !== "monthly" && (
                    <div className="mt-2">
                      <Input
                        placeholder="Custom ($)"
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="rounded bg-white border-gray-200"
                      />
                    </div>
                  )}
                  {errors.amount && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.amount}
                    </div>
                  )}
                </div>

                {/* Name & Email */}
                <div className="space-y-5">
                  <div>
                    <Label className="text-lg sm:text-xl mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      placeholder="Enter your full name"
                      className="rounded bg-white border-gray-200"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-lg sm:text-xl mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      placeholder="Enter your email address"
                      className="rounded bg-white border-gray-200"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#EE9254] hover:bg-[#e76b1f] text-xl font-[Inter] font-normal rounded text-white h-12"
                onClick={handleDonate}
              >
                Donate Now
                <BiDonateHeart className="h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/2 h-[250px] md:h-auto relative">
          <Image
            src={DonorWallImage}
            alt="Family Image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
