"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Star } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { Review } from "./productDetails";

interface ReviewCardProps {
  name: string;
  avatarUrl: string;
  rating: number;
  review: string;
  timestamp: string;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  avatarUrl,
  rating,
  review,
  timestamp,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-md border bg-white p-4 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-2">
        <Avatar className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] mx-auto sm:mx-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-[24px] sm:text-[32px] font-medium text-black">
              {name}
            </h3>
            <span className="text-[14px] sm:text-[18px] font-normal text-[#1F1F1F] sm:absolute sm:right-4">
              {timestamp}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[20px] sm:text-[24px] mt-1">
            <span className="mr-4">({rating.toFixed(1)})</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(rating) ? "text-[#EE9254]" : "text-gray-300"
                )}
                fill={i < Math.round(rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-base sm:text-lg  text-[#1F1F1F] leading-relaxed">
        {review}
      </p>
    </div>
  );
};

export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="w-full ">
        <h2 className="text-[36px] sm:text-[48px] md:text-[62px] font-normal text-[#1F1F1F]">
          Ratings & Reviews (0)
        </h2>
        <p className="text-[16px] sm:text-[20px] text-[#1F1F1FB2]   mt-1">
          No reviews yet — be the first to share your thoughts!
        </p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-[36px] sm:text-[48px] md:text-[62px] font-normal text-[#1F1F1F]">
        Ratings & Reviews ({reviews.length})
      </h2>
      <p className="text-[16px] sm:text-[20px] text-[#1F1F1FB2]   mt-1">
        All the authentic reviews by our trusted clients
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {reviews.map((r) => (
          <ReviewCard
            key={r.review.id}
            name={r.user.name}
            avatarUrl={r.user.profilePhoto}
            rating={r.review.score}
            review={r.review.review}
            timestamp={new Date(r.review.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          />
        ))}
      </div>
    </section>
  );
}
