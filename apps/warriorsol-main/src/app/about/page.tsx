"use client";

import mainImage from "@/assets/Rectangle 215.png";
import coleImage from "@/assets/cole.png";
import jimmyImage from "@/assets/jimmy.png";
import missionImage from "@/assets/mission.png";
import { SocialLinks } from "@/components/shared/socialLinks";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const teamMembers = [
  {
    name: "Cole",
    role: "Creative Lead & Storykeeper",
    image: coleImage,
    description:
      "Cole brings vision, voice, and vulnerability to the heart of the brand. A designer with a mission, and a son who carries strength in his blood.",
  },
  {
    name: "Jimmy",
    role: "Founder, Warrior #2",
    image: jimmyImage,
    description:
      'A father, a husband, and now, a messenger of light. After losing his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his way of saying: "We’re still here. We’re still fighting."',
  },
  {
    name: "Cole",
    role: "Creative Lead & Storykeeper",
    image: coleImage,
    description:
      "Cole brings vision, voice, and vulnerability to the heart of the brand. A designer with a mission, and a son who carries strength in his blood.",
  },
  {
    name: "Jimmy",
    role: "Founder, Warrior #2",
    image: jimmyImage,
    description:
      'A father, a husband, and now, a messenger of light. After losing his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his way of saying: "We’re still here. We’re still fighting."',
  },
];

const CommunityPage = () => {
  return (
    <main className="bg-white text-black font-inter">
      {/* ✅ HERO TEXT Section */}
      <section className="w-full text-center">
        <h1 className="text-[40px] md:text-[62px] font-cormorantSC font-normal text-[#1F1F1F] leading-tight">
          Our Story – Born Of Fire, Built To Shine
        </h1>
        <p className="mt-6 text-[16px] md:text-[20px] font-[Inter] font-light leading-relaxed text-[#1F1F1FB2] max-w-5xl mx-auto">
          Warrior Sol began not as a brand, but as a battle cry. We are rooted
          in the lived experience of love, loss, and resilience. This journey
          started with Tasha—our first warrior, our North Star...
        </p>
      </section>

      {/* ✅ HERO IMAGE Section */}
      <section className="w-full">
        <Image
          src={mainImage}
          alt="Hero Background"
          className="w-full h-auto object-cover"
          placeholder="blur"
        />
      </section>

      {/* ✅ MISSION SECTION */}
      <section className="w-full px-6 md:px-24 py-20 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <Image
            src={missionImage}
            alt="Mission Visual"
            className="rounded w-full h-auto object-cover"
            placeholder="blur"
          />
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-[42px] md:text-[62px] font-cormorantSC capitalize leading-tight mb-6 text-[#1F1F1F]">
            Our Mission – Apparel With A Pulse
          </h2>
          <p className="text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 leading-relaxed">
            At Warrior Sol, our mission is to create emotionally powerful
            apparel...
          </p>
        </div>
      </section>

      {/* ✅ TEAM SECTION with CAROUSEL */}
      <section className="w-full px-6 md:px-24 py-20 text-center">
        <h2 className="text-[42px] md:text-[62px] text-[#1F1F1F] font-cormorantSC capitalize">
          Our Team
        </h2>
        <p className="mt-4 text-[16px] md:text-[20px] font-[Inter] font-light text-[#1F1F1FB2] opacity-70">
          We&apos;ve walked these halls. We&apos;ve held the hands. We&apos;ve
          heard the silence—and we chose to speak.
        </p>

        <div className="mt-12 relative w-full max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent className="mb-20">
              {teamMembers.map((member, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 flex justify-center"
                >
                  <div className="flex flex-col items-start text-left bg-white rounded-2xl shadow-md p-6">
                    <div className="w-full h-[300px] overflow-hidden rounded">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        placeholder="blur"
                      />
                    </div>
                    <h3 className="mt-4 text-[24px] text-[#1F1F1F] font-normal font-cormorant">
                      {member.name}
                    </h3>
                    <p className="text-[16px] text-[#1F1F1F99] font-[Inter]">
                      {member.role}
                    </p>
                    <p className="mt-2 text-[16px] font-light text-[#1F1F1FB2] font-[Inter] ">
                      {member.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <CarouselPrevious className=" static translate-y-0 w-10 h-10 border border-[#6B2C1A] text-[#6B2C1A] rounded-none bg-transparent hover:bg-[#6B2C1A] hover:text-white transition" />
              <CarouselNext className=" static translate-y-0 w-10 h-10 border border-[#6B2C1A] text-[#6B2C1A] rounded-none bg-transparent hover:bg-[#6B2C1A] hover:text-white transition" />
            </div>
          </Carousel>
        </div>
      </section>

      <SocialLinks />
    </main>
  );
};

export default CommunityPage;
