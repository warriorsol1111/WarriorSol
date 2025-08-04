"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryCardProps {
  id: string;
  title: string;
  author: {
    name: string;
    role: string;
    avatar?: string | null;
  };
  background: string;
  link: string;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  title,
  author,
  background,
  link,
  className,
}) => {
  const isVideo = background.endsWith(".mp4");

  // Utility: get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

      {/* Author */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <Avatar className="w-10 h-10 border border-white">
          <AvatarImage src={author.avatar ?? undefined} alt={author.name} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className="text-white">
          <p className="font-bold leading-none">{author.name}</p>
          <p className="opacity-80 font-medium text-sm">{author.role}</p>
        </div>
      </div>

      {/* Read Story Button */}
      <Link
        href={link}
        className="absolute bottom-6 right-6 px-5 py-2.5 text-base font-medium bg-[#EE9254] text-white border border-[#EE9254] rounded-lg hover:bg-[#EE9254]/90 transition"
      >
        Read Story →
      </Link>
    </div>
  );
};
