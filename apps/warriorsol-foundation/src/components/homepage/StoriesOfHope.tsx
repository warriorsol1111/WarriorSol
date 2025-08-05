"use client";
import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import userImage from "@/assets/user.svg";
import { Button } from "../ui/button";

// Sample data - in a real app, this would come from an API or CMS
const reviews = [
  {
    quote:
      "The Warrior Sol Foundation Came Into Our Lives When We Needed It Most. Their Support Helped Us Focus On What Truly Mattered - Being Together As A Family.",
    authorName: "Sarah M.",
    authorRole: "Mother of three",
    authorImage: userImage,
  },
  {
    quote:
      "I Never Imagined We'd Need Help, But When We Did, The Foundation Was There With Open Arms. Their Compassion And Resources Made All The Difference.",
    authorName: "David L.",
    authorRole: "Father and caregiver",
    authorImage: userImage,
  },
  {
    quote:
      "The Foundation Did More Than Provide Financial Support - They Showed Us We Weren't Alone In Our Journey.",
    authorName: "Maria R.",
    authorRole: "Grandmother",
    authorImage: userImage,
  },
  {
    quote:
      "We felt seen, heard, and supported. I’ll never forget the warmth they brought into our lives.",
    authorName: "Liam J.",
    authorRole: "Single father",
    authorImage: userImage,
  },
];

export default function StoriesOfHope() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  // Handle responsive behavior
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(3);
      } else if (width >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= reviews.length - cardsPerView ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - cardsPerView : prevIndex - 1
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12">
      <div className=" mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl sm:text-[62px] font-['Cormorant_SC'] font-normal leading-tight">
              Stories Of Hope
            </h2>
            <p className="text-xl whitespace-nowrap font-[Inter] text-[#1F1F1FB2] mt-2 max-w-md">
              Hear From Families Whose Lives Have Been Touched By Our Community
              Of Warriors
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={prevSlide}
              variant="outline"
              className="bg-white p-2 rounded-base shadow hover:bg-gray-50 transition border border-black"
              aria-label="Previous review"
            >
              <IoIosArrowBack className="w-6 h-6 text-gray-600" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              className="bg-white p-2 rounded-base shadow hover:bg-gray-50 transition border border-black"
              aria-label="Next review"
            >
              <IoIosArrowForward className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${(100 / cardsPerView) * currentIndex}%)`,
              width: `${(100 / cardsPerView) * reviews.length}%`,
            }}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="w-full"
                style={{ flex: `0 0 ${100 / reviews.length}%` }}
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
