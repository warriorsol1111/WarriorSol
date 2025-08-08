"use client";
import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import userImage from "@/assets/user.svg";
import { Button } from "../ui/button";

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
      "We felt seen, heard, and supported. I'll never forget the warmth they brought into our lives.",
    authorName: "Liam J.",
    authorRole: "Single father",
    authorImage: userImage,
  },
];

export default function StoriesOfHope() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

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

  const infiniteReviews = Array.from(
    { length: reviews.length * 50 },
    (_, index) => ({
      ...reviews[index % reviews.length],
      id: index,
    })
  );

  const initialIndex = reviews.length * 25;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12">
      <div className="mx-auto">
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
            className="flex transition-transform duration-700 ease-in-out gap-6"
            style={{
              transform: `translateX(-${(100 / cardsPerView) * currentIndex}%)`,
            }}
          >
            {infiniteReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex % reviews.length === index
                    ? "bg-gray-800 scale-125"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
