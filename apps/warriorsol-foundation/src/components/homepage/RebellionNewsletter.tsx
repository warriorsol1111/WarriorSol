"use client";
import React, { useState } from "react";
import Image from "next/image";
import newsLetterImage from "@/assets/newsletter.png";
import { Button } from "../ui/button";
const RebellionNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log("Subscribe email:", email);
  };

  return (
    <section className="w-full">
      {/* Top Quote Section */}
      <div className="bg-[#FFEBCC] py-8 md:py-12 text-center">
        <h2 className='text-[28px] md:text-[42px] leading-tight font-["Cormorant_SC"] text-[#1F1F1F] max-w-3xl mx-auto px-4'>
          &ldquo;The Brand That Hugs You When You Need It Most.&rdquo;
        </h2>
        <p className='text-[14px] md:text-[16px] font-light font-["Inter"] text-[#EE9254] mt-2'>
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
          <h3 className='text-[32px] md:text-[40px] lg:text-[48px] font-["Cormorant_SC"] mb-2'>
            Every Sunrise Is A Stand
          </h3>
          <h4 className='text-[24px] md:text-[28px] lg:text-[32px] font-["Cormorant_SC"] mb-4 md:mb-6'>
            Join The Rebellion.
          </h4>
          <p className='font-["Inter"] text-[14px] md:text-[16px] font-light mb-6 md:mb-8 opacity-90 max-w-md px-4 md:px-0'>
            Get Stories Of Strength, Exclusive Releases, And Updates From The
            Warrior Community. No Spam, Just Soul.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md px-4 md:px-0"
          >
            <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className='w-full bg-[rgba(255,255,255,0.1)] border-none px-4 py-3 font-["Inter"] placeholder:text-white/50 focus:outline-none'
              />
              <Button
                type="submit"
                size="lg"
                className='sm:absolute sm:right-0 sm:top-0 h-full bg-[#EE9254] text-white px-8 font-["Inter"] hover:bg-[#d89b89] transition'
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RebellionNewsletter;
