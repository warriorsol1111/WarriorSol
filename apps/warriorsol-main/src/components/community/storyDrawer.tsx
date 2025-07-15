"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface StoryDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    title: "",
    story: "",
    image: null as File | null,
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    role: "",
    title: "",
    story: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSvg = file.type === "image/svg+xml" || file.name.endsWith(".svg");
    const isTooBig = file.size > 10 * 1024 * 1024;

    if (isSvg) {
      setFileError("SVG files are not allowed");
      setFormData((prev) => ({ ...prev, image: null }));
      toast.error("SVG files are not allowed");
      return;
    }

    if (isTooBig) {
      setFileError("File size must be under 10MB");
      setFormData((prev) => ({ ...prev, image: null }));
      toast.error("File size must be under 10MB");
      return;
    }

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          setFileError("Video must be 1 minute or less");
          setFormData((prev) => ({ ...prev, image: null }));
          toast.error("Video must be 1 minute or less");
        } else {
          setFileError("");
          setFormData((prev) => ({ ...prev, image: file }));
        }
      };
      video.onerror = () => {
        setFileError("Could not load video file");
        setFormData((prev) => ({ ...prev, image: null }));
        toast.error("Could not load video file");
      };
      video.src = URL.createObjectURL(file);
    } else {
      setFileError("");
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setFileError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: "", role: "", title: "", story: "", image: "" };
    let hasError = false;

    if (!isAnonymous && !formData.name.trim()) {
      newErrors.name = "Name is required unless sharing as anonymous.";
      hasError = true;
    }
    if (!formData.role) {
      newErrors.role = "Role is required.";
      hasError = true;
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      hasError = true;
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be 255 characters or less.";
      hasError = true;
    }
    if (!formData.story.trim()) {
      newErrors.story = "Story is required.";
      hasError = true;
    }
    if (!formData.image) {
      newErrors.image = "Please upload an image or video.";
      hasError = true;
    }
    if (fileError) {
      newErrors.image = fileError;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);
    const form = new FormData();
    if (formData.image) form.append("attachment", formData.image);
    form.append("title", formData.title);
    form.append("userName", isAnonymous ? "Anonymous" : formData.name);
    form.append("description", formData.story);
    form.append("userType", formData.role);
    form.append("isAnonymous", isAnonymous ? "True" : "False");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: form,
        }
      );

      if (!response.ok) throw new Error("Failed to submit story");

      toast.success("Your story has been submitted for review!");
      setFormData({
        name: "",
        role: "",
        title: "",
        story: "",
        image: null,
      });
      setIsAnonymous(false);
      setErrors({ name: "", role: "", title: "", story: "", image: "" });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full p-2">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-2xl font-light">
              Share Your Story
            </DrawerTitle>
            <DrawerClose className="p-2">
              <IoClose size={24} />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Your Name{!isAnonymous && "*"}</Label>
              <Input
                id="name"
                required={!isAnonymous}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Martin Mallet"
                className="mt-2"
                disabled={isAnonymous}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role">You Are*</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, role: value }));
                  setErrors((prev) => ({ ...prev, role: "" }));
                }}
                required
              >
                <SelectTrigger className="mt-2 w-full border border-gray-300 h-12 cursor-pointer">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "warrior", label: "The Warrior" },
                    { value: "spouse", label: "The Lock - Spouse/Partner" },
                    {
                      value: "bloodline",
                      label: "The Bloodline - Son, Daughter or Sibling",
                    },
                    { value: "caregiver", label: "The Backbone - Caregiver" },
                    { value: "guardian", label: "The Guardian" },
                    {
                      value: "griever",
                      label: "The Galvanzied Heart - Griever",
                    },
                    { value: "supporter", label: "The Ally - Supporter" },
                  ].map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title Of The Story*</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="This Hoodie Wrapped Me In Warmth When The World Felt Cold"
                maxLength={255}
                className="mt-2"
              />
              <span className="text-sm text-gray-500 float-right">
                {formData.title.length}/255
              </span>
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="story">Tell Us Your Story*</Label>
              <textarea
                id="story"
                required
                value={formData.story}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, story: e.target.value }))
                }
                placeholder="This Hoodie Wrapped Me In Warmth When The World Felt Cold. Now It Reminds Me I'm Stronger Than I Knew."
                className="flex min-h-[150px] w-full rounded-md border bg-white px-4 py-2 text-base shadow-sm transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 mt-2"
                maxLength={1800}
              />
              <span className="text-sm text-gray-500 float-right">
                {formData.story.length}/1800
              </span>
              {errors.story && (
                <p className="text-xs text-red-500 mt-1">{errors.story}</p>
              )}
            </div>

            <div>
              <Label htmlFor="image">Share Image/Video*</Label>
              <div className="mt-2 flex justify-center items-center flex-col border border-dashed border-gray-400 rounded-lg px-6 py-10 text-center">
                {formData.image && !fileError ? (
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-sm text-green-600 font-medium truncate max-w-[200px]">
                      {formData.image.name}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <label
                      htmlFor="image"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-md hover:bg-blue-200 transition-all"
                    >
                      Upload a file
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/png,image/jpeg,image/jpg,image/gif,video/mp4,video/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF, or MP4 only. Max size:{" "}
                      <strong>10MB</strong>.<br />
                      Max video duration: <strong>1 minute</strong>.
                    </p>
                  </>
                )}
                {(fileError || errors.image) && (
                  <p className="text-xs text-red-500 mt-2">
                    {fileError || errors.image}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isAnonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <Label htmlFor="isAnonymous" className="cursor-pointer">
                Share as Anonymous
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#EE9254] hover:bg-[#EE9254]/90 text-white flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                </span>
              ) : (
                "Share Story"
              )}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
