"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Story {
  story: {
    id: string;
    title: string;
    description: string;
    userName: string;
    userType: string;
    attachment?: string;
  };
  user: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
  }),
};

const WhyIWearMine: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const nextStory = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + stories.length) % stories.length);
  };

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserStories = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/approved`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setStories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStories();
  }, [session]);

  useEffect(() => {
    if (stories.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories]);

  const currentStory = stories[current];

  const isVideo = (url: string | undefined) =>
    url?.match(/\.(mp4|webm|ogg)$/i) !== null;
  if (!session) return null;

  return (
    <>
      {/* Header Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-0 mb-8 md:mb-12">
          <div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[46px] lg:text-[62px] leading-tight lg:leading-[62px]  font-normal text-[#1F1F1F] capitalize">
              WHY I WEAR MINE
            </h2>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-center md:text-start font-light  text-[#1F1F1F]/70 capitalize mt-2">
              Real Stories From Real Warriors In Our Community
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border border-black px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-[18px]  capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-black hover:text-white transition"
            onClick={() => (window.location.href = "/community")}
          >
            Read All Stories ↗
          </Button>
        </div>
      </section>

      {/* Carousel */}
      <section
        className={`relative w-full ${
          loading
            ? "h-[250px] sm:h-[300px]"
            : "h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]"
        } text-white overflow-hidden`}
      >
        {loading ? (
          <Loader2 className="animate-spin h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#EE9254] absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <>
            {stories.length === 0 ? (
              <div className="flex items-center justify-center h-full w-full text-gray-700 text-lg sm:text-xl md:text-2xl font-semibold px-4 text-center">
                No stories to display yet. Check back soon!
              </div>
            ) : (
              <AnimatePresence custom={direction} initial={false}>
                {currentStory && (
                  <motion.div
                    key={currentStory.story.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 w-full h-full"
                    style={{ position: "absolute" }}
                  >
                    {/* Background */}
                    {currentStory.story.attachment &&
                      (isVideo(currentStory.story.attachment) ? (
                        <video
                          src={currentStory.story.attachment}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={currentStory.story.attachment}
                          alt="Background"
                          fill
                          className="object-cover"
                        />
                      ))}

                    {/* Overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(31, 31, 31, 0.3), rgba(31, 31, 31, 0.5))",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                      <div className="text-center max-w-4xl mx-auto px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-1 sm:mb-2 md:mb-4">
                          &ldquo;
                        </div>
                        <p className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px]  leading-tight mb-4 sm:mb-6 md:mb-8">
                          {currentStory.story.title}
                        </p>
                        <Button
                          variant="default"
                          size="lg"
                          className="mt-2 sm:mt-4 text-white text-center items-center text-[14px] sm:text-[16px] md:text-[18px] bg-transparent border border-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-white hover:text-black transition-all duration-300"
                          onClick={() =>
                            (window.location.href = `/community/${currentStory.story.id}`)
                          }
                        >
                          Read Full Story ↗
                        </Button>
                      </div>

                      {/* Bottom Section - Responsive Layout */}
                      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-12 lg:right-12">
                        {/* Mobile Layout - Stacked */}
                        <div className="flex sm:hidden flex-col gap-3">
                          {/* Author Info - Mobile */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarImage
                                src={
                                  currentStory.user.profilePhoto ?? undefined
                                }
                                alt={currentStory.user.name}
                              />
                              <AvatarFallback className="text-xs sm:text-sm">
                                {currentStory.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base truncate">
                                {currentStory.story.userName}
                              </p>
                              <p className="text-xs sm:text-sm text-white/70 capitalize truncate">
                                {currentStory.story.userType}
                              </p>
                            </div>
                          </div>

                          {/* Navigation Buttons - Mobile Center */}
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              onClick={prevStory}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 bg-transparent flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 p-0"
                            >
                              <FaAngleLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={nextStory}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 bg-transparent flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 p-0"
                            >
                              <FaAngleRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Desktop Layout - Side by Side */}
                        <div className="hidden sm:flex justify-between items-center">
                          {/* Author Info - Desktop */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                            <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                              <AvatarImage
                                src={
                                  currentStory.user.profilePhoto ?? undefined
                                }
                                alt={currentStory.user.name}
                              />
                              <AvatarFallback className="text-sm md:text-base">
                                {currentStory.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-base md:text-lg truncate">
                                {currentStory.story.userName}
                              </p>
                              <p className="text-sm md:text-base text-white/70 capitalize truncate">
                                {currentStory.story.userType}
                              </p>
                            </div>
                          </div>

                          {/* Navigation Buttons - Desktop */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="lg"
                              onClick={prevStory}
                              className="w-10 h-10 md:w-12 md:h-12 border border-white/30 bg-transparent flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 p-0"
                            >
                              <FaAngleLeft className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                            <Button
                              size="lg"
                              onClick={nextStory}
                              className="w-10 h-10 md:w-12 md:h-12 border border-white/30 bg-transparent flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 p-0"
                            >
                              <FaAngleRight className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default WhyIWearMine;
