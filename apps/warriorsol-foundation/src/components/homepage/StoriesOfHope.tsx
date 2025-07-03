"use client";
import React, { useState } from "react";
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
    authorImage: userImage, // Replace with actual image path
  },
  {
    quote:
      "I Never Imagined We'd Need Help, But When We Did, The Foundation Was There With Open Arms. Their Compassion And Resources Made All The Difference.",
    authorName: "David L.",
    authorRole: "Father and caregiver",
    authorImage: userImage, // Replace with actual image path
  },
  {
    quote:
      "The Foundation Did More Than Provide Financial Support - They Showed Us We Weren't Alone In Our Journey.",
    authorName: "Maria R.",
    authorRole: "Grandmother",
    authorImage: userImage, // Replace with actual image path
  },
];

export default function StoriesOfHope() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= reviews.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 3 : prevIndex - 1
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 ">
      <div className="">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-[62px] font-['Cormorant_SC'] font-normal ">
              Stories Of Hope
            </h2>
            <p className="text-[20px] font-light text-gray-600">
              Hear From Families Whose Lives Have Been Touched By Our Community
              Of Warriors
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={prevSlide}
              variant="outline"
              className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous review"
            >
              <IoIosArrowBack className="w-6 h-6 text-gray-600" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next review"
            >
              <IoIosArrowForward className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Reviews */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="w-1/3 flex-shrink-0">
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
