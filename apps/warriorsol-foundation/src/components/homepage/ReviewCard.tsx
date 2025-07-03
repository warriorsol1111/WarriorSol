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
          <FaStar key={index} className="text-[#EE9254] w-6 h-6" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-8 flex-grow">
        <p className="text-xl font-['Cormorant_SC'] leading-relaxed line-clamp-6">
          &quot;{quote}&quot;
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 relative rounded-full overflow-hidden">
          <Image
            src={authorImage}
            alt={authorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-lg">{authorName}</h4>
          <p className="text-gray-600">{authorRole}</p>
        </div>
      </div>
    </div>
  );
}
