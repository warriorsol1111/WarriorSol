import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import DonorWallImage from "@/assets/donorWall.svg";

export default function DonorWall() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <Card className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-none">
        <Image
          src={DonorWallImage}
          alt="Donor Wall"
          fill
          priority
          className="absolute inset-0 object-cover z-0"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
          }}
        />

        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12 z-20">
          <div className="text-white space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-[62px] font-normal">
              Support our
              <br />
              mission of hope{" "}
            </h1>
            <p className="text-xl md:text-xl max-w-2xl opacity-90 font-light">
              Your generous donation helps us provide care, support, and lasting
              impact for those in need. Every contribution brings us closer to a
              brighter future.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
