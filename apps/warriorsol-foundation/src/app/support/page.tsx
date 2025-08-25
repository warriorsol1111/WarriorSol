import React from "react";
import ApplyForSupport from "@/components/homepage/ApplyForSupport";
import Image from "next/image";
import changeLifeImg from "@/assets/changeLife.svg";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Support | WarriorSol Foundation",
  description:
    "At WarriorSol Foundation, we provide support to families facing unexpected challenges. Our mission is to offer financial assistance and resources to help you navigate through difficult times.",
};

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-[#F8F9FA] py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl text-center md:text-start font-['Cormorant_SC'] leading-tight">
                  We&apos;re Here to Support Your Journey
                </h1>
                <p className="text-lg text-center md:text-start text-gray-600 font-['Inter']">
                  At WarriorSol Foundation, we understand that life can present
                  unexpected challenges. Our mission is to provide meaningful
                  support to families facing difficult times, offering both
                  financial assistance and resources to help you navigate
                  through these moments.
                </p>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src={changeLifeImg}
                  alt="Support Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ApplyForSupport />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
