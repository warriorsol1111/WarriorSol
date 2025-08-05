import React from "react";
import Image from "next/image";
import SunsetBg from "@/assets/sunset.png";
import { RiDoubleQuotesL } from "react-icons/ri";

export default function OurStory() {
  return (
    <div className="relative w-full min-h-[800px] mt-16">
      {/* Background Image */}
      <Image
        src={SunsetBg}
        alt="Sunset Background"
        fill
        className="object-cover"
        priority
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="w-[90%] mx-auto bg-white/90 p-8 sm:p-12 rounded-lg">
          <h2 className="text-[62px] font-normal sm:text-[62px] font-['Cormorant_SC'] text-center">
            Jimmy&apos;s Story
          </h2>
          <h3 className="text-[20px] font-light sm:text-[20px] font-[Inter] text-center text-gray-600 mb-12">
            The Inspiration Behind Our Foundation
          </h3>
          <div className="flex items-center justify-center mb-12">
            <RiDoubleQuotesL className="text-[62px] text-[#EE9254] " />
          </div>
          <div className="space-y-6 text-center md:text-start text-gray-800">
            <p className="text-[42px] font-semibold">
              When I First Met Tasha, She Was Just Eight Years Old, Facing
              Challenges That No Child Should Ever Have To Endure. Her Courage
              And Strength In The Face Of Adversity Showed Me What It Truly
              Means To Be A Warrior.
            </p>

            <p className="text-[42px] font-semibold">
              Through Her Journey, I Witnessed Firsthand How Crucial It Is For
              Families To Have Support During Their Most Difficult Moments.
              Tasha&apos;s Family Needed More Than Just Medical Care—They Needed
              Hope, Community, And Resources To Help Them Navigate The Unknown.
            </p>

            <p className="text-[42px] font-semibold">
              That&apos;s When I Realized We Could Do More. We Could Be The
              Support System That Families Like Tasha&apos;s Need. The Warrior
              Sol Foundation Was Born From This Understanding—That Every Family
              Deserves To Have Warriors Standing Beside Them During Life&apos;s
              Toughest Battles.
            </p>

            <blockquote className="border-l-4  border-[#EE9254] pl-6 italic mt-8 text-lg font-semibold">
              &quot;Tasha Taught Me That Being A Warrior Isn&apos;t About
              Fighting Alone—It&apos;s About Having The Courage To Accept Help
              And The Strength To Keep Going, Knowing That Your Community
              Believes In You.&quot;
              <footer className="mt-2 text-[#1F1F1FB2] text-base font-[Inter]">
                — Jimmy, Founder
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
