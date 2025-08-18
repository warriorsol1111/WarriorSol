import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import DonorWallImage from "@/assets/donorWall.svg";
import DonorWallShowcase from "./donorWallShowcase";
export type Donation = {
  id: string;
  userId: string;
  stripeSessionId: string;
  stripeReceiptUrl: string;
  stripeSubscriptionId: string | null;
  name: string;
  email: string;
  amount: number;
  currency: string;
  donationType: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  userProfilePhoto: string;
};
export default function DonorWall({
  topDonations = [],
  recentDonations = [],
}: {
  topDonations: Donation[];
  recentDonations: Donation[];
}) {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl md:text-[64px] font-extrabold max-w-lg">
          Support Our Mission of Hope
        </h2>
        <p className="mt-2 text-[#474749] font-medium text-[20px] max-w-md">
          Your generous donation helps us provide care, support, and lasting
          impact for those in need. Every contribution brings us closer to a
          brighter future.
        </p>
      </div>
      <Card className="relative w-full mt-12 h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl">
        <Image
          src={DonorWallImage}
          alt="Donor Wall"
          fill
          priority
          className="absolute inset-0 object-cover z-0"
        />
      </Card>
      <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
        <h2 className="text-[32px] sm:text-[44px] text-center font-extrabold capitalize">
          Our Amazing Donors
        </h2>
        <p className="text-[16px] sm:text-[18px] lg:text-[27px] text-center font-medium text-[#999999] capitalize mt-2 sm:mt-3">
          Thank you to all the warriors who make our mission possible
        </p>
      </div>
      <DonorWallShowcase
        topDonations={topDonations}
        recentDonations={recentDonations}
      />
    </section>
  );
}
