import React from "react";
import { Button } from "../ui/button";

const GiveMeaning = () => {
  const steps = [
    {
      number: "01",
      title: "Pick Their Piece",
      description: "Choose From Our Meaningful Collections",
    },
    {
      number: "02",
      title: "Add A Message",
      description: "Include A Personal Tribute Or Note",
    },
    {
      number: "03",
      title: "We Deliver With Soul",
      description: "Beautifully Packaged With Care",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight md:leading-[62px]  font-normal text-[#1F1F1F] mb-3 md:mb-4">
          Give Meaning, Not Just Merchandise
        </h2>
        <p className="text-[16px] sm:text-[18px] md:text-[20px]   text-[#1F1F1F]/70 max-w-3xl mx-auto">
          Send More Than A Gift. Send Strength, Hope, And The Reminder That
          They&apos;re Not Alone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#F9F9F9] p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg text-center"
          >
            <div className="relative mb-4 md:mb-6 lg:mb-8">
              <span className="absolute inset-0 text-[80px] sm:text-[100px] md:text-[120px]   text-[#E4B0A0] opacity-10">
                {step.number}
              </span>
              <span
                className="relative text-[80px] sm:text-[100px] md:text-[120px]   text-transparent"
                style={{
                  WebkitTextStroke: "1px #E4B0A0",
                }}
              >
                {step.number}
              </span>
            </div>
            <h3 className="text-[24px] sm:text-[28px] md:text-[32px]  text-[#1F1F1F] mb-2 md:mb-3">
              {step.title}
            </h3>
            <p className="text-[14px] sm:text-[15px] md:text-[16px]   text-[#1F1F1F]/70">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 md:mt-12">
        <Button
          variant="outline"
          size="lg"
          className="border border-black px-6 sm:px-8 py-2 h-14 sm:py-3 text-[16px] sm:text-[18px] md:text-[20px]  capitalize hover:bg-black hover:text-white transition"
        >
          Get A Gift ↗
        </Button>
      </div>
    </section>
  );
};

export default GiveMeaning;
