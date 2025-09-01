"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [archivedStories, setArchivedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [view, setView] = useState<"pending" | "archived">("pending");

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setStories(data.data.filter((s: Story) => s.status === "pending"));
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchArchivedStories = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/archived`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setArchivedStories(data.data);
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.token) return;
    fetchArchivedStories();
  }, [session, fetchArchivedStories]);

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "unarchive" | "delete"
  ) => {
    setActionLoading(id + action);
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/${id}`;
    let method = "PUT";

    if (action === "approve" || action === "reject") {
      url += `/${action}`;
    } else if (action === "unarchive") {
      url += `/unarchive`;
    } else if (action === "delete") {
      method = "DELETE";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (res.ok) {
        if (action === "approve" || action === "reject") {
          setStories((prev) => prev.filter((s) => s.id !== id));
        } else {
          setArchivedStories((prev) => prev.filter((s) => s.id !== id));
        }

        toast.success(
          {
            approve: "Story approved successfully!",
            reject: "Story rejected successfully!",
            unarchive: "Story unarchived successfully!",
            delete: "Story deleted successfully!",
          }[action]
        );
      } else {
        toast.error(
          {
            approve: "Failed to approve story",
            reject: "Failed to reject story",
            unarchive: "Failed to unarchive story",
            delete: "Failed to delete story",
          }[action]
        );
      }
    } catch {
      toast.error("Action failed. Try again later.");
    } finally {
      setActionLoading(null);
    }
  };

  const storiesToShow = view === "pending" ? stories : archivedStories;

  useEffect(() => {
    if (view === "archived" && archivedStories.length === 0) {
      fetchArchivedStories();
    }
    if (view === "pending" && stories.length === 0) {
      fetchStories();
    }
  }, [
    view,
    archivedStories.length,
    fetchArchivedStories,
    stories.length,
    fetchStories,
  ]);

  return (
    <>
      <Navbar />

      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-10 sm:py-14 lg:py-20 bg-gray-50 min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-[62px] font-extrabold mb-10 text-[#EE9254] text-center">
          Review User Stories
        </h1>

        {/* Toggle Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <Button
            variant={view === "pending" ? "default" : "outline"}
            onClick={() => setView("pending")}
            className={`px-6 cursor-pointer py-2 h-13 text-[20px] font-[Inter] ${view === "pending" ? "bg-[#EE9254] hover:bg-[#EE9254]" : ""}`}
          >
            Pending
          </Button>
          <Button
            variant={view === "archived" ? "default" : "outline"}
            onClick={() => setView("archived")}
            className={`px-6 cursor-pointer py-2 h-13 text-[20px] font-[Inter] ${view === "archived" ? "bg-[#EE9254] hover:bg-[#EE9254]" : ""}`}
          >
            Archived
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin h-12 w-12 border-4 border-[#EE9254] border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <p className="text-center text-lg text-red-500">
            Failed to load stories. Please try again later.
          </p>
        ) : storiesToShow.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-2xl font-medium">
              {view === "pending"
                ? "No stories available to review yet."
                : "No archived stories available."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {storiesToShow.map((story) => (
              <div
                key={story.id}
                className="border rounded-2xl p-6 flex flex-col justify-between bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Story Details */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                    {story.title}
                  </h2>

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

                {/* Action Buttons with Confirmation */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                  {view === "pending" ? (
                    <>
                      {/* Approve */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="bg-[#EE9254] cursor-pointer text-white hover:bg-[#d67e43] text-base sm:text-lg md:text-xl px-6 rounded-none py-2 h-13 font-[Inter]"
                            disabled={actionLoading === story.id + "approve"}
                          >
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[20px] font-[Inter]">
                              Approve this story?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[20px] font-[Inter]">
                              This will mark the story as approved and make it
                              visible. You can’t undo this easily.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-[20px] font-[Inter] cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAction(story.id, "approve")}
                              disabled={actionLoading === story.id + "approve"}
                              className="text-[20px] cursor-pointer bg-[#EE9254] hover:bg-[#d67e43] text-white px-6 rounded-none py-2 font-[Inter]"
                            >
                              {actionLoading === story.id + "approve" ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Confirm"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Reject */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="cursor-pointer text-base sm:text-lg md:text-xl px-6 rounded-none py-2 h-13 font-[Inter]"
                            disabled={actionLoading === story.id + "reject"}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[20px] font-[Inter]">
                              Reject this story?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[20px] font-[Inter]">
                              This will remove the story from pending. The user
                              will know their story wasn’t approved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-[20px] font-[Inter] cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAction(story.id, "reject")}
                              disabled={actionLoading === story.id + "reject"}
                              className="bg-red-500 hover:bg-red-600 cursor-pointer text-[20px] font-[Inter]  "
                            >
                              {actionLoading === story.id + "reject" ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Confirm Reject"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      {/* Unarchive */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="cursor-pointer bg-[#4CAF50] text-white hover:bg-[#43a047] text-base sm:text-lg md:text-xl px-6 rounded-none py-2 h-13 font-[Inter]"
                            disabled={actionLoading === story.id + "unarchive"}
                          >
                            Unarchive
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[20px] font-[Inter]">
                              Unarchive this story?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[20px] font-[Inter]">
                              This will move the story back into pending review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-[20px] font-[Inter] cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleAction(story.id, "unarchive")
                              }
                              className="text-[20px] cursor-pointer bg-[#EE9254] hover:bg-[#d67e43] text-white px-6 rounded-none py-2  font-[Inter]"
                              disabled={
                                actionLoading === story.id + "unarchive"
                              }
                            >
                              {actionLoading === story.id + "unarchive" ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Confirm"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="cursor-pointer text-base sm:text-lg md:text-xl px-6 rounded-none py-2 h-13 font-[Inter]"
                            disabled={actionLoading === story.id + "delete"}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action{" "}
                              <span className="font-bold">cannot</span> be
                              undone. The story will be permanently deleted from
                              our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-[20px] font-[Inter] cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAction(story.id, "delete")}
                              disabled={actionLoading === story.id + "delete"}
                              className="bg-red-500 hover:bg-red-600 cursor-pointer text-[20px] font-[Inter]"
                            >
                              {actionLoading === story.id + "delete" ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Yes, Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
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
