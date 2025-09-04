"use client";
import React from "react";
import Image from "next/image";
import heroImage from "@/assets/hero.svg";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { BsArrowUpRight } from "react-icons/bs";

const Hero: React.FC = () => {
  const router = useRouter();

  return (
    <section className="relative w-full bg-white py-4 md:py-10">
      <div className="px-4 sm:px-6 md:px-8 mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT SECTION */}
        <div className=" text-left">
          <h1 className="text-[40px] mb-10 md:text-[82px] leading-tight  font-normal text-[#1F1F1F]">
            Born Of <span className="text-[#EE9254]">Fire</span>.Built
            <br /> To Shine.
          </h1>

          <p className="text-[#1F1F1F]  text-[18px] md:text-[24px] mt-[-40px] font-normal">
            You Are The Light. Wear Your Story.
          </p>

          <p className="mt-6 text-[#1F1F1F] text-[14px] md:text-[16px] leading-relaxed">
            More Than Apparel—We&apos;re a Battle Cry Wrapped in Comfort, Style,
            and Purpose. Built for the Fighters, Survivors, and the Ones Who
            Never Stopped Standing by Their Side.
          </p>

          <Button
            onClick={() => router.push("/products")}
            size="lg"
            className="mt-8 flex items-center !rounded-xl gap-2 px-6 py-3 border border-[#1F1F1F] bg-white text-[16px] md:text-[20px] text-[#1F1F1F]  hover:bg-gray-200 hover:text-[#1F1F1F] transition"
          >
            Shop The Story <BsArrowUpRight className="!w-6 !h-6" />
          </Button>
        </div>

        {/* RIGHT SECTION */}
        <div className="">
          <Image
            src={heroImage}
            alt="Hero Image"
            width={1000}
            height={1000}
            className="rounded-lg object-contain shadow-md"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
