"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import AboutUsImage1 from "../../assets/about-us-1.svg";
import AboutUsImage2 from "../../assets/about-us-2.svg";

export default function AboutBanner() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16">
      <section className="relative h-[295px] bg-[#CDED84] flex items-center justify-center rounded-lg overflow-hidden px-6 sm:px-10 lg:px-32 py-8 sm:py-12 lg:py-16">
        {/* Left arcs (mirrored inward) */}
        <svg
          className="absolute left-0 bottom-0 w-1/3 max-w-[220px] h-auto transform -scale-x-100"
          viewBox="0 0 220 220"
          fill="none"
          preserveAspectRatio="xMinYMin meet"
        >
          <circle cx="220" cy="220" r="110" stroke="white" strokeWidth="6" />
          <circle cx="220" cy="220" r="90" stroke="white" strokeWidth="6" />
          <circle cx="220" cy="220" r="75" stroke="white" strokeWidth="6" />
        </svg>

        {/* Right arcs (mirrored inward) */}
        <svg
          className="absolute right-0 top-0 w-1/3 max-w-[220px] h-auto transform -scale-x-100"
          viewBox="0 0 220 220"
          fill="none"
          preserveAspectRatio="xMaxYMax meet"
        >
          <circle cx="0" cy="0" r="110" stroke="white" strokeWidth="6" />
          <circle cx="0" cy="0" r="90" stroke="white" strokeWidth="6" />
          <circle cx="0" cy="0" r="75" stroke="white" strokeWidth="6" />
        </svg>

        {/* Content */}
        <div className="relative text-center">
          <Button className="bg-white py-1 text-[#023729] text-lg rounded-full font-extrabold !px-6">
            Donate Now
          </Button>
          <h2 className="mt-4 text-[31px] md:text-[62px] text-[#1F1F1F] font-medium">
            Know More About Us
          </h2>
        </div>
      </section>
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className=" mx-auto grid md:grid-cols-2 gap-10 items-start">
          {/* Left side - heading */}
          <h2 className="text-[32px] md:text-[62px] text-center md:text-left font-medium leading-snug">
            Our Story – <br /> Born Of Fire, <br /> Built To Shine
          </h2>

          {/* Right side - content */}
          <div className="space-y-6 text-[20px] text-[#1F1F1F] md:text-left text-center">
            <p>
              Warrior Sol began not as a brand, but as a battle cry. We are
              rooted in the lived experience of love, loss, and resilience. This
              journey started with Tasha—our first warrior, our north star. When
              cancer entered her life, it lit a fire in ours. We stood beside
              her through every appointment, every fight, every quiet moment of
              strength. And when she left this world at exactly 11:11pm, she
              left behind more than memories—she left a mission.
            </p>

            <p>
              That mission became Warrior Sol: a community, a movement, and a
              rebellion wrapped in fabric. Every piece we create is stitched
              with purpose—meant to honor the warriors, the caregivers, the
              grievers, and the ones who show up with quiet courage every single
              day.
            </p>

            <p>
              We don’t just sell clothing. We wear our stories. We wear our
              strength.
            </p>
          </div>
        </div>
      </section>
      <section className="text-center mt-4">
        <h2 className="text-[32px] md:text-[62px] font-medium mb-4">
          Our Mission
        </h2>
        <p className="text-[20px] md:text-[42px] text-[#1F1F1F]">
          At Warrior Sol, our mission is to create emotionally powerful apparel
          that offers more than comfort, it offers connection.
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-10 mt-20 items-center">
        <div className="rounded-lg overflow-hidden shadow-md">
          <Image
            src={AboutUsImage1}
            alt="What We Stand For"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-[32px] md:text-[42px] font-medium mb-4">
            What We Stand For
          </h3>
          <p className="text-[20px] md:text-[20px] text-[#1F1F1FB2] leading-relaxed">
            We stand for survivors. For fighters. For caregivers. For families.
            For every story untold but deeply felt. Warrior Sol represents the
            light that breaks through darkness and the belief that healing is
            not only possible but beautiful.
          </p>
        </div>
      </section>

      {/* Our Spirit */}
      <section className="grid md:grid-cols-2 gap-10 mt-20 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <h3 className="text-[32px] md:text-[42px] font-medium mb-4">
            Our Spirit
          </h3>
          <p className="text-[20px] md:text-[20px] text-[#1F1F1FB2] leading-relaxed">
            Warrior Sol isn’t just clothing; it’s a declaration. A reminder that
            in every scar lies a story. In every silence, a voice waiting to be
            heard. Our spirit is unbreakable. Our message, unstoppable.
          </p>
        </div>
        <div className="order-1 rounded-lg overflow-hidden shadow-md md:order-2">
          <Image
            src={AboutUsImage2}
            alt="Our Spirit"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      </section>
    </div>
  );
}
