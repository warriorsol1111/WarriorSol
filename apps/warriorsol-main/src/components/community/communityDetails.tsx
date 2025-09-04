"use client";
import React, { useState } from "react";
import Image from "next/image";
import RecommendedProducts from "./recommendedProducts";
import { SocialLinks } from "../shared/socialLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const { data: session } = useSession();
  const [loadingAction, setLoadingAction] = useState(false);
  const router = useRouter();

  if (!story) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Story not found</h1>
          <p className="text-gray-600 mt-2">
            The requested story could not be loaded.
          </p>
        </div>
      </section>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      setLoadingAction(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Story deleted successfully!");
      } else {
        toast.error("Failed to delete story");
      }
    } catch {
      toast.error("Failed to delete story");
    } finally {
      setLoadingAction(false);
      router.push("/community");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setLoadingAction(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/${id}/archive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Story archived successfully!");
      } else {
        toast.error("Failed to archive story");
      }
    } catch {
      toast.error("Failed to archive story");
    } finally {
      setLoadingAction(false);
      router.push("/community");
    }
  };

  const isVideo = story?.attachment?.includes(".mp4");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative">
        {/* Header section */}
        <div className="text-center mb-8 pt-10">
          <h1 className="text-[42px] sm:text-[62px] text-[#1F1F1F]  font-semibold">
            {story.title}
          </h1>
          <p className="text-[20px]  text-[#1F1F1F99] font-[Inter] mt-2">
            Published on {new Date(story.createdAt).toDateString()}
          </p>
        </div>
        {/* Admin controls */}
        {session?.user?.role === "admin" && (
          <div className="flex justify-center items-center gap-6 mt-8">
            {/* Archive button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-[20px] font-[Inter] h-13 cursor-pointer border border-black font-semibold hover:scale-105 transition"
                >
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[20px] font-[Inter]">
                    Archive this story?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[18px] font-[Inter]">
                    This will move the story into the archive. You can unarchive
                    it later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer text-[20px] font-[Inter] h-13">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer text-[20px] font-[Inter] h-13 bg-[#EE9254] hover:bg-[#EE9254]"
                    onClick={() => handleArchive(story.id)}
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="px-8 py-4 text-[20px] font-[Inter] h-13 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold hover:scale-105 transition"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[20px] font-[Inter]">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[18px] font-[Inter]">
                    This action <span className="font-bold">cannot</span> be
                    undone. The story will be permanently deleted from our
                    servers. Take a deep breath before you proceed!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer text-[20px] font-[Inter] h-13">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer text-[20px] font-[Inter] h-13 bg-red-500 hover:bg-red-600 text-white font-semibold hover:scale-105 transition"
                    onClick={() => handleDelete(story.id)}
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Yes, Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Media */}
        {story.attachment && (
          <div className="relative w-full h-screen mx-auto mt-10 rounded-lg overflow-hidden shadow-md">
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

        {/* Description */}
        <div className="flex justify-center items-center mt-10">
          <p className="text-[24px] text-[#1F1F1F] font-[Inter]  text-center mx-auto whitespace-pre-line max-w-4xl">
            {story.description}
          </p>
        </div>

        {/* Author */}
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col gap-4 items-center">
            <Avatar className="w-[160px] h-[160px] shadow-lg">
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
              <p className="text-[#1F1F1F] text-[36px] font-semibold">
                {story.isAnonymous ? "Anonymous" : story.userName}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-[18px] text-[#1F1F1F] font-[Inter]  capitalize">
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
