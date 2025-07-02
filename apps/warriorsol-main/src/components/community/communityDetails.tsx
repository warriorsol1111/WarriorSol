import React from "react";
import Image from "next/image";
import sunsetImage from "@/assets/sunset.png";
import userImage from "@/assets/user.svg";
import RecommendedProducts from "./recommendedProducts";
import { SocialLinks } from "../shared/socialLinks";
export const CommunityDetails = ({ id }: { id: string }) => {
  console.log(id);
  return (
    <>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        <h1 className="text-[62px] text-center font-semibold">
          I wore this lid when I sat by her bed
        </h1>
        <p className="text-xl font-light text-center">
          published on Wednesday July, 2025
        </p>
        <div className="relative w-full h-[400px] max-w-7xl mx-auto mt-10 rounded-lg overflow-hidden">
          <Image
            src={sunsetImage}
            alt="sunset"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="flex justify-center items-center">
          <p className="text-2xl font-light text-center max-w-7xl mx-auto mt-10">
            It wasn’t just a cap — it was our cap. A faded, navy blue baseball
            lid with a frayed brim and a tiny stitched heart under the bill. She
            gave it to me the day we met, laughing as it flopped over my eyes
            and calling me “Captain Clumsy.” It became my comfort — my shield —
            through every moment that followed.
            <br />
            <br />
            Years later, when the hospital smell clung to everything and the
            monitors hummed louder than my thoughts, I wore it again. I hadn’t
            touched it in months, but that day, I knew I had to.
            <br />
            <br />I sat quietly by her bed, watching her chest rise and fall
            like the tide — slow, heavy, fragile. The nurses came and went.
            Machines blinked. But I didn’t move. I couldn’t. My fingers rested
            on the brim of the lid, twisting it like a nervous habit I had long
            forgotten.
            <br />
            <br />I whispered stories to her. Some real, some made-up — the kind
            she loved most. I told her about the cap. How it had been with me
            through every bad day, every spontaneous road trip, every
            thunderstorm I survived because she made it feel like an adventure.
            <br />
            <br />
            She didn’t respond. But I like to believe she heard me. When the
            time came, I left the lid on her pillow. That day, it stopped being
            mine.
          </p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col gap-4 items-center">
            <Image src={userImage} alt="user" width={100} height={100} />
            <p className="text-5xl font-medium text-center">Marcus Chen</p>
            <p className="text-xl font-light text-center">
              The Lock - Headband
            </p>
          </div>
        </div>
        <RecommendedProducts />
      </section>
      <SocialLinks />
    </>
  );
};
