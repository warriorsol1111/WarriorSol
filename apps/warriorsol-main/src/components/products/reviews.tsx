import { cn } from "@/lib/utils";
import React from "react";
import { Star } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";

interface ReviewCardProps {
  name: string;
  avatarUrl: string;
  rating: number;
  review: string;
  timestamp: string;
  className?: string;
}

const mockReviews = [
  {
    name: "Hayra Kul",
    avatarUrl: "/avatars/hayra.png",
    rating: 4.9,
    review:
      "Amazing service! Everything was seamless from start to finish. Highly recommended!",
    timestamp: "1 month ago",
  },
  {
    name: "Jamal Bhatti",
    avatarUrl: "/avatars/jamal.png",
    rating: 5.0,
    review:
      "Bro this was next-level. Super helpful team and my order arrived early. W?",
    timestamp: "2 weeks ago",
  },
  {
    name: "Lina Ahsan",
    avatarUrl: "/avatars/lina.png",
    rating: 2,
    review:
      "Loved the experience! A few minor issues but customer support was quick to resolve them.",
    timestamp: "3 weeks ago",
  },
  {
    name: "Tariq Sheikh",
    avatarUrl: "/avatars/tariq.png",
    rating: 4.8,
    review:
      "You guys deserve all the stars. I don’t usually leave reviews but this was worth it.",
    timestamp: "5 days ago",
  },
  {
    name: "Maya Noor",
    avatarUrl: "/avatars/maya.png",
    rating: 4.7,
    review:
      "The vibe, the quality, the delivery speed... *chef’s kiss*. Will def order again.",
    timestamp: "2 days ago",
  },
];

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
      <p className="mt-3 text-base sm:text-lg font-light text-[#1F1F1F] leading-relaxed">
        {review}
      </p>
    </div>
  );
};

export default function Reviews() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8">
      <h2 className="text-[36px] sm:text-[48px] md:text-[62px] font-normal text-[#1F1F1F]">
        Ratings & Reviews (520)
      </h2>
      <p className="text-[16px] sm:text-[20px] text-[#1F1F1FB2] font-light font-[Inter] mt-1">
        All the Authentic Reviews by our trusted clients
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {mockReviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            avatarUrl={review.avatarUrl}
            rating={review.rating}
            review={review.review}
            timestamp={review.timestamp}
          />
        ))}
      </div>
    </section>
  );
}
