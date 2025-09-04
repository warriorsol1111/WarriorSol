"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DonorWallImage from "@/assets/donorWallImage.svg";
import { FaHeart } from "react-icons/fa";
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

  // Memoize button styles to avoid recalculating on every render
  const buttonStyles = useMemo(
    () => ({
      selected: "bg-[#C1E965B2] text-black border-none",
      default: "bg-white border-gray-200",
    }),
    []
  );

  // Memoize radio button styles
  const radioStyles = useMemo(
    () => ({
      selected: "bg-[#C1E965B2] text-black border-none",
      default: "bg-white border-gray-200",
    }),
    []
  );

  // Memoize donation amounts array
  const donationAmounts = useMemo(
    () => ["10", "25", "50", "100", "250", "500"],
    []
  );

  // Memoize donation types array
  const donationTypes = useMemo(
    () => [
      { id: "one-time", label: "One-Time Donation" },
      { id: "monthly", label: "Monthly Recurring Donation" },
    ],
    []
  );

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    let valid = true;
    const newErrors = { name: "", email: "", amount: "" };

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
      valid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces.";
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

  // Optimized amount selection handler
  const handleAmountSelect = useCallback(
    (val: string) => {
      setAmount(val);
      // Only clear custom amount if it's not already empty to avoid unnecessary re-renders
      if (customAmount) {
        setCustomAmount("");
      }
    },
    [customAmount]
  );

  // Optimized custom amount handler
  const handleCustomAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomAmount(value);
      // Only clear amount if it's not already empty
      if (amount) {
        setAmount("");
      }
      // Clear error if it exists
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: "" }));
      }
    },
    [amount, errors.amount]
  );

  // Optimized custom amount focus handler
  const handleCustomAmountFocus = useCallback(() => {
    if (amount) {
      setAmount("");
    }
  }, [amount]);

  // Optimized name change handler
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow letters and spaces
      const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
      setName(value);
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    },
    [errors.name]
  );

  // Optimized email change handler
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    },
    [errors.email]
  );

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
        foundation: "tasha-mellett-foundation",
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
        <div className="w-full md:w-1/2 bg-white flex p-6 sm:p-8 md:p-12">
          <Card className="w-full shadow-none border-none bg-white">
            <CardContent className="flex flex-col justify-between h-full space-y-8 p-6 sm:p-8">
              <h2 className="text-3xl sm:text-[44px] text-[#1F1F1F] font-extrabold text-center flex gap-2 justify-start items-center">
                <FaHeart className="w-10 h-10 mt-1 text-[#C1E965]" />
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
                    {donationTypes.map(({ id, label }) => (
                      <div
                        key={id}
                        onClick={() => setDonationType(id)}
                        className={`flex items-center gap-2 p-3 border !text-[#1F1F1FCC] rounded-xl cursor-pointer ${
                          donationType === id
                            ? radioStyles.selected
                            : radioStyles.default
                        }`}
                      >
                        <RadioGroupItem
                          value={id}
                          id={id}
                          className={
                            donationType === id
                              ? "text-[#1F1F1FCC]"
                              : "text-[#C1E965B2]"
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
                    {donationAmounts.map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        className={`rounded-xl text-lg  h-10 sm:h-12 text-[#1F1F1FCC] ${
                          amount === val
                            ? buttonStyles.selected
                            : buttonStyles.default
                        }`}
                        onClick={() => handleAmountSelect(val)}
                      >
                        ${val}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Input
                      placeholder={
                        donationType === "monthly"
                          ? "Custom amount not available"
                          : "Custom ($)"
                      }
                      type="number"
                      value={customAmount}
                      onFocus={handleCustomAmountFocus}
                      onChange={handleCustomAmountChange}
                      disabled={donationType === "monthly"}
                      className={`rounded-xl border-gray-200 ${
                        donationType === "monthly"
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
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
                      className="rounded-xl bg-white border-gray-200"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
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
                      className="rounded-xl bg-white border-gray-200"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
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
                className="w-full bg-[#C1E965] hover:bg-[#C1E965]/90 text-xl  font-normal rounded-xl text-black h-12"
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
