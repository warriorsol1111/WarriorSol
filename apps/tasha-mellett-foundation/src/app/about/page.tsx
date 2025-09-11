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
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Our Story – Born Of Fire, Built To Shine
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Warrior Sol began as not just a brand, but a beacon of hope. The kind
          of fire that refines, that shapes, that strengthens. Out of
          life&apos;s battles came a vision: to create apparel that isn’t just
          worn, but lived in. Apparel that celebrates the unspoken strength of
          survivors, the relentless drive of fighters, and the unity of those
          who believe in standing tall no matter the storm. At Warrior Sol, we
          don’t just make clothes. We craft identity. Together, we are not just
          survivors — we are warriors.
        </p>
      </section>
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At Warrior Sol, our mission is to create empowering powerful apparel
          that offers more than comfort, it offers connection.
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-lg overflow-hidden shadow-md">
          <Image
            src={AboutUsImage1}
            alt="What We Stand For"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">What We Stand For</h3>
          <p className="text-gray-600 leading-relaxed">
            We stand for survivors. For fighters. For caregivers. For families.
            For every story untold but deeply felt. Warrior Sol represents the
            light that breaks through darkness and the belief that healing is
            not only possible but beautiful.
          </p>
        </div>
      </section>

      {/* Our Spirit */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h3 className="text-xl font-semibold mb-4">Our Spirit</h3>
          <p className="text-gray-600 leading-relaxed">
            Warrior Sol isn’t just clothing; it’s a declaration. A reminder that
            in every scar lies a story. In every silence, a voice waiting to be
            heard. Our spirit is unbreakable. Our message, unstoppable.
          </p>
        </div>
        <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-md">
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
