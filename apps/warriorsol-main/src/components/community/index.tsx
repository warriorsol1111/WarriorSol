"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "./storyCard";
import { StoryDrawer } from "./storyDrawer";
import { SocialLinks } from "../shared/socialLinks";
import { MdArrowOutward } from "react-icons/md";
import { useSession } from "next-auth/react";

interface Story {
  story: {
    id: string;
    title: string;
    description: string;
    userName: string;
    userType: string;
    attachment?: string;
    isAnonymous: boolean;
  };
  user: {
    name: string;
    profilePhoto: string | null;
  };
}

const Community: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserStories = async () => {
      setLoading(true);
      setError(false);
      try {
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
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, [session]);

  return (
    <>
      <section>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[62px] leading-tight lg:leading-[62px]  text-[#1F1F1F] capitalize">
              Why I Wear Mine
            </h2>
            <p className="text-base sm:text-lg lg:text-[20px]   text-[#1F1F1FB2] capitalize mt-2 sm:mt-2">
              Real stories from real warriors in our community
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto mt-4 border h-13 border-black text-[#1F1F1F] px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px]  capitalize flex items-center gap-2 transition"
          >
            Share Your Story <MdArrowOutward className="w-6 h-6" />
          </Button>
        </div>

        {/* Story List */}
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="animate-spin h-10 w-10 border-4 border-[#EE9254] border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <p className="text-center text-lg text-red-500">
              Failed to load stories. Please reload the page to see if the issue
              persists.
            </p>
          ) : stories.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl font-medium">No stories found 💬</p>
              <p className="text-sm mt-1">
                Be the first to share your journey ✨
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-14">
              {stories.map(({ story, user }) => (
                <StoryCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  background={story.attachment || "/default-story-bg.jpg"}
                  link={`/community/${story.id}`}
                  author={{
                    name: story.isAnonymous ? "Anonymous" : user.name,
                    role: story.userType,
                    avatar: story.isAnonymous ? null : user.profilePhoto,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <StoryDrawer isOpen={isOpen} onOpenChange={setIsOpen} />
      </section>

      <SocialLinks />
    </>
  );
};

export default Community;
