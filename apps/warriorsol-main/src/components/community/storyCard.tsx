"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdArrowOutward } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";

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

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={cn(
        "relative w-full text-white overflow-hidden shadow-xl",
        className
      )}
    >
      {/* Background */}
      {isVideo ? (
        <video
          className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh] object-cover"
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
          className="object-cover  w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh]"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Quote - Responsive Text and Positioning */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 text-center">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[42px]  max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl leading-relaxed font-semibold">
          &ldquo;{title}&rdquo;
        </p>
      </div>

      {/* Mobile Layout - Stacked Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 sm:hidden">
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-4 space-y-3">
          {/* Author Info - Mobile */}
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-white flex-shrink-0">
              <AvatarImage src={author.avatar ?? undefined} alt={author.name} />
              <AvatarFallback className="text-xs">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-white min-w-0 flex-1">
              <p className=" text-base font-semibold leading-tight truncate">
                {author.name}
              </p>
              <p className="opacity-80 font-[Inter] font-medium text-sm truncate">
                {capitalize(author.role)}
              </p>
            </div>
          </div>

          {/* Read Story Button - Mobile Full Width */}
          <Link
            href={link}
            className="block w-full px-4 py-2.5 text-center text-[20px] font-medium text-white border border-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Read Story <MdArrowOutward className="w-6 h-6" />
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop Layout - Corner Positioned Content */}
      <div className="hidden sm:block">
        {/* Author - Bottom Left */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-2 sm:gap-3">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white flex-shrink-0">
            <AvatarImage src={author.avatar ?? undefined} alt={author.name} />
            <AvatarFallback className="text-xs sm:text-sm">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-white min-w-0">
            <p className=" text-lg sm:text-xl md:text-2xl font-semibold leading-none truncate max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
              {author.name}
            </p>
            <p className="opacity-80 font-[Inter] font-medium text-sm sm:text-base md:text-lg truncate">
              {capitalize(author.role)}
            </p>
          </div>
        </div>

        {/* Read Story Button - Bottom Right */}
        <Link
          href={link}
          className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-white border border-white transition-all duration-300 whitespace-nowrap"
        >
          <span className="flex items-center gap-2">
            Read Story <GoArrowUpRight className="inline text-xl" />
          </span>
        </Link>
      </div>
    </div>
  );
};
