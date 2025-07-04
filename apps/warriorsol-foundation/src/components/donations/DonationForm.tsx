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

export default function DonationForm() {
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");

  return (
    <>
      <div className="text-center mb-8 mt-10 md:mb-16">
        <h2 className='text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight md:leading-[62px] font-["Cormorant_SC"] font-normal text-[#1F1F1F] mb-3 md:mb-4'>
          Make a Difference Today
        </h2>
        <p className='text-[16px] sm:text-[18px] md:text-[20px] font-light font-["Inter"] text-[#1F1F1F]/70 mx-auto'>
          Every donation helps families facing their greatest challenges. Your
          support provides hope, resources, and healing.
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-neutral-900">
        <div className="md:w-1/2 w-full">
          <Image
            src={DonationFormImage}
            alt="Family Image"
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="md:w-1/2 w-full bg-[#FFEBCC] flex p-8 md:p-12">
          <Card className="w-full shadow-none border-none bg-[#FFF9F5]">
            <CardContent className="flex flex-col justify-between h-full space-y-8 p-8">
              <h2 className="text-[52px] font-light font-['Cormorant_SC'] text-center flex gap-2">
                <FaRegHeart className="w-12 h-12 mt-4 text-[#EE9254]" />
                Donation Form
              </h2>

              <div className="space-y-6 flex-grow">
                <div className="mb-8">
                  <Label className="text-xl mb-4 block">Donation Type</Label>
                  <RadioGroup
                    value={donationType}
                    onValueChange={setDonationType}
                    className="flex flex-col gap-4 rounded-sm"
                  >
                    <div
                      onClick={() => setDonationType("one-time")}
                      className={`flex items-center gap-2 p-3 border cursor-pointer ${
                        donationType === "one-time"
                          ? "bg-[#EE9254] text-white border-none"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <RadioGroupItem
                        value="one-time"
                        id="one-time"
                        className={
                          donationType === "one-time"
                            ? "text-white"
                            : "text-[#EE9254]"
                        }
                      />
                      <Label
                        htmlFor="one-time"
                        className="cursor-pointer text-lg"
                      >
                        One-Time Donation
                      </Label>
                    </div>
                    <div
                      onClick={() => setDonationType("monthly")}
                      className={`flex items-center gap-2 p-3 border cursor-pointer ${
                        donationType === "monthly"
                          ? "bg-[#EE9254] text-white border-none"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <RadioGroupItem
                        value="monthly"
                        id="monthly"
                        className={
                          donationType === "monthly"
                            ? "text-white"
                            : "text-[#EE9254]"
                        }
                      />
                      <Label
                        htmlFor="monthly"
                        className="cursor-pointer text-lg"
                      >
                        Monthly Recurring Donation
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mb-8">
                  <Label className="text-xl mb-4 block">Donation Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["25", "50", "100", "250", "500"].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        className={`rounded-none text-lg h-12 ${
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
                  <div className="relative mt-2">
                    <Input
                      placeholder="Custom ($)"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="rounded-none pr-10 bg-white border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="mb-5">
                    <Label className="text-xl mb-4 block">Full Name</Label>
                    <Input
                      placeholder="Enter your full name"
                      className="rounded-none bg-white border-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-xl mb-4 block">Email Address</Label>
                    <Input
                      placeholder="Enter your email address"
                      className="rounded-none bg-white border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-[#EE9254] hover:bg-[#e76b1f] rounded-none text-white h-12">
                Donate Now 💸
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
