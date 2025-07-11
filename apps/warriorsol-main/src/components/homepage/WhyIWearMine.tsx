"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Story {
  id: string;
  title: string;
  description: string;
  userName: string;
  userType: string;
  attachment?: string;
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

  return (
    <>
      {/* Header Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-0 mb-8 md:mb-12">
          <div>
            <h2 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
              WHY I WEAR MINE
            </h2>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-center md:text-start font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2">
              Real Stories From Real Warriors In Our Community
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border border-black px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px] font-['Inter'] capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-black hover:text-white transition"
          >
            Read All Stories ↗
          </Button>
        </div>
      </section>

      {/* Carousel */}
      <section
        className={`relative w-full ${loading ? "h-[300px]" : "h-[600px]"} text-white overflow-hidden`}
      >
        {loading ? (
          <Loader2 className="animate-spin h-12 w-12 text-[#EE9254] absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <>
            {stories.length === 0 ? (
              <div className="flex items-center justify-center h-full w-full  text-gray-700 text-2xl font-semibold">
                No stories to display yet. Check back soon!
              </div>
            ) : (
              <AnimatePresence custom={direction} initial={false}>
                {currentStory && (
                  <motion.div
                    key={currentStory.id}
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
                    {currentStory.attachment &&
                      (isVideo(currentStory.attachment) ? (
                        <video
                          src={currentStory.attachment}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={currentStory.attachment}
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
                      <div className="text-center max-w-4xl mx-auto px-4">
                        <div className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-2 sm:mb-4">
                          &ldquo;
                        </div>
                        <p className="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[42px] font-['Cormorant'] leading-tight">
                          {currentStory.title}
                        </p>
                        <Button
                          variant="default"
                          size="lg"
                          className="mt-4 text-white text-center items-center text-[16px] sm:text-[18px] bg-transparent border border-white"
                          onClick={() =>
                            (window.location.href = `/community/${currentStory.id}`)
                          }
                        >
                          Read Full Story ↗
                        </Button>
                      </div>

                      {/* Bottom */}
                      <div className="absolute bottom-6 ml-4 inset-x-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-base">
                            {currentStory.userName}
                          </p>
                          <p className="text-sm text-white/70 capitalize">
                            {currentStory.userType}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="lg"
                            onClick={prevStory}
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition"
                          >
                            <FaAngleLeft />
                          </Button>
                          <Button
                            size="lg"
                            onClick={nextStory}
                            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition"
                          >
                            <FaAngleRight />
                          </Button>
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
