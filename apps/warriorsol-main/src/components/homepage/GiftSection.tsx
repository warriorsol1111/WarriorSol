"use client";
import Image from "next/image";
import React from "react";
import Gift1 from "@/assets/gift1.jpg";
import Gift2 from "@/assets/gift2.jpg";
import Gift3 from "@/assets/gift3.png";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function MeaningfulGiftComponent() {
  const router = useRouter();
  const steps = [
    {
      id: 1,
      title: "PICK THEIR PIECE",
      image: Gift1,
    },
    {
      id: 2,
      title: "ADD A MESSAGE",
      image: Gift2,
      badge: "N H",
    },
    {
      id: 3,
      title: "WE DELIVER WITH SOUL",
      image: Gift3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7DF]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-[62px] font-semibold text-[#1F1F1F] mb-6">
            Give Meaning, Not Just Merchandise
          </h1>
          <p className="text-lg md:text-[20px] mt-[-10px] font-medium text-[#1F1F1FB2] ">
            Send More Than A Gift. Send Strength, Hope, And The Reminder That
            They&apos;re Not Alone.
          </p>
        </div>

        {/* Three Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div className="rounded-4xl overflow-hidden shadow-lg aspect-square relative">
                {/* Background image */}
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Step Number */}
                <div className="absolute top-0 left-0 z-10">
                  <span className="text-[60px] lg:text-[90px] xl:text-[180px] font-medium text-white drop-shadow-lg">
                    {step.id}
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="text-white text-lg md:text-[24px] lg:text-[32px] font-medium drop-shadow-lg">
                    {step.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center flex justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border border-black px-4 text-[#1F1F1F] sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px]  capitalize flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
            onClick={() => router.push("/products")}
          >
            <span className="flex items-center gap-2">
              Get a gift
              <GoArrowUpRight className="inline text-black text-xl" />
            </span>
          </Button>
        </div>
      </div>
      <div className="bg-[#EE9253]">
        <div className="container mx-auto md:px-20 py-16 lg:py-24">
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            Take Care Of Yourself Is Act Of Love & Courage{" "}
          </h1>
          <p className="text-lg md:text-[20px] mt-[-10px] font-medium text-white text-center">
            -For You For Life And For Others
          </p>
        </div>
      </div>
    </div>
  );
}
