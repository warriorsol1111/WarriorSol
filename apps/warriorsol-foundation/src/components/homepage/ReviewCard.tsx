import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
}

export default function ReviewCard({
  quote,
  authorName,
  authorRole,
  authorImage,
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm h-[400px] flex flex-col">
      {/* Star Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} className="text-[#FFC107] w-6 h-6" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-4 flex-grow">
        <p className="text-2xl font-semibold font-['Cormorant_SC'] text-[#1F1F1F]  line-clamp-6">
          &quot;{quote}&quot;
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="w-[51px] h-[51px] relative rounded-full overflow-hidden">
          <Image
            src={authorImage}
            alt={authorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-[#1F1F1F] text-[20px]">
            {authorName}
          </h4>
          <p className="text-[#1F1F1F] text-[16px] font-[Inter]">
            {authorRole}
          </p>
        </div>
      </div>
    </div>
  );
}
