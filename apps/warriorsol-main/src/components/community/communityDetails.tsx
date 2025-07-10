// components/community/communityDetails.tsx
import React from "react";
import Image from "next/image";
import RecommendedProducts from "./recommendedProducts";
import { SocialLinks } from "../shared/socialLinks";

interface Story {
  id: string;
  userName: string;
  title: string;
  description: string;
  attachment?: string;
  userType: string;
  createdAt: string;
}

export const CommunityDetails = ({ story }: { story: Story }) => {
  const isVideo = story.attachment?.endsWith(".mp4");

  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <h1 className="text-[42px] sm:text-[62px] text-center font-semibold">
          {story.title}
        </h1>
        <p className="text-xl font-light text-center">
          Published on {new Date(story.createdAt).toDateString()}
        </p>

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
              src={story.attachment || "/default-story-bg.jpg"}
              alt="Story Media"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          )}
        </div>

        <div className="flex justify-center items-center">
          <p className="text-2xl font-light text-center  mx-auto mt-10 whitespace-pre-line">
            {story.description}
          </p>
        </div>

        <div className="flex justify-center items-center mt-5">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-3xl font-medium text-center">{story.userName}</p>
            <p className="text-xl font-light text-center capitalize">
              {story.userType}
            </p>
          </div>
        </div>

        <RecommendedProducts />
      </section>
      <SocialLinks />
    </>
  );
};
