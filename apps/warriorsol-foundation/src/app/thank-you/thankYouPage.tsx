"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ConfettiExplosion from "react-confetti-explosion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import Image from "next/image";
import ThankYouImage from "@/assets/thank_you.svg";
export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full  flex flex-col justify-center items-center px-6 py-12 text-center">
        <div className="max-w-xl">
          <div className="relative flex justify-center mb-6">
            {showConfetti && <ConfettiExplosion force={0.6} duration={3000} />}
          </div>
          <div className="mb-6">
            <Image
              src={ThankYouImage}
              alt="Thank you illustration"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl font-['Cormorant_SC'] text-[#1F1F1F] mb-4">
            Thank You for Your Generosity!
          </h1>

          <p className="text-lg text-[#1F1F1F]/70 font-light mb-8 font-['Inter']">
            Your donation brings hope and support to families when they need it
            most.
            <br />
            We’re deeply grateful for your kindness—you’re truly making a
            difference. 💖
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-lg bg-[#EE9254] hover:bg-[#e76b1f] text-white text-lg px-8 py-4"
          >
            <Link href="/home">Back to Home</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </>
  );
}
