"use client";
import ApplyForSupport from "../homepage/Apply";
import { Button } from "../ui/button";
import SupportImage1 from "../../assets/support1.svg";
import SupportImage2 from "../../assets/support2.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ApplyForSupportPage() {
  const router = useRouter();
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
      {/* Heading + description */}
      <div className="flex flex-col max-w-3xl text-center mx-auto items-center gap-4 sm:gap-5">
        <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[90px] leading-tight">
          Changing life for the better...!
        </h2>
        <p className="font-normal text-[#484848] text-base sm:text-lg md:text-xl lg:text-[20px] text-center">
          Supporting families through life&apos;s most challenging moments with
          compassion, resources, and hope.
        </p>
      </div>

      {/* Donate Button */}
      <div className="flex items-center justify-center mt-8 sm:mt-12">
        <Button
          className="bg-[#C1E965] rounded-full w-[130px] sm:w-[160px] h-[48px] sm:h-[60px] hover:bg-[#b3e06d] text-[#023729] text-base sm:text-lg md:text-[18px] font-medium"
          size="lg"
          onClick={() => {
            router.push("/donations");
          }}
        >
          Donate Now
        </Button>
      </div>

      {/* Image + cards section */}
      <div className="flex flex-col lg:flex-row items-center justify-center mt-10 lg:mt-16 p-4 lg:p-8 mx-auto max-w-7xl gap-6">
        {/* Left side grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:p-4 w-full lg:w-1/2">
          {/* Image */}
          <div className="w-full lg:col-span-1 mb-6 lg:mb-0">
            <Image
              src={SupportImage1}
              alt="Hands holding a stone with 'Hope' engraved"
              width={600}
              height={600}
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[470px] object-cover rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Cards */}
          <div className="flex flex-col justify-center space-y-6 w-full lg:col-span-1">
            <div className="p-4 sm:p-6 w-full sm:w-[280px] h-auto bg-[#F5F4A9] rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105">
              <p className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug">
                Every dollar you donate goes directly towards our foundation.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-[#C5E99E] rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-semibold">
                150K+
              </h3>
              <p className="text-sm sm:text-base md:text-[16px] text-[#484848] font-semibold mt-2">
                Join our team of dedicated volunteers and actively participate
                in our events.
              </p>
            </div>
          </div>
        </div>

        {/* Right side image */}
        <div className="w-full lg:w-1/2 lg:p-4">
          <Image
            src={SupportImage2}
            alt="Hands cupped, holding seashells on a beach"
            width={600}
            height={600}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[470px] object-cover rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* ApplyForSupport Component */}
      <ApplyForSupport />
    </section>
  );
}
