import React from "react";
import Image from "next/image";
import DonorWallImage from "@/assets/donor-wall-total.svg";
import { Card } from "@/components/ui/card";
import * as Progress from "@radix-ui/react-progress";
import { Donation } from "./index";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type DonorWallShowcaseProps = {
  topDonations: Donation[];
  recentDonations: Donation[];
};

export default function DonorWallShowcase({
  topDonations = [],
  recentDonations = [],
}: DonorWallShowcaseProps) {
  const totalRaised = topDonations.reduce((sum, d) => sum + d.amount, 0);
  const fundingGoal = 23000 * 100;
  const progressPercentage = Math.min((totalRaised / fundingGoal) * 100, 100);
  const uniqueInvestors = Array.from(new Set(topDonations.map((d) => d.email)));
  const topIndividualDonations = [...topDonations]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <>
      {/* Total Raised + Top Donors */}
      <section className="w-full flex flex-col lg:flex-row gap-8 bg-white py-8 px-4 sm:px-6 rounded-lg shadow-md mt-8">
        {/* Image + Stats */}
        <div className="relative w-full lg:w-1/2 h-[1000px] rounded-lg overflow-hidden">
          <Image
            src={DonorWallImage}
            alt="Donor Wall"
            fill
            className="object-cover"
            priority
          />
          <Card className="absolute bottom-4 left-4 right-4 bg-[#FFEBCC] p-6 rounded-lg shadow-md">
            <h3 className="text-xl sm:text-[42px] font-medium text-[#1F1F1F]">
              Total Raised
            </h3>
            <p className="text-3xl sm:text-[52px] font-[Geist] font-medium">
              ${(totalRaised / 100).toLocaleString()}
            </p>
            <Progress.Root
              className="relative overflow-hidden bg-[#F5E0C3] rounded-full w-full h-2 my-3"
              value={progressPercentage}
            >
              <Progress.Indicator
                className="bg-[#F2994A] w-full h-full transition-transform duration-500"
                style={{
                  transform: `translateX(-${100 - progressPercentage}%)`,
                }}
              />
            </Progress.Root>
            <div className="flex justify-between text-sm sm:text-lg font-[Geist] font-medium">
              <span>{uniqueInvestors.length} investors</span>
              <span>{progressPercentage.toFixed()}%</span>
            </div>
          </Card>
        </div>

        {/* Top Donors */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="text-2xl sm:text-[42px] font-['Cormorant_SC'] text-[#1F1F1F] mb-4">
            Top Contributors
          </h2>
          {topIndividualDonations.length === 0 ? (
            <p className="text-sm text-[#1F1F1F99] font-light italic">
              No top donations yet. Be the first to support!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {topIndividualDonations.map((donation) => {
                  const initials = donation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between bg-[#FAFAFA]  p-4 sm:p-6 shadow-sm border-l-4 border-[#EE9254]"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            className="object-cover rounded-full"
                            src={donation.userProfilePhoto}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-lg sm:text-[26px] text-[#1F1F1F] font-[Geist]">
                            {donation.name}
                          </div>
                          <div className="text-xs sm:text-lg font-[Geist] text-[#1F1F1F99]">
                            Donated on{" "}
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg sm:text-[26px] font-[Geist] text-[#1F1F1F] font-medium">
                        ${(donation.amount / 100).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Donations */}
      <section className="w-full mt-8 bg-[#FFF8F0] rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-[42px] text-[#1F1F1F] font-['Cormorant_SC'] mb-4">
          Recent Donations
        </h2>
        {recentDonations.length === 0 ? (
          <p className="text-sm text-[#1F1F1F99] font-light italic">
            No recent donations available at the moment.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {recentDonations.map((donation, idx) => {
              const initials = donation.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={donation.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-[#F5E0C3]"
                >
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <Avatar>
                      <AvatarImage src={donation.userProfilePhoto} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg sm:text-[26px] text-[#1F1F1F] font-[Geist]">
                        {donation.name}
                      </div>
                      <div className="text-xs sm:text-lg font-[Geist] text-[#1F1F1F99]">
                        Donated on{" "}
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-[26px] font-[Geist] text-[#1F1F1F] font-medium">
                    ${(donation.amount / 100).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
