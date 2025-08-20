"use client";

import { Heart, Users, Leaf } from "lucide-react";

interface MissionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const missionItems: MissionItem[] = [
  {
    icon: <Heart className="w-6 h-6 text-[#B3D760]" />,
    title: "Compassion",
    description:
      "Every family deserves support during their most difficult moments",
  },
  {
    icon: <Users className="w-6 h-6 text-[#B3D760]" />,
    title: "Community",
    description:
      "Together we can make a meaningful difference in people’s lives",
  },
  {
    icon: <Leaf className="w-6 h-6 text-[#B3D760]" />,
    title: "Hope",
    description:
      "Providing resources and support to help families heal and thrive",
  },
];

export default function OurMission() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
      <div className="items-center md:items-start flex flex-col gap-4 mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-[44px] font-extrabold ">Our Mission</h2>
        <p className="mt-3 text-[#999999] font-medium text-[27px]">
          The Tasha Mellett Foundation is dedicated to supporting families
          facing life’s greatest challenges.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {missionItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFF7DC] mb-4">
              {item.icon}
            </div>
            <h3 className="text-[28px] font-semibold">{item.title}</h3>
            <p className="mt-2 text-[#999999] font-medium text-[18px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
