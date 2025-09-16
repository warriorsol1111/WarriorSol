"use client";

import mainImage from "@/assets/Rectangle 215.png";
import missionImage from "@/assets/mission.png";
import { SocialLinks } from "@/components/shared/socialLinks";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import RecommendedProducts from "@/components/community/recommendedProducts";

const CommunityPage = () => {
  const router = useRouter();
  const FOUNDATION_URL = process.env.NEXT_PUBLIC_FOUNDATION_URL;
  return (
    <main className="bg-white text-black">
      {/* ✅ HERO TEXT Section */}
      <section className="w-full text-center">
        <h1 className="text-[40px] md:text-[62px] text-center md:text-left mx-auto max-w-[90%] font-normal mt-10 text-[#1F1F1F] leading-tight">
          Our Bold Vision: To Raise $25 Million Over The Next 3 Years{" "}
        </h1>
        <p className="mt-6 text-[16px] md:text-[20px] capitalize  leading-relaxed text-[#1F1F1FB2] text-center md:text-left max-w-[90%] mx-auto">
          We&apos;re on a mission to raise $25 million over the next three
          years—a goal that would make us the largest foundation worldwide
          providing direct aid to families impacted by cancer.
        </p>
      </section>

      {/* ✅ HERO IMAGE Section */}
      <section className="w-full mt-10">
        <Image
          src={mainImage}
          alt="Hero Background"
          className="w-full h-auto object-cover"
          placeholder="blur"
        />
      </section>

      {/* ✅ MISSION SECTION */}
      <section className="w-full px-6 md:px-24 md:py-20 mt-10 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <Image
            src={missionImage}
            alt="Mission Visual"
            className="rounded w-full h-auto object-cover"
            placeholder="blur"
          />
        </div>
        <div className="flex-1 text-center md:text-left md:mb-[200px]">
          <h2 className="text-[22px] md:text-[52px] font-cormorantSC capitalize leading-tight mb-6 text-[#1F1F1F]">
            Globally, Foundations And Organizations Raise $15 Billion Annually
            For Cancer-related Causes. But Less Than 10% Reaches The People
            Living With Cancer Daily Realities.{" "}
          </h2>
          <p className="text-[16px] md:text-[20px] text-center md:text-left capitalize md:mb-0 mb-10  text-black/70 leading-relaxed">
            We&apos;re on a mission to raise $25 million over the next three
            years—a goal that would make us the largest foundation worldwide
            providing direct aid to families impacted by cancer. Our bold
            vision: to raise $25 Million over the next 3 years Most of the help
            goes to research, while those living with the day-to-day realities
            of cancer often find themselves without the support they need—
            financially, emotionally, and socially.e here to fight for truth,
            tenderness, and tangible impact.
          </p>
        </div>
      </section>
      <div className="bg-[#EE9253]">
        <div className=" mx-auto md:px-20 py-16 lg:py-24">
          <p className="text-[16px] md:text-[20px] mt-[-10px] font-medium text-white text-center">
            We Are Here To Meet The Human Needs That Research Funding Does Not
            Touch.{" "}
          </p>
          <h1 className="text-[22px] lg:text-[42px] font-medium text-white mt-4 md:mt-0 text-center">
            Because every warrior, every caregiver, and every supporter deserves
            to feel seen, heard, and supported in this journey.
          </h1>
        </div>
      </div>
      <section className="w-full px-6 md:px-24 mb-[-250px] md:py-20 mt-10 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 text-center md:text-left md:mb-[200px]">
          <h2 className="text-[42px] md:text-[52px] font-cormorantSC capitalize leading-tight mb-6 text-[#1F1F1F]">
            The Hidden Battles
          </h2>
          <p className="text-[16px] md:text-[20px] text-center md:text-left capitalize  text-black/70 leading-relaxed">
            Every year, cancer impacts millions. For every person facing a
            diagnosis, 10 to 20 others are affected.
            <br />
            <br />
            Families, friends, and caregivers carry invisible burdens the
            sleepless nights, the loss of income, the overwhelming costs of
            care, the isolation from friends who don&apos;t know what to say,
            and the guilt caregivers feel when they try to care for themselves.
            <br />
            <br />
            Too often, people are left to navigate this storm alone, without a
            safety net.
          </p>
        </div>
        <div className="flex-1 w-full min-h-[1000px]">
          <Image
            src={missionImage}
            alt="Mission Visual"
            className="rounded w-full h-auto object-cover"
            placeholder="blur"
          />
        </div>
      </section>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 md:px-24 md:py-20 gap-6 lg:gap-8">
        <div className="flex-1">
          <h2 className="text-[32px] mt-10 md:mt-0 lg:text-[50px] text-center lg:text-start leading-tight lg:leading-[62px] font-semibold text-[#1F1F1F] capitalize">
            This is where Warrior Sol Foundation steps in{" "}
          </h2>
          <p className="text-base sm:text-lg lg:text-[20px] font-medium text-center lg:text-start text-[#1F1F1FB2] capitalize mt-4">
            To provide direct aid to people and families impacted by cancer,
            covering urgent needs, from medical travel expenses to utility
            bills, to comfort items that bring relief in difficult moments.
          </p>
        </div>
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <Button
            variant="outline"
            onClick={() => router.push(`${FOUNDATION_URL}`)}
            className="w-full sm:w-auto lg:w-auto min-w-[200px] max-w-[300px] mb-10 md:mb-0 lg:max-w-none flex items-center justify-center gap-2 px-6 sm:px-8 lg:px-12 py-3 lg:py-4 border border-[#1F1F1F] bg-white text-[16px] lg:text-[20px] text-[#1F1F1F] hover:bg-gray-200 hover:text-[#1F1F1F] transition-colors duration-200"
          >
            <span className="whitespace-nowrap">Join The Movement</span>
            <GoArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
          </Button>
        </div>
      </div>
      <div className="bg-[#EE9253]">
        <div className=" mx-auto md:px-20 py-12 lg:py-12">
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            When you wear Warrior Sol, you invest in your own comfort while
            fuelling a mission that uplifts an entire community.
          </h1>
        </div>
      </div>

      <RecommendedProducts />

      <SocialLinks />
    </main>
  );
};

export default CommunityPage;
