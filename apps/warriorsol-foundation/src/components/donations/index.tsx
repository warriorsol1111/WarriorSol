import React from "react";
import Image from "next/image";
import ChangeLife from "@/assets/changeLife.svg";
import { BiDonateHeart } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import DonationForm from "./DonationForm";
import SessionProviderWrapper from "../shared/sessionProvider";

export default function Donations() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] rounded-xl overflow-hidden shadow-md">
        {/* Left Column - Donation & Volunteer Info */}
        <div className="bg-[#FFEBCC] p-6 sm:p-8 lg:p-10">
          {/* Donate Now Section */}
          <div className="mb-10 sm:mb-12">
            <div className="mb-4 flex items-center gap-3">
              <BiDonateHeart className="h-10 w-10 sm:h-12 sm:w-12 text-[#EE9254]" />
              <h2 className="text-2xl sm:text-3xl font-medium text-[#1F1F1F]">
                Donate Now
              </h2>
            </div>
            <p className="text-base sm:text-lg font-['Inter'] max-w-md font-light leading-relaxed">
              Your financial contributions can make a real difference. Every
              dollar you donate goes directly towards our foundation.
            </p>
          </div>

          {/* Become A Volunteer Section */}
          <div className="mb-10 sm:mb-12">
            <div className="mb-4 flex items-center gap-3">
              <HiOutlineUsers className="h-10 w-10 sm:h-12 sm:w-12 text-[#EE9254]" />
              <h2 className="text-2xl sm:text-3xl font-medium text-[#1F1F1F]">
                Become A Volunteer
              </h2>
            </div>
            <p className="text-base sm:text-lg font-['Inter'] max-w-md font-light leading-relaxed">
              Join our team of dedicated volunteers and actively participate in
              our events.
            </p>
          </div>

          {/* Ribbon Banner Section */}
          <div className="relative mt-8 w-full overflow-hidden hidden sm:block">
            <div className="relative h-32 w-full">
              {/* First ribbon */}
              <div className="absolute left-[-20%] right-[-20%] top-10 -rotate-12">
                <div className="w-full bg-[#EE9254] py-2 text-lg sm:text-2xl text-center whitespace-nowrap">
                  <span className="text-white mx-2">SUPPORT</span>★
                  <span className="text-white mx-2">SEE SMILE</span>★
                  <span className="text-white mx-2">SUPPORT</span>★
                  <span className="text-white mx-2">SEE SMILE</span>★
                </div>
              </div>

              {/* Second ribbon */}
              <div className="absolute left-[-20%] right-[-20%] top-16 rotate-12">
                <div className="w-full bg-black py-2 text-lg sm:text-2xl text-center whitespace-nowrap">
                  <span className="text-white mx-2">SUPPORT</span>★
                  <span className="text-white mx-2">SEE SMILE</span>★
                  <span className="text-white mx-2">SUPPORT</span>★
                  <span className="text-white mx-2">SEE SMILE</span>★
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="bg-[#EE9254] p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-center">
          <div className="mb-6 sm:mb-8 max-w-xl">
            <h1 className="mb-4 text-3xl sm:text-4xl lg:text-[52px] font-normal leading-tight">
              Changing Life For The Better...!
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-['Inter'] leading-relaxed">
              Supporting families through life&apos;s most challenging moments
              with compassion, resources, and hope.
            </p>
          </div>

          {/* Family Image */}
          <div className="relative h-52 sm:h-64 lg:h-80 w-full overflow-hidden rounded-lg">
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

      {/* Donation Form Below Grid */}
      <div className="mt-8 sm:mt-10">
        <SessionProviderWrapper>
          <DonationForm />
        </SessionProviderWrapper>
      </div>
    </section>
  );
}
