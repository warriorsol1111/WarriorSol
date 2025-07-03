"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import sunsetImage from "@/assets/sunset.png";
import userImage from "@/assets/user.svg";
import missionImage from "@/assets/mission.png";
import { StoryCard } from "./storyCard";
import { StoryDrawer } from "./storyDrawer";
import { SocialLinks } from "../shared/socialLinks";
import { MdArrowOutward } from "react-icons/md";

const stories = [
  {
    title:
      "I wore this lid when I sat by her bed, every chemo session. I still wear it today — for her.",
    author: {
      name: "Marcus Chen",
      role: "The Guardian - Husband",
      avatar: userImage,
    },
    background: sunsetImage.src,
    link: "/stories/marcus",
  },
  // ...more stories
  {
    title:
      "I wore this lid when I sat by her bed, every chemo session. I still wear it today — for her.",
    author: {
      name: "Marcus Chen",
      role: "The Guardian - Husband",
      avatar: userImage,
    },
    background: missionImage.src,
    link: "/stories/marcus",
  },
];

const Community = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
              Why I Wear Mine{" "}
            </h2>
            <p className="text-base sm:text-lg lg:text-[20px] font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2 sm:mt-0">
              Real stories from real warriors in our community
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto border border-black px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px] font-['Inter'] capitalize flex items-center justify-center sm:justify-start gap-2 transition"
          >
            Share Your Story <MdArrowOutward className="w-6 h-6" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {stories.map((story, index) => (
            <StoryCard key={index} {...story} id={index.toString()} />
          ))}
        </div>
        <StoryDrawer isOpen={isOpen} onOpenChange={setIsOpen} />
      </section>
      <SocialLinks />
    </>
  );
};

export default Community;
