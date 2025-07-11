"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import toast from "react-hot-toast";
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
}

const AdminStoriesPage: React.FC = () => {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchStories = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );

        const data = await res.json();

        if (data.status === "success") {
          setStories(
            data.data.filter((story: Story) => story.status === "pending")
          );
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [session]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (res.ok) {
        setStories((prev) => prev.filter((story) => story.id !== id));
        toast.success(
          action === "approve"
            ? "Story approved successfully!"
            : "Story rejected successfully!"
        );
      } else {
        toast.error(
          action === "approve"
            ? "Failed to approve story"
            : "Failed to reject story"
        );
      }
    } catch {
      toast.error("Action failed. Try again later.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#EE9254] text-center sm:text-left">
          Pending User Stories
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin h-10 w-10 border-4 border-[#EE9254] border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <p className="text-center text-lg text-red-500">
            Failed to load stories. Please try again later.
          </p>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl sm:text-2xl md:text-3xl font-medium">
              No stories available to review yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow"
              >
                {/* Story Details */}
                <div className="flex-1 w-full">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1">
                    {story.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-2">
                    {story.description}
                  </p>

                  <div className="text-xs sm:text-sm md:text-base text-gray-500 mb-2 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                    <span>
                      User: {story.userName} ({story.userType})
                    </span>
                    <span>
                      Submitted: {new Date(story.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {story.attachment && (
                    <div className="mt-3 max-w-full">
                      {story.attachment.match(/\.(mp4|webm)$/) ? (
                        <video
                          src={story.attachment}
                          controls
                          className="w-full max-w-sm rounded"
                        />
                      ) : (
                        <Image
                          src={story.attachment}
                          alt="attachment"
                          className="w-full max-w-sm h-auto object-cover rounded"
                          width={1000}
                          height={1000}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:items-end w-full sm:w-auto gap-2">
                  <Button
                    className="bg-[#EE9254] text-white hover:bg-[#d67e43] w-full sm:w-auto text-base sm:text-lg md:text-xl"
                    disabled={actionLoading === story.id + "approve"}
                    onClick={() => handleAction(story.id, "approve")}
                  >
                    {actionLoading === story.id + "approve" ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      </>
                    ) : (
                      "Approve"
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full sm:w-full text-base sm:text-lg md:text-xl"
                    disabled={actionLoading === story.id + "reject"}
                    onClick={() => handleAction(story.id, "reject")}
                  >
                    {actionLoading === story.id + "reject" ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      </>
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default AdminStoriesPage;
