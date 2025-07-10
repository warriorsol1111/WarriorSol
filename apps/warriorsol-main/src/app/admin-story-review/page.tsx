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
            ? `Failed to approve story: `
            : `Failed to reject story:`
        );
      }
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <h1 className="text-3xl font-bold mb-6 text-[#EE9254]">
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
            <p className="text-xl font-medium">
              No stories available to review yet{" "}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white shadow"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{story.title}</h2>
                  <p className="text-sm text-gray-700 mb-2">
                    {story.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-1">
                    <span>
                      User: {story.userName} ({story.userType})
                    </span>
                    <span className="ml-2">
                      Submitted: {new Date(story.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {story.attachment && (
                    <div className="mt-2">
                      {story.attachment.match(/\.(mp4|webm)$/) ? (
                        <video
                          src={story.attachment}
                          controls
                          className="max-w-xs max-h-40 rounded"
                        />
                      ) : (
                        <Image
                          src={story.attachment}
                          alt="attachment"
                          className="max-w-xs max-h-40 rounded object-cover"
                          width={1000}
                          height={1000}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[120px]">
                  <Button
                    className="bg-[#EE9254] text-white hover:bg-[#d67e43]"
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
