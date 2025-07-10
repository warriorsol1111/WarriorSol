"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  id: string;
  title: string;
  author: {
    name: string;
    role: string;
  };
  background: string;
  link: string;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  author,
  background,
  className,
}) => {
  const isVideo = background.endsWith(".mp4");

  return (
    <div
      className={cn(
        "relative w-full text-white overflow-hidden rounded-2xl shadow-xl",
        className
      )}
    >
      {/* Background */}
      {isVideo ? (
        <video
          className="w-full h-[100vh] object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={background} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          src={background}
          alt="Background"
          width={1000}
          height={1000}
          className="object-cover brightness-[0.1] shadow-2xl w-full h-[100vh]"
          priority
        />
      )}

      {/* Quote */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <p className="text-2xl md:text-4xl font-serif max-w-7xl leading-relaxed font-bold">
          &ldquo;{title}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 text-base">
        <p className="font-bold">{author.name}</p>
        <p className="opacity-80 font-medium">{author.role}</p>
      </div>

      {/* Button */}
      <Link
        href={`/community/${id}`}
        className="absolute bottom-6 right-6 px-5 py-2.5 text-base font-medium bg-[#EE9254] text-white border border-[#EE9254] rounded-lg hover:bg-[#EE9254] transition"
      >
        Read Story →
      </Link>
    </div>
  );
};
