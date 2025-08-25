"use client";

import mainImage from "@/assets/Rectangle 215.png";
import coleImage from "@/assets/cole.png";
import jimmyImage from "@/assets/jimmy.png";
import missionImage from "@/assets/mission.png";
import { SocialLinks } from "@/components/shared/socialLinks";
import Image from "next/image";
import React from "react";

const CommunityPage = () => {
  return (
    <main className="bg-white text-black font-inter">
      {/* ✅ HERO TEXT Section */}
      <section className="w-full px-6 md:px-24 py-16 text-center">
        <h1 className="text-[40px] md:text-[62px] font-cormorantSC font-normal leading-tight">
          Our Story – Born Of Fire, Built To Shine
        </h1>
        <p className="mt-6 text-[16px] md:text-[20px] font-[Inter] font-light leading-relaxed text-black/70 max-w-5xl mx-auto">
          Warrior Sol began not as a brand, but as a battle cry. We are rooted
          in the lived experience of love, loss, and resilience. This journey
          started with Tasha—our first warrior, our North Star. When cancer
          entered her life, it lit a fire in ours. We stood beside her through
          every appointment, every fight, every quiet moment of strength. And
          when she left this world at exactly 11:11pm, she left behind more than
          memories—she left a mission.
          <br />
          <br />
          That mission became Warrior Sol: a community, a movement, and a
          rebellion wrapped in fabric. Every piece we create is stitched with
          purpose—meant to honor the warriors, the caregivers, the grievers, and
          the ones who show up with quiet courage every single day.
          <br />
          <br />
          We don&apos;t just sell clothing. We wear our stories. We wear our
          strength.
        </p>
      </section>

      {/* ✅ HERO IMAGE Section */}
      <section className="w-full">
        <Image
          src={mainImage}
          alt="Hero Background"
          className="w-full h-auto object-cover"
          placeholder="blur"
        />
      </section>

      {/* ✅ MISSION SECTION */}
      <section className="w-full px-6 md:px-24 py-20 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <Image
            src={missionImage}
            alt="Mission Visual"
            className="rounded w-full h-auto object-cover"
            placeholder="blur"
          />
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-[42px] md:text-[62px] font-cormorantSC capitalize leading-tight mb-6 text-[#1F1F1F]">
            Our Mission – Apparel With A Pulse
          </h2>
          <p className="text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 leading-relaxed">
            At Warrior Sol, our mission is to create emotionally powerful
            apparel that offers more than comfort—it offers connection.
          </p>
          <p className="text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 leading-relaxed mt-4">
            We&apos;re here to:
          </p>
          <ul className="list-disc list-inside mt-3 text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 leading-relaxed">
            <li>
              Empower those impacted by cancer—fighters, survivors, caregivers,
              and allies.
            </li>
            <li>
              Share real stories that spark empathy, healing, and belonging.
            </li>
            <li>
              Give back directly to the warriors and families navigating the
              financial, emotional, and physical burdens of cancer.
            </li>
            <li>
              Turn fashion into a force for good—one thread, one story, one
              sunrise at a time.
            </li>
          </ul>
          <p className="text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 leading-relaxed mt-4">
            We are a tribe. A rebellion of care. And we&apos;re not here to
            follow trends—we&apos;re here to fight for truth, tenderness, and
            tangible impact.
          </p>
        </div>
      </section>

      {/* ✅ TEAM SECTION */}
      <section className="w-full px-6 md:px-24 py-20 text-center">
        <h2 className="text-[42px] md:text-[62px] text-[#1F1F1F] font-cormorantSC capitalize">
          Our Team
        </h2>
        <p className="mt-4 text-[16px] md:text-[20px] font-[Inter] font-light text-black/70 opacity-70">
          We&apos;ve walked these halls. We&apos;ve held the hands. We&apos;ve
          heard the silence—and we chose to speak.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {/* Cole */}
          <div className="flex flex-col items-start text-left">
            <Image
              src={coleImage}
              alt="Cole"
              className="w-full h-auto rounded"
              placeholder="blur"
            />
            <h3 className="mt-4 text-2xl font-normal font-cormorant">Cole</h3>
            <p className="text-[16px] text-[#1F1F1F99] font-[Inter]">
              Creative Lead & Storykeeper
            </p>
            <p className="mt-2 text-[16px] font-light text-[#1F1F1FB2] font-[Inter] ">
              Cole brings vision, voice, and vulnerability to the heart of the
              brand. A designer with a mission, and a son who carries strength
              in his blood.
            </p>
          </div>

          {/* Jimmy */}
          <div className="flex flex-col items-start text-left">
            <Image
              src={jimmyImage}
              alt="Jimmy"
              className="w-full h-auto rounded"
              placeholder="blur"
            />
            <h3 className="mt-4 text-2xl font-normal font-cormorant">Jimmy</h3>
            <p className="text-[16px] text-[#1F1F1F99] font-[Inter]">
              Founder, Warrior #2
            </p>
            <p className="mt-2 text-[16px] font-light text-[#1F1F1FB2] font-[Inter] ">
              A father, a husband, and now, a messenger of light. After losing
              his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his
              way of saying: &quot;We&apos;re still here. We&apos;re still
              fighting.&quot;
            </p>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {/* Cole */}
          <div className="flex flex-col items-start text-left">
            <Image
              src={coleImage}
              alt="Cole"
              className="w-full h-auto rounded"
              placeholder="blur"
            />
            <h3 className="mt-4 text-2xl font-normal font-cormorant">Cole</h3>
            <p className="text-[16px] text-[#1F1F1F99] font-[Inter]">
              Creative Lead & Storykeeper
            </p>
            <p className="mt-2 text-[16px] font-light text-[#1F1F1FB2] font-[Inter] ">
              Cole brings vision, voice, and vulnerability to the heart of the
              brand. A designer with a mission, and a son who carries strength
              in his blood.
            </p>
          </div>

          {/* Jimmy */}
          <div className="flex flex-col items-start text-left">
            <Image
              src={jimmyImage}
              alt="Jimmy"
              className="w-full h-auto rounded"
              placeholder="blur"
            />
            <h3 className="mt-4 text-2xl font-normal font-cormorant">Jimmy</h3>
            <p className="text-[16px] text-[#1F1F1F99] font-[Inter]">
              Founder, Warrior #2
            </p>
            <p className="mt-2 text-[16px] font-light text-[#1F1F1FB2] font-[Inter] ">
              A father, a husband, and now, a messenger of light. After losing
              his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his
              way of saying: &quot;We&apos;re still here. We&apos;re still
              fighting.&quot;
            </p>
          </div>
        </div>
      </section>
      <SocialLinks />
    </main>
  );
};

export default CommunityPage;
