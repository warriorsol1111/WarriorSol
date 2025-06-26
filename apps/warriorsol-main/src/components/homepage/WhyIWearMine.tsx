"use client";
import React from "react";
import Image from "next/image";
import sunsetImage from "@/assets/sunset.png";
import userImage from "@/assets/user.svg";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface Story {
  id: number;
  quote: string;
  author: string;
  role: string;
  image?: string;
}

const stories: Story[] = [
  {
    id: 1,
    quote:
      "I Wore This Lid When I Sat By Her Bed, Every Chemo Session. I Still Wear It Today — For Her.",
    author: "Marcus Chen",
    role: "The Guardian - Husband",
    image: userImage,
  },
  // Add more stories as needed
];

const WhyIWearMine: React.FC = () => {
  const [currentStory, setCurrentStory] = React.useState(0);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <>
      {/* White Title Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-0 mb-8 md:mb-12">
          <div>
            <h2 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
              WHY I WEAR MINE
            </h2>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2">
              Real Stories From Real Warriors In Our Community
            </p>
          </div>
          <button className="border border-black px-4 sm:px-5 py-2 sm:py-3 text-[16px] sm:text-[18px] lg:text-[20px] font-['Inter'] capitalize flex items-center gap-2 hover:bg-black hover:text-white transition">
            Read All Stories ↗
          </button>
        </div>
      </section>

      {/* Story Section with Background */}
      <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] text-white">
        {/* Background Image */}
        <Image
          src={sunsetImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(31, 31, 31, 0.7), rgba(31, 31, 31, 0.8))",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Quote */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-2 sm:mb-4">
              &ldquo;
            </div>
            <p className="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[42px] font-['Cormorant'] leading-tight">
              {stories[currentStory].quote}
            </p>
          </div>

          {/* Bottom Bar with Author and Navigation */}
          <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 inset-x-4 sm:inset-x-6 md:inset-x-8 lg:inset-x-12 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full overflow-hidden">
                {stories[currentStory].image && (
                  <Image
                    src={stories[currentStory].image}
                    alt={stories[currentStory].author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="text-left">
                <p className="font-['Inter'] font-medium text-sm sm:text-base">
                  {stories[currentStory].author}
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  {stories[currentStory].role}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevStory}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={nextStory}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyIWearMine;
