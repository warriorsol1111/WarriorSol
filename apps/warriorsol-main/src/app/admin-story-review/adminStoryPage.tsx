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
        toast.dismiss();
        toast.success(
          action === "approve"
            ? "Story approved successfully!"
            : "Story rejected successfully!"
        );
      } else {
        toast.dismiss();
        toast.error(
          action === "approve"
            ? "Failed to approve story"
            : "Failed to reject story"
        );
      }
    } catch {
      toast.dismiss();
      toast.error("Action failed. Try again later.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-10 sm:py-14 lg:py-20 bg-gray-50 min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 text-[#EE9254] text-center">
          Review User Stories
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin h-12 w-12 border-4 border-[#EE9254] border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <p className="text-center text-lg text-red-500">
            Failed to load stories. Please try again later.
          </p>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-2xl font-medium">
              No stories available to review yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {stories.map((story) => (
              <div
                key={story.id}
                className="border rounded-2xl p-6 flex flex-col justify-between bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Story Details */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                    {story.title}
                  </h2>

                  {/* Scrollable description */}
                  <div className="max-h-28 overflow-y-auto pr-2 mb-3 text-gray-700 text-sm sm:text-base leading-relaxed custom-scrollbar">
                    {story.description}
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 mb-3 space-y-1">
                    <p>
                      <span className="font-medium">User:</span>{" "}
                      {story.userName} ({story.userType})
                    </p>
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(story.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {story.attachment && (
                    <div className="mt-4">
                      {story.attachment.match(/\.(mp4|webm)$/) ? (
                        <video
                          src={story.attachment}
                          controls
                          className="w-full max-h-64 rounded-lg shadow-sm"
                        />
                      ) : (
                        <Image
                          src={story.attachment}
                          alt="attachment"
                          className="w-full max-h-64 object-contain rounded-lg shadow-sm"
                          width={1000}
                          height={1000}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <Button
                    className="bg-[#EE9254] text-white hover:bg-[#d67e43] text-base sm:text-lg md:text-xl rounded-xl px-6 py-2"
                    disabled={actionLoading === story.id + "approve"}
                    onClick={() => handleAction(story.id, "approve")}
                  >
                    {actionLoading === story.id + "approve" ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      "Approve"
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    className="text-base sm:text-lg md:text-xl rounded-xl px-6 py-2"
                    disabled={actionLoading === story.id + "reject"}
                    onClick={() => handleAction(story.id, "reject")}
                  >
                    {actionLoading === story.id + "reject" ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
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
