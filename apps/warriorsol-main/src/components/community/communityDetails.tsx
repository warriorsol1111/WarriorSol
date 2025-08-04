import React from "react";
import Image from "next/image";
import RecommendedProducts from "./recommendedProducts";
import { SocialLinks } from "../shared/socialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  attachment?: string;
  userType: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

interface User {
  id: string;
  name: string;
  profilePhoto: string | null;
}

export const CommunityDetails = ({
  story,
  user,
}: {
  story: Story;
  user: User;
}) => {
  if (!story) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Story not found</h1>
          <p className="text-gray-600 mt-2">
            The requested story could not be loaded.
          </p>
        </div>
      </section>
    );
  }

  const isVideo = story?.attachment?.includes(".mp4");

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format status badge color

  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        {/* Header section with title and status */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-[42px] sm:text-[62px] font-semibold">
              {story.title}
            </h1>
          </div>
          <p className="text-xl font-light">
            Published on {new Date(story.createdAt).toDateString()}
          </p>
        </div>

        {/* Media section */}
        {story.attachment && (
          <div className="relative w-full h-screen mx-auto mt-10 rounded-lg overflow-hidden">
            {isVideo ? (
              <video
                className="object-cover w-full h-full rounded-lg"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src={story.attachment} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={story.attachment}
                alt="Story Media"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            )}
          </div>
        )}

        {/* Description section */}
        <div className="flex justify-center items-center mt-10">
          <p className="text-2xl font-light text-center mx-auto whitespace-pre-line max-w-4xl">
            {story.description}
          </p>
        </div>

        {/* Author section with avatar */}
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col gap-4 items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={
                  story.isAnonymous
                    ? undefined
                    : (user?.profilePhoto ?? undefined)
                }
                alt={story.userName}
              />
              <AvatarFallback className="bg-black text-white text-lg font-semibold">
                {story.isAnonymous ? "A" : getInitials(story.userName)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <p className="text-3xl font-medium">
                {story.isAnonymous ? "Anonymous" : story.userName}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-xl font-light capitalize">
                  {story.userType}
                </p>
                {story.isAnonymous && (
                  <Badge variant="outline" className="text-xs">
                    Anonymous
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <RecommendedProducts />
      </section>
      <SocialLinks />
    </>
  );
};
