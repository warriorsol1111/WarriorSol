import React from "react";
import Image from "next/image";
import ChangeLife from "@/assets/changeLife.svg";
import { BiDonateHeart } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import DonationForm from "./DonationForm";

export default function Donations() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 lg:py-5">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] ">
        {/* Left Column - Donation & Volunteer Info */}
        <div className="bg-[#FFEBCC] p-8">
          {/* Donate Now Section */}
          <div className="mb-12">
            <div className="mb-4 flex flex-col items-start gap-3">
              <div className="ml-4 text-[#EE9254]">
                <BiDonateHeart className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-medium text-gray-900">Donate Now</h2>
            </div>
            <p className="text-lg font-['Inter'] max-w-[400px] font-light">
              Your Financial Contributions Can Make A Real Difference. Every
              Dollar You Donate Goes Directly Towards Our Foundation.
            </p>
          </div>

          {/* Become A Volunteer Section */}
          <div className="mb-12">
            <div className="mb-4 flex flex-col items-start gap-3">
              <div className="ml-4 text-[#EE9254]">
                <HiOutlineUsers className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-medium text-gray-900">
                Become A Volunteer
              </h2>
            </div>
            <p className="text-lg font-['Inter'] max-w-[400px] font-light">
              Join Our Team Of Dedicated Volunteers And Actively Participate In
              Our Events.
            </p>
          </div>

          {/* Ribbon Banner Section */}
          <div className="relative mt-8 w-full overflow-hidden">
            <div className="relative h-40 w-full">
              {/* First ribbon */}
              <div className="absolute left-[-10%] right-[-10%] top-12 -rotate-12 transform">
                <div className="w-full bg-[#EE9254] py-2 text-center whitespace-nowrap">
                  <span className="text-white inline-block mx-2">SUPPORT</span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">
                    SEE SMILE
                  </span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">SUPPORT</span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">
                    SEE SMILE
                  </span>
                  <span className="text-white inline-block mx-2">★</span>
                </div>
              </div>

              {/* Second ribbon */}
              <div className="absolute left-[-10%] right-[-10%] top-20 rotate-12 transform">
                <div className="w-full bg-black py-2 text-center whitespace-nowrap">
                  <span className="text-white inline-block mx-2">SUPPORT</span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">
                    SEE SMILE
                  </span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">SUPPORT</span>
                  <span className="text-white inline-block mx-2">★</span>
                  <span className="text-white inline-block mx-2">
                    SEE SMILE
                  </span>
                  <span className="text-white inline-block mx-2">★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="bg-[#EE9254] p-8 text-white">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">
              Changing Life For The Better...!
            </h1>
            <p className="text-lg">
              Supporting Families Through Life&apos;s Most Challenging Moments
              With Compassion, Resources, And Hope.
            </p>
          </div>

          {/* Family Image */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
            <Image
              src={ChangeLife}
              alt="Family enjoying time together in a park"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      <DonationForm />
    </section>
  );
}
