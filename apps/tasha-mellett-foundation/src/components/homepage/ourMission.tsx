"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import Story1 from "../../assets/story1.svg";
import Story2 from "../../assets/story2.svg";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BiDonateHeart } from "react-icons/bi";
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
  const router = useRouter();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const chunks = chunkStories(stories, isMobile ? 1 : 2);

  return (
    <>
      <section className="w-full py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight md:leading-[62px]  font-semibold text-[#1F1F1F] mb-3 md:mb-4">
            Meet Our Partners
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] font-medium text-[#1F1F1F]/70 mx-auto max-w-[40%]">
            From Grassroot non profit to indivisual advocates, our partners are
            united by one thing: providing direct support for people fighting
            cancer
          </p>
        </div>
        <div></div>

        {/* Carousel */}
        <div className="relative overflow-hidden mt-[-30px]">
          <div className="flex transition-transform duration-700 ease-in-out">
            {chunks.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-2"
              >
                {pair.map((story, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 border border-gray-100"
                  >
                    {/* Left: Image */}
                    <div className="relative">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                      <Quote className="absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10 text-white opacity-90" />
                    </div>

                    {/* Right: Card */}
                    <div
                      className={`flex flex-col h-full p-6 sm:p-8 ${
                        (i + pairIndex * 2) % 2 === 0
                          ? "bg-[#002329] text-white"
                          : "bg-[#EDF1D3]"
                      }`}
                    >
                      {/* Stars at top */}
                      <div className="flex mb-4 sm:mb-6 gap-x-2 sm:gap-x-4">
                        {Array(5)
                          .fill(0)
                          .map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-5 h-5 sm:w-8 sm:h-8 ${
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
                          className={`text-center text-sm sm:text-base md:text-[15px] font-medium leading-relaxed ${
                            (i + pairIndex * 2) % 2 === 0
                              ? "text-[#EDF1D3]"
                              : "text-black"
                          }`}
                        >
                          &quot;{story.quote}&quot;
                        </p>
                      </div>

                      {/* Name + Role at bottom */}
                      <div className="mt-4">
                        <p
                          className={`font-medium text-base sm:text-lg ${
                            (i + pairIndex * 2) % 2 === 0
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {story.name}
                        </p>
                        <p className="text-sm sm:text-[16px] opacity-80">
                          {story.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              size="default"
              className="inline-flex items-center space-x-2 border  bg-[#CDED84] !rounded-full hover:bg-[#CDED84]  text-[clamp(1rem,2.2vw,1.375rem)] font-medium px-8 sm:px-12 whitespace-nowrap !lg:px-20 py-2.5 sm:py-3 text-black hover:text-black transition-all duration-300 group"
              onClick={() => router.push("/donations")}
            >
              Donate Now <BiDonateHeart className="!w-5 !h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      <div className="bg-[#90AF83]">
        <div className="container mx-auto md:px-20 py-10 lg:py-10">
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            Let us help you be seen, heard, and supported
          </h1>
        </div>
      </div>
    </>
  );
}
