"use client";
import React, { useState } from "react";
import Image from "next/image";
import newsLetterImage from "@/assets/newsletter.png";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { GoArrowDownRight } from "react-icons/go";

const RebellionNewsletter = () => {
  const [email, setEmail] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const addEmailToNewsLetter = async () => {
    setNotifyLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/newsletter-mails/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.message === "Email already exists") {
        toast.dismiss();
        toast.error("Email already exists in the waitlist");
        setEmail("");
        setNotifyLoading(false);
        return;
      }
      toast.dismiss();
      toast.success("Email added to waitlist");
      setEmail("");
      setNotifyLoading(false);
    } catch (error) {
      console.error("Error adding email to waitlist:", error);
      toast.dismiss();
      toast.error("Failed to add email to waitlist");
      setNotifyLoading(false);
    }
  };

  return (
    <section className="w-full">
      {/* Top Quote Section */}
      <div className="bg-[#EFF7DC] py-8 md:py-12 !h-[365px] text-center">
        <h2 className="text-[28px] md:text-[52px] font-normal max-w-5xl mx-auto px-4">
          &ldquo;The Brand That Hugs You When You Need It Most.&rdquo;
        </h2>
        <p className="text-[14px] md:text-[20px] font-light mt-2">
          Featured In Leading Publications And Partnered With Top Organizations
        </p>
      </div>

      {/* Content Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between gap-20">
            <div className="flex flex-col gap-32">
              <h2 className="text-[52px] max-w-2xl text-[#002329] font-medium">
                Every Sunrise is a Stand Join the Rebellion.
              </h2>
              <p className="text-lg font-medium max-w-md">
                Get stories of strength, exclusive releases, and updates from
                the warrior community. No spam, just soul.
              </p>
            </div>
            <div className="gap-2 flex flex-row">
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={addEmailToNewsLetter}
                disabled={notifyLoading}
                size="lg"
                className="bg-[#C1E965] rounded-full !w-[160px] hover:bg-[#b3e06d] !h-[55px] text-[#023729] text-[18px] font-medium"
              >
                {notifyLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-between items-end">
            {/* Left: Arrow */}
            <GoArrowDownRight className="w-8 h-8 text-[#002329]" />

            {/* Right: Image */}
            <Image
              src={newsLetterImage}
              alt="Newsletter Image"
              className="w-[700px] h-[300px] object-cover rounded-xl"
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export default RebellionNewsletter;
