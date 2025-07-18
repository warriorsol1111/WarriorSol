import React from "react";
import Image from "next/image";
import DonorWallImage from "@/assets/donor-wall-total.svg";
import { Card } from "@/components/ui/card";
import * as Progress from "@radix-ui/react-progress";
import { Donation } from "./index";

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
      <section className="w-full flex flex-wrap lg:flex-nowrap gap-8 bg-white py-8 rounded-lg shadow items-stretch">
        {/* Left: Image with overlay card */}
        <div className="relative basis-[50%] min-w-[350px] min-h-[700px] flex items-center justify-center h-full">
          <Image
            src={DonorWallImage}
            alt="Donor Wall"
            fill
            className="object-cover rounded-lg"
            priority
          />
          <Card className="absolute bottom-8  bg-[#FFEBCC] p-6 rounded-lg shadow-lg w-[90vh]">
            <div className="text-[#1F1F1F] text-[42px] font-medium ">
              Total Raised
            </div>
            <div className="text-[52px] font-bold ">
              ${(totalRaised / 100).toLocaleString()}
            </div>
            <Progress.Root
              className="relative overflow-hidden bg-[#F5E0C3] rounded-full w-full h-2 my-2"
              value={progressPercentage}
            >
              <Progress.Indicator
                className="bg-[#F2994A] w-full h-full transition-transform duration-500"
                style={{
                  transform: `translateX(-${100 - progressPercentage}%)`,
                }}
              />
            </Progress.Root>

            <div className="flex justify-between text-2xl font-semibold">
              <span>{uniqueInvestors.length} investors</span>
              <span>{progressPercentage.toFixed()}%</span>
            </div>
          </Card>
        </div>

        {/* Right: Top Contributors */}
        <div className="flex-1 min-w-[350px] h-full flex flex-col">
          <h2 className="text-3xl font-['Cormorant_SC'] mb-6">Top Donations</h2>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {topIndividualDonations.map((donation) => {
              const initials = donation.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();
              return (
                <div
                  key={donation.id}
                  className="flex items-center justify-between bg-[#FAFAFA] rounded-lg p-8 shadow-sm border-l-4 border-[#EE9254] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#EE9254] text-white font-bold text-xl">
                      {initials}
                    </div>
                    <div>
                      <div className="font-medium text-2xl">
                        {donation.name}
                      </div>
                      <div className="text-xs">
                        Donated on{" "}
                        {new Date(donation.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    ${(donation.amount / 100).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Recent Donations Section */}
      <section className="w-full mt-8 bg-[#FFF8F0] rounded-xl shadow-lg p-8">
        <h2 className="text-[52px] font-['Cormorant_SC'] font-semibold mb-6 text-[#1F1F1F]">
          Recent Donations
        </h2>
        <div className="flex flex-col gap-4">
          {recentDonations.map((donation, idx) => {
            const initials = donation.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={donation.id || idx}
                className="flex items-center justify-between bg-white rounded-xl px-6 py-5 shadow-sm border border-[#F5E0C3] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F2994A]/90 text-white font-bold text-lg shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-[#1F1F1F]">
                      {donation.name}
                    </div>
                    <div className="text-sm text-[#777]">
                      Donated on{" "}
                      {new Date(donation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-[#1F1F1F]">
                  ${(donation.amount / 100).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
