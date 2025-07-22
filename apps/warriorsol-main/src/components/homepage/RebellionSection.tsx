"use client";

import React from "react";
import Image from "next/image";
import rebellionImage from "@/assets/rebellion-image.png";

const RebellionSection: React.FC = () => {
  return (
    <div className="w-full text-[#1F1F1F]">
      {/* Text Section */}
      <section className="w-full bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 lg:py-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-left capitalize max-w-full  mx-auto">
          Not Just Apparel.
          <br className="hidden sm:block" />A Rebellion Wrapped In Thread.
        </h2>
      </section>

      {/* Image Banner Section */}
      <section className="relative w-full overflow-hidden">
        <div className="w-full">
          <Image
            src={rebellionImage}
            alt="Rebellion"
            className="w-full h-auto object-cover object-center"
            placeholder="blur"
            priority
          />
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1F1F1F]/60 pointer-events-none" />
      </section>
    </div>
  );
};

export default RebellionSection;
