"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Story1 from "../../assets/story1.svg";
import Story2 from "../../assets/story2.svg";

interface Story {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const stories: Story[] = [
  {
    name: "Sarah M.",
    role: "Mother of three",
    image: Story1,
    quote:
      "The Warrior Sol Foundation came into our lives when we needed it most. Their support helped us focus on what truly mattered - being together as a family.",
  },
  {
    name: "David L.",
    role: "Father and caregiver",
    image: Story2,
    quote:
      "The Warrior Sol Foundation came into our lives when we needed it most. Their support helped us focus on what truly mattered - being together as a family.",
  },
  {
    name: "Emily R.",
    role: "Sister & supporter",
    image: Story1,
    quote:
      "The Warrior Sol Foundation came into our lives when we needed it most. Their support helped us focus on what truly mattered - being together as a family.",
  },
  {
    name: "James K.",
    role: "Uncle & mentor",
    image: Story2,
    quote:
      "The Warrior Sol Foundation came into our lives when we needed it most. Their support helped us focus on what truly mattered - being together as a family.",
  },
];

const chunkStories = (arr: Story[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export default function StoriesOfHope() {
  const chunks = chunkStories(stories, 2);
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % chunks.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + chunks.length) % chunks.length);
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-[44px] font-extrabold ">
              Stories Of Hope
            </h2>
            <p className="mt-2 text-[#999999] font-medium text-[27px]">
              Hear from families whose lives have been touched by our community
              of warriors
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {chunks.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-2"
              >
                {pair.map((story, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Image */}
                    <div className="relative">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                      <Quote className="absolute bottom-4 right-4 w-10 h-10 text-white opacity-90" />
                    </div>

                    {/* Right: Card */}
                    <div
                      className={`flex flex-col h-full p-8 ${
                        (i + pairIndex * 2) % 2 === 0
                          ? "bg-[#002329] text-white"
                          : "bg-[#EDF1D3]"
                      }`}
                    >
                      {/* Stars at top */}
                      <div className="flex mb-6 gap-x-4">
                        {Array(5)
                          .fill(0)
                          .map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-8 h-8 ${
                                (i + pairIndex * 2) % 2 === 0
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                      </div>

                      {/* Quote in true center */}
                      <div className="flex flex-1 items-center justify-center">
                        <p
                          className={`text-center text-[15px] font-medium leading-relaxed ${
                            (i + pairIndex * 2) % 2 === 0
                              ? "text-[#EDF1D3]"
                              : "text-black"
                          }`}
                        >
                          &quot;{story.quote}&quot;
                        </p>
                      </div>

                      {/* Name + Role at bottom */}
                      <div>
                        <p
                          className={`font-medium text-lg ${
                            (i + pairIndex * 2) % 2 === 0
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {story.name}
                        </p>
                        <p className="text-[16px] opacity-80">{story.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
