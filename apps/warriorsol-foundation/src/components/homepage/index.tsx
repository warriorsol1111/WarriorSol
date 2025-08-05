"use client";
import React from "react";
import HomeImage from "@/assets/homeImg.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import OurMission from "./ourMission";
import OurStory from "./ourStory";
import StoriesOfHope from "./StoriesOfHope";
import RebellionNewsletter from "./RebellionNewsletter";
import ApplyForSupport from "./ApplyForSupport";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div>
          <h2 className="text-4xl sm:text-5xl text-center md:text-start lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
            WarriorSol Foundation
          </h2>
          <p className="text-base sm:text-lg text-center md:text-start lg:text-[20px] font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2 sm:mt-0">
            Supporting families through life&apos;s most challenging moments
            with compassion, resources, and hope.
          </p>
        </div>
      </div>
      <Image
        src={HomeImage}
        alt="Home Image"
        className="w-full h-auto"
        width={1000}
        height={1000}
      />
      <div className="flex flex-col md:flex-row  gap-4 items-center justify-center mt-8">
        <Button
          size="default"
          variant="outline"
          className="hover:underline h-13 text-xl font-[Inter] font-normal hover:text-black w-64 border border-black"
          onClick={() => router.push("/support")}
        >
          Apply For Support <GoArrowUpRight className="!w-6 !h-6" />
        </Button>
        <Button
          size="default"
          className="bg-[#EE9254] text-xl font-[Inter] font-normal hover:bg-[#EE9254]/90 text-white w-52 h-13"
          onClick={() => router.push("/donations")}
        >
          Donate Now <BiDonateHeart className="!w-6 !h-6" />
        </Button>
      </div>
      <OurMission />
      <OurStory />
      <StoriesOfHope />
      <ApplyForSupport />
      <RebellionNewsletter />
    </section>
  );
}
