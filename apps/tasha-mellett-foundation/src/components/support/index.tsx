"use client";
import ApplyForSupport from "../homepage/applyForSupport";
import { Button } from "../ui/button";
import SupportImage1 from "../../assets/support1.svg";
import SupportImage2 from "../../assets/support2.svg";
import Image from "next/image";

export default function ApplyForSupportPage() {
  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col max-w-3xl text-center mx-auto items-center gap-5">
          <h2 className="font-bold text-[90px] text-center">
            Changing life for the better...!
          </h2>
          <p className="font-normal text-[#484848] text-[20px] text-center">
            Supporting families through life&apos;s most challenging moments
            with compassion, resources, and hope.
          </p>
        </div>
        <div className="flex items-center justify-center mt-12">
          <Button
            className="bg-[#C1E965] rounded-full !w-[160px] hover:bg-[#b3e06d] !h-[60px] text-[#023729] text-[18px] font-medium"
            size="lg"
          >
            Donate Now
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center p-8  rounded-2x mx-auto max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:p-4 w-full lg:w-1/2">
            <div className="w-full lg:col-span-1 mb-6 lg:mb-0">
              <Image
                src={SupportImage1}
                alt="Hands holding a stone with 'Hope' engraved"
                width={600}
                height={600}
                className="w-full h-[470px] object-cover rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-center space-y-6 w-full lg:col-span-1">
              <div className="p-6 w-[280px] !h-[200px] bg-[#F5F4A9] rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105">
                <p className=" text-[28px] font-semibold">
                  Every dollar you donate goes directly towards our foundation.
                </p>
              </div>

              <div className="p-6 bg-[#C5E99E] rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105">
                <h3 className=" text-[80px] font-semibold">150K+</h3>
                <p className=" text-[16px] text-[#484848] font-semibold">
                  Join our team of dedicated volunteers and actively participate
                  in our events.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:p-4">
            <Image
              src={SupportImage2}
              alt="Hands cupped, holding seashells on a beach"
              width={600}
              height={600}
              className="w-full h-[470px] object-cover rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        <ApplyForSupport
          heading="Make a Difference Today"
          subHeading="Every donation helps families facing their greatest challenges. Your support provides hope, resources, and healing."
        />
      </section>
    </>
  );
}
