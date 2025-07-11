import React from "react";
import FamilyPhoto1 from "@/assets/image 1.png";
import FamilyPhoto2 from "@/assets/image 2.png";
import FamilyPhoto3 from "@/assets/image 3.png";
import FamilyPhoto4 from "@/assets/image 4.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CircleThatNeverCloses = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 mb-8 lg:mb-12">
        <div>
          <h2 className="text-[32px] sm:text-[42px] lg:text-[62px] text-center md:text-start leading-tight sm:leading-[1.1] lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
            A Circle That Never Closes
          </h2>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-center md:text-start font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2 sm:mt-3">
            Join Thousands Of Warriors, Guardians, And Allies Who Wear Their
            Stories With Pride
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border border-black px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px] font-['Inter'] capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-black hover:text-white transition"
        >
          Join The Movement ↗
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
          <Image
            src={FamilyPhoto1}
            alt="Family photo"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
          <Image
            src={FamilyPhoto2}
            alt="Family on boat"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
          <Image
            src={FamilyPhoto3}
            alt="Portrait photo"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
          <Image
            src={FamilyPhoto4}
            alt="Family with children"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
    </section>
  );
};

export default CircleThatNeverCloses;
