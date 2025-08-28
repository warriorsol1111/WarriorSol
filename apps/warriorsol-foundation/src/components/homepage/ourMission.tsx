import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { HiOutlineUsers } from "react-icons/hi2";
import { BiDonateHeart } from "react-icons/bi";

const OurMission = () => {
  const cards = [
    {
      icon: <FaRegHeart className="w-[100px] h-[100px] text-[#EE9254]" />,
      title: "Compassion",
      description:
        "Every Family Deserves Support During Their Most Difficult Moments",
    },
    {
      icon: <HiOutlineUsers className="w-[100px] h-[100px] text-[#EE9254]" />,
      title: "Community",
      description:
        "Together We Can Make A Meaningful Difference In People's Lives",
    },
    {
      icon: <BiDonateHeart className="w-[100px] h-[100px] text-[#EE9254]" />,
      title: "Hope",
      description:
        "Providing Resources And Support To Help Families Heal And Thrive",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 md:mb-16">
        <h2 className='text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight md:leading-[62px] font-["Cormorant_SC"] font-normal text-[#1F1F1F] mb-3 md:mb-4'>
          Our Mission
        </h2>
        <p className='text-[16px] sm:text-[18px] md:text-[20px] font-light font-["Inter"] text-[#1F1F1F]/70 mx-auto'>
          The Warrior Sol Foundation is dedicated to supporting families facing
          life&apos;s greatest challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#F9F9F9] p-8 md:p-10 rounded-lg text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-6">{card.icon}</div>
            <h3 className='text-[28px]  font-["Cormorant_SC"] text-[#1F1F1F] mb-3'>
              {card.title}
            </h3>
            <p className='text-[15px] md:text-[16px] font-light font-["Inter"] text-[#1F1F1F]/70 max-w-[280px]'>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurMission;
