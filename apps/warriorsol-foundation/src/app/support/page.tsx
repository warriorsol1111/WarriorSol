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
        <section className="relative bg-[#F8F9FA] py-5 md:py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl text-center md:text-start  leading-tight">
                  We&apos;re Here to Support Your Journey
                </h1>
                <p className="text-[18px] md:text-lg text-center md:text-start text-gray-600 ">
                  At WarriorSol Foundation, we understand that life can present
                  unexpected challenges. Our mission is to provide meaningful
                  support to families facing difficult times, offering both
                  financial assistance and resources to help you navigate
                  through these moments.
                </p>
              </div>
              <div className="">
                <Image
                  src={changeLifeImg}
                  alt="Support Illustration"
                  layout="responsive"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Form Section */}
        <section className="">
          <div className="container  mt-[-20px] mx-auto px-4">
            <ApplyForSupport showParagraph={false} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
