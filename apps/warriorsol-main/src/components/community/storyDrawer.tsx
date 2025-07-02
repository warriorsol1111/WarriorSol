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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full p-2">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-2xl font-light ">
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
              <Label htmlFor="name">Your Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Martin Mallet"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="role">You Are*</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                required
              >
                <SelectTrigger className="mt-2 w-full border border-gray-300 !h-12 cursor-pointer">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="warrior"
                  >
                    The Warrior
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="spouse"
                  >
                    The Lock - Spouse/Partner
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="bloodline"
                  >
                    The Bloodline - Son, Daughter or Sibling
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="caregiver"
                  >
                    The Backbone - Caregiver
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="guardian"
                  >
                    The Guardian
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="griever"
                  >
                    The Galvanzied Heart - Griever
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:!bg-gray-200"
                    value="supporter"
                  >
                    The Ally - Supporter
                  </SelectItem>
                </SelectContent>
              </Select>
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
                maxLength={50}
                className="mt-2"
              />
              <span className="text-sm text-gray-500 float-right">
                {formData.title.length}/50
              </span>
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
            </div>

            <div>
              <Label htmlFor="image">Share Image/Video*</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#EE9254] hover:bg-[#EE9254]/90 text-white"
            >
              Share Story
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
