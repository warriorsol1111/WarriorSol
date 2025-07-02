'use client';

import Image from 'next/image';
import React from 'react';
import mainImage from '@/assets/Rectangle 215.png';
import missionImage from '@/assets/mission.png';
import coleImage from '@/assets/cole.png';
import jimmyImage from '@/assets/jimmy.png';

const CommunityPage = () => {
  return (
    <main className="bg-white text-black font-inter">
      {/* ✅ HERO TEXT Section */}
      <section className="w-full px-6 md:px-24 py-16 text-center">
        <h1 className="text-[40px] md:text-[54px] font-cormorantSC leading-tight">
          Our Story – Born Of Fire, Built To Shine
        </h1>
        <p className="mt-6 text-[16px] md:text-[18px] font-light leading-relaxed text-black/80 max-w-5xl mx-auto">
          Warrior Sol began not as a brand, but as a battle cry. We are rooted in the lived experience of love, loss, and resilience.
          This journey started with Tasha—our first warrior, our North Star. When cancer entered her life, it lit a fire in ours.
          We stood beside her through every appointment, every fight, every quiet moment of strength. And when she left this world at
          exactly 11:11pm, she left behind more than memories—she left a mission.
          <br /><br />
          That mission became Warrior Sol: a community, a movement, and a rebellion wrapped in fabric. Every piece we create is
          stitched with purpose—meant to honor the warriors, the caregivers, the grievers, and the ones who show up with quiet
          courage every single day.
          <br /><br />
          We don’t just sell clothing. We wear our stories. We wear our strength.
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
          <h2 className="text-[42px] md:text-[54px] font-cormorantSC capitalize leading-tight mb-6">
            Our Mission – Apparel With A Pulse
          </h2>
          <p className="text-[16px] md:text-[18px] font-light text-black/80 leading-relaxed">
            At Warrior Sol, our mission is to create emotionally powerful apparel that offers more than comfort—it offers connection.
            <br /><br />
            We’re here to:
            <ul className="list-disc list-inside mt-3">
              <li>Empower those impacted by cancer—fighters, survivors, caregivers, and allies.</li>
              <li>Share real stories that spark empathy, healing, and belonging.</li>
              <li>Give back directly to the warriors and families navigating the financial, emotional, and physical burdens of cancer.</li>
              <li>Turn fashion into a force for good—one thread, one story, one sunrise at a time.</li>
            </ul>
            <br />
            We are a tribe. A rebellion of care. And we’re not here to follow trends—we’re here to fight for truth, tenderness, and tangible impact.
          </p>
        </div>
      </section>

      {/* ✅ TEAM SECTION */}
      <section className="w-full px-6 md:px-24 py-20 text-center">
        <h2 className="text-[42px] md:text-[54px] font-cormorantSC capitalize">
          Our Team
        </h2>
        <p className="mt-4 text-[16px] md:text-[18px] font-light text-black/70">
          We’ve walked these halls. We’ve held the hands. We’ve heard the silence—and we chose to speak.
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
            <h3 className="mt-4 text-xl font-cormorant">Cole</h3>
            <p className="text-sm text-black/60">Creative Lead & Storykeeper</p>
            <p className="mt-2 text-[16px] font-light text-black/70">
              Cole brings vision, voice, and vulnerability to the heart of the brand. A designer with a mission, and a son who carries strength in his blood.
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
            <h3 className="mt-4 text-xl font-cormorant">Jimmy</h3>
            <p className="text-sm text-black/60">Founder, Warrior #2</p>
            <p className="mt-2 text-[16px] font-light text-black/70">
              A father, a husband, and now, a messenger of light. After losing his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his way of saying: “We’re still here. We’re still fighting.”
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CommunityPage;
