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
    avatar: string;
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
  return (
    <div
      className={cn(
        "relative w-ful text-white overflow-hidden rounded-2xl shadow-xl",
        className
      )}
    >
      {/* Background */}
      <Image
        src={background}
        alt="Background "
        width={1000}
        height={1000}
        className="object-cover brightness-[0.1] shadow-2xl w-full h-[90vh]"
        priority
      />

      {/* Quote */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <p className="text-2xl md:text-4xl font-serif  max-w-7xl leading-relaxed font-bold">
          &ldquo;{title}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="text-base">
          <p className="font-bold">{author.name}</p>
          <p className="opacity-80 font-medium">{author.role}</p>
        </div>
      </div>

      {/* Button */}
      <Link
        href={`/community/${id}`}
        className="absolute bottom-6 right-6 px-5 py-2.5 text-base font-medium border border-white/40 rounded-lg hover:bg-white/10 transition"
      >
        Read Story →
      </Link>
    </div>
  );
};
