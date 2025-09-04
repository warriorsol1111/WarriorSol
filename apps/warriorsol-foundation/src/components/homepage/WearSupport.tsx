import React from "react";
import Image from "next/image";
import WearSupportImage from "@/assets/wear-support.svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BiDonateHeart } from "react-icons/bi";

const WearYourSupportSection = () => {
  const router = useRouter();

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src={WearSupportImage}
        alt="Wear Support"
        className="w-full h-full object-cover"
        fill
        priority
        sizes="100vw"
      />

      {/* Overlay content */}
      <div className="relative z-10 w-full h-full px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start min-h-full py-10 sm:py-16">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 text-white pt-8 sm:pt-16 lg:pt-24">
            <h1 className="text-3xl sm:text-5xl lg:text-[60px] font-bold leading-tight drop-shadow-md">
              Wear Your
              <br />
              <span className="text-white/95">Support</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-[24px] font-medium leading-relaxed text-white/90 max-w-md drop-shadow-md">
              Every Purchase From Warrior Sol Apparel Helps Fund Direct Support
              For Families Facing Cancer
            </p>
          </div>
        </div>

        {/* Centered CTA Button */}
        <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-10 sm:pb-0">
          <Button
            size="default"
            className="inline-flex items-center space-x-2 border border-white bg-transparent hover:bg-white/20 text-white text-sm sm:text-lg font-medium px-6 sm:px-10 lg:px-20 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group"
            onClick={() => router.push("/donations")}
          >
            Donate Now{" "}
            <BiDonateHeart className="!w-4 !h-4 sm:!w-5 sm:!h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WearYourSupportSection;
