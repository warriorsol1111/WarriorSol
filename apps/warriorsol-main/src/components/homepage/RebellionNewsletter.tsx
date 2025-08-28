"use client";
import React, { useState } from "react";
import Image from "next/image";
import newsLetterImage from "@/assets/newsletter.png";
import { Button } from "../ui/button";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const RebellionNewsletter = () => {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);
  const [notifyLoading, setNotifyLoading] = useState(false);

  useEffect(() => {
    const fetchCountofMails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/newsletter-mails/count`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch mail count: ${response.status}`);
        }
        const data = await response.json();
        setCount(data.data || 0);
      } catch (error) {
        console.error("Error fetching mail count:", error);
        setCount(0);
      }
    };
    fetchCountofMails();
  }, []);

  const addEmailToNewsLetter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      setCount((prev) => prev + 1);
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
      <div className="bg-[#FFEBCC] py-8 md:py-12 text-center">
        <h2 className='text-[28px] md:text-[62px] leading-tight font-["Cormorant_SC"] text-[#842E12] max-w-6xl mx-auto px-4'>
          &ldquo;The Brand That Hugs You When You Need It Most.&rdquo;
        </h2>
        <p className='text-[14px] md:text-[20px] font-light font-["Inter"] text-[#EE9254] mt-2'>
          Featured In Leading Publications And Partnered With Top Organizations
        </p>
      </div>

      {/* Newsletter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[1000px]">
          <Image
            src={newsLetterImage}
            alt="People raising hands at sunset"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="bg-[#842E12] text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center items-center text-center">
          <h3 className='text-[32px] md:text-[52px]  font-["Cormorant_SC"] mb-2'>
            Every Sunrise Is A Stand
          </h3>
          <h4 className='text-[24px] md:text-[32px] text-[#FFEBCC] font-["Cormorant_SC"] mb-4 md:mb-6'>
            Join The Rebellion.
          </h4>
          <p className='font-["Inter"] text-[#FFFFFF99] text-[14px] md:text-[16px] font-light mb-6 md:mb-8 opacity-90 max-w-md px-4 md:px-0'>
            Get Stories Of Strength, Exclusive Releases, And Updates From The
            Warrior Community. No Spam, Just Soul.
          </p>

          <form
            onSubmit={addEmailToNewsLetter}
            className="w-full max-w-md px-4 md:px-0"
          >
            <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-x-4 lg:gap-x-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className='w-full bg-[#FFFFFF33] border-none px-4 py-3 font-["Inter"] placeholder:text-white/50 focus:outline-none'
                required
                disabled={notifyLoading}
              />
              <Button
                type="submit"
                size="lg"
                className='text-[20px] bg-[#EE9254] text-white px-8 font-["Inter"] hover:bg-[#d89b89] transition h-12'
                disabled={notifyLoading}
              >
                {notifyLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>

            <div className="mt-4 text-sm text-white/80">
              {count > 0
                ? `${count} people have already joined our newsletter!`
                : "Be the first to join our newsletter!"}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RebellionNewsletter;
