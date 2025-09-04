"use client";
import React from "react";
import FamilyPhoto1 from "@/assets/image 1.png";
import FamilyPhoto2 from "@/assets/image 2.png";
import FamilyPhoto3 from "@/assets/image 3.png";
import FamilyPhoto4 from "@/assets/image 4.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiDonateHeart } from "react-icons/bi";

const InstagramSection = () => {
  const router = useRouter();
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
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
      <div className="flex flex-col items-center justify-center mt-20">
        <p className=" text-[42px] md:text-[62px] font-normal text-[#1F1F1F] max-w-[80%] mx-auto text-center">
          Your Gift Fuels Direct Aid, Education, And A Community Of Support That
          Helps Cancer Warriors And Everyone In The Battle Rise With Courage.
        </p>
        <div className=" justify-center mt-10">
          <Button
            size="default"
            className="inline-flex items-center space-x-2 border bg-transparent hover:bg-transparent  text-[clamp(1rem,2.2vw,1.375rem)] font-medium px-8 sm:px-12 whitespace-nowrap !lg:px-20 py-2.5 sm:py-3 rounded-xl border-black text-black hover:text-white transition-all duration-300 group"
            onClick={() => router.push("/donations")}
          >
            Donate Now <BiDonateHeart className="!w-5 !h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
