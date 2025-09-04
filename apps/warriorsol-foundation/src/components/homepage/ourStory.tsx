"use client";
import React from "react";
import Image from "next/image";
import SunsetBg from "@/assets/sunset.png";
import { RiDoubleQuotesL } from "react-icons/ri";

export default function OurStory() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <div className="relative w-full min-h-[700px] mt-12 sm:mt-16">
        {/* Background Image */}
        <Image
          src={SunsetBg}
          alt="Sunset Background"
          fill
          className="object-cover"
          priority
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
          <div className="w-full max-w-5xl mx-auto bg-white/90 p-6 sm:p-10 md:p-12 rounded-lg shadow-md">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal  text-center mb-4">
              Jimmy&apos;s Story
            </h2>
            <h3 className="text-base sm:text-lg md:text-xl text-center   text-gray-600 mb-8 sm:mb-12">
              The Inspiration Behind Our Foundation
            </h3>

            {/* Quote Icon */}
            <div className="flex items-center justify-center mb-6 sm:mb-10">
              <RiDoubleQuotesL className="text-3xl sm:text-5xl md:text-6xl text-[#EE9254]" />
            </div>

            {/* Story Content */}
            <div className="space-y-6 text-center md:text-left text-gray-800">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed">
                When I first met Tasha, she was just eight years old, facing
                challenges that no child should ever have to endure. Her courage
                and strength in the face of adversity showed me what it truly
                means to be a warrior.
              </p>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed">
                Through her journey, I witnessed firsthand how crucial it is for
                families to have support during their most difficult moments.
                Tasha&apos;s family needed more than just medical care — they
                needed hope, community, and resources to help them navigate the
                unknown.
              </p>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed">
                That&apos;s when I realized we could do more. We could be the
                support system that families like Tasha&apos;s need. The Warrior
                Sol Foundation was born from this understanding — that every
                family deserves to have warriors standing beside them during
                life&apos;s toughest battles.
              </p>

              {/* Blockquote */}
              <blockquote className="border-l-4 border-[#EE9254] pl-4 sm:pl-6 italic mt-6 sm:mt-8 text-base sm:text-lg md:text-xl font-semibold">
                &quot;Tasha taught me that being a warrior isn&apos;t about
                fighting alone — it&apos;s about having the courage to accept
                help and the strength to keep going, knowing that your community
                believes in you.&quot;
                <footer className="mt-3 text-gray-600 text-sm sm:text-base ">
                  — Jimmy, Founder
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
