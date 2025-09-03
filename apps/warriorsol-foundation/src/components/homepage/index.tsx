"use client";
import React from "react";
import HomeImage from "@/assets/home.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import OurMission from "./ourMission";
import RebellionNewsletter from "./RebellionNewsletter";
import ApplyForSupport from "./ApplyForSupport";
import { useRouter } from "next/navigation";
import WeSeeYouComponent from "./WeSeeYou";
import InstagramSection from "./InstagramSection";
import WearYourSupportSection from "./WearSupport";

export default function Homepage() {
  const router = useRouter();
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-5 mt-10">
        <div>
          <h2 className="text-4xl sm:text-5xl text-center md:text-start lg:text-[62px] leading-tight lg:leading-[62px]  mb-1 font-medium text-[#1F1F1F] capitalize">
            WarriorSol Foundation
          </h2>
          <p className="text-base sm:text-lg text-center md:text-start lg:text-[20px] font-medium   text-[#1F1F1F]/70 capitalize">
            Fighting cancer&apos;s hidden battles together.
          </p>
        </div>
      </div>

      {/* Image with text overlay */}
      <div className="relative w-full">
        <Image
          src={HomeImage}
          alt="Home Image"
          className="w-full h-[60vh] sm:h-[70vh] lg:h-[90vh] object-cover"
          priority
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-white text-2xl sm:text-4xl md:text-6xl lg:text-[90px] font-normal mb-4 drop-shadow-lg leading-snug">
            Have You Asked For Help?
          </h3>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-[24px] font-normal mb-6 max-w-xl sm:max-w-2xl drop-shadow-lg leading-relaxed">
            Most people haven&apos;t. And we&apos;re here to change that.
          </p>

          {/* Buttons overlay */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center">
            <Button
              size="default"
              variant="outline"
              className="inline-flex items-center space-x-2 border text-white text-sm sm:text-base md:text-lg font-medium px-6 sm:px-10 md:px-12 py-2 sm:py-3 rounded-xl bg-transparent hover:bg-white/20 hover:text-white transition-all duration-300 group"
              onClick={() => router.push("/support")}
            >
              Apply For Support{" "}
              <GoArrowUpRight className="!w-4 !h-4 sm:!w-5 sm:!h-5 ml-2" />
            </Button>
            <Button
              size="default"
              className="inline-flex items-center space-x-2 border text-white text-sm sm:text-base md:text-lg font-medium px-6 sm:px-10 md:px-12 py-2 sm:py-3 rounded-xl bg-transparent hover:bg-white/20 hover:text-white transition-all duration-300 group"
              onClick={() => router.push("/donations")}
            >
              Donate Now{" "}
              <BiDonateHeart className="!w-4 !h-4 sm:!w-5 sm:!h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#EE9253]">
        <div className="container mx-auto md:px-20 py-16 lg:py-24">
          <p className="text-lg md:text-[20px] mt-[-10px] font-medium text-white text-center">
            Globally, $15Bi is raised annually but{" "}
          </p>
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            90% of cancer funding goes to research — less than 10% reaches
            families in need{" "}
          </h1>
        </div>
      </div>
      <OurMission />
      <WeSeeYouComponent />
      <ApplyForSupport />
      <InstagramSection />
      <WearYourSupportSection />
      <RebellionNewsletter />
    </section>
  );
}
