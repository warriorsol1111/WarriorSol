"use client";
import React from "react";
import Image from "next/image";
import heroImage from "@/assets/image.png";
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const router = useRouter();
  return (
    <section className="relative w-full h-[829px] text-white">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(31, 31, 31, 0) 0%, rgba(31, 31, 31, 0.8) 100%)",
        }}
      />

      {/* Content Block - Now Positioned Closer to Bottom */}
      <div className="absolute inset-x-0 bottom-28 z-20 flex flex-col md:flex-row justify-between px-6 md:px-24 gap-8 md:gap-0">
        {/* LEFT SECTION */}
        <div className="max-w-[658px]">
          <h1 className="text-[40px] md:text-[70px] leading-[40px] md:leading-[70px] font-['Cormorant_SC'] font-bold capitalize">
            Born of <span className="text-[#EE9254]">Fire</span>.
            <br />
            Built To Shine.
          </h1>
          <p className="text-[#EE9254] font-['Cormorant_SC'] text-[20px] md:text-[24px] font-semibold mt-6 capitalize leading-[20px] md:leading-[24px]">
            &quot;You Are The Light. Wear Your Story.&quot;
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="max-w-full md:max-w-[433px]">
          <p className="font-['Inter'] text-[14px] md:text-[16px] text-white/80 capitalize leading-[140%] md:leading-[100%]">
            More than apparel—we&apos;re a battle cry wrapped in comfort, style,
            and purpose. Built for the fighters, survivors, and the ones who
            never stopped standing by their side.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="mt-6 flex items-center gap-2 px-5 py-[12px] border border-white text-white text-[18px] md:text-[20px] font-['Inter'] capitalize hover:bg-white hover:text-black transition w-full md:w-auto justify-center md:justify-start"
          >
            Shop the story
            <span className="ml-1">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
