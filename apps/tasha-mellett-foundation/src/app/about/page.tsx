"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import AboutUsImage1 from "../../assets/about-us-1.svg";
import AboutUsImage2 from "../../assets/about-us-2.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import coleImage from "@/assets/cole.png";
import jimmyImage from "@/assets/jimmy.png";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";
const teamMembers = [
  {
    name: "Cole",
    role: "Creative Lead & Storykeeper",
    image: coleImage,
    description:
      "Cole brings vision, voice, and vulnerability to the heart of the brand. A designer with a mission, and a son who carries strength in his blood.",
  },
  {
    name: "Jimmy",
    role: "Founder, Warrior #2",
    image: jimmyImage,
    description:
      'A father, a husband, and now, a messenger of light. After losing his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his way of saying: "We’re still here. We’re still fighting."',
  },
  {
    name: "Cole",
    role: "Creative Lead & Storykeeper",
    image: coleImage,
    description:
      "Cole brings vision, voice, and vulnerability to the heart of the brand. A designer with a mission, and a son who carries strength in his blood.",
  },
  {
    name: "Jimmy",
    role: "Founder, Warrior #2",
    image: jimmyImage,
    description:
      'A father, a husband, and now, a messenger of light. After losing his wife Tasha, Jimmy turned grief into fuel. Warrior Sol is his way of saying: "We’re still here. We’re still fighting."',
  },
];

export default function AboutBanner() {
  const router = useRouter();
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16">
      {/* Top Banner */}
      <section className="relative h-[295px] bg-[#CDED84] flex items-center justify-center rounded-lg overflow-hidden px-6 sm:px-10 lg:px-32 py-8 sm:py-12 lg:py-16">
        {/* Left arcs */}
        <svg
          className="absolute left-0 bottom-0 w-1/3 max-w-[220px] h-auto transform -scale-x-100"
          viewBox="0 0 220 220"
          fill="none"
        >
          <circle cx="220" cy="220" r="110" stroke="white" strokeWidth="6" />
          <circle cx="220" cy="220" r="90" stroke="white" strokeWidth="6" />
          <circle cx="220" cy="220" r="75" stroke="white" strokeWidth="6" />
        </svg>

        {/* Right arcs */}
        <svg
          className="absolute right-0 top-0 w-1/3 max-w-[220px] h-auto transform -scale-x-100"
          viewBox="0 0 220 220"
          fill="none"
        >
          <circle cx="0" cy="0" r="110" stroke="white" strokeWidth="6" />
          <circle cx="0" cy="0" r="90" stroke="white" strokeWidth="6" />
          <circle cx="0" cy="0" r="75" stroke="white" strokeWidth="6" />
        </svg>

        {/* Content */}
        <div className="relative text-center">
          <Button
            className="bg-white py-1 text-[#023729] hover:bg-white hover:text-[#023729] text-lg rounded-full font-extrabold !px-6"
            onClick={() => router.push("/donations")}
          >
            Donate Now
          </Button>
          <h2 className="mt-4 text-[31px] md:text-[62px] text-[#1F1F1F] font-medium">
            Know More About Us
          </h2>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 sm:px-10 lg:px-16 py-16">
        <div className="mx-auto grid md:grid-cols-2 gap-10 items-start">
          <h2 className="text-[32px] md:text-[62px] text-center md:text-left font-medium leading-snug">
            Our Story – <br /> Born Of Fire, <br /> Built To Shine
          </h2>

          <div className="space-y-6 text-[20px] text-[#1F1F1F] md:text-left text-center">
            <p>
              Warrior Sol began not as a brand, but as a battle cry. We are
              rooted in the lived experience of love, loss, and resilience. This
              journey started with Tasha—our first warrior, our north star. When
              cancer entered her life, it lit a fire in ours. We stood beside
              her through every appointment, every fight, every quiet moment of
              strength. And when she left this world at exactly 11:11pm, she
              left behind more than memories—she left a mission.
            </p>

            <p>
              That mission became Warrior Sol: a community, a movement, and a
              rebellion wrapped in fabric. Every piece we create is stitched
              with purpose—meant to honor the warriors, the caregivers, the
              grievers, and the ones who show up with quiet courage every single
              day.
            </p>

            <p>
              We don’t just sell clothing. We wear our stories. We wear our
              strength.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="text-center mt-4">
        <h2 className="text-[32px] md:text-[62px] font-medium mb-4">
          Our Mission
        </h2>
        <p className="text-[20px] md:text-[42px] text-[#1F1F1F]">
          At Warrior Sol, our mission is to create emotionally powerful apparel
          that offers more than comfort, it offers connection.
        </p>
      </section>

      {/* What we stand for */}
      <section className="grid md:grid-cols-2 gap-10 mt-20 items-center">
        <div className="rounded-lg overflow-hidden shadow-md">
          <Image
            src={AboutUsImage1}
            alt="What We Stand For"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center md:text-left ml-10">
          <h3 className="text-[32px] md:text-[42px] font-medium mb-4">
            What We Stand For
          </h3>
          <p className="text-[20px] text-[#1F1F1FB2] leading-relaxed">
            We stand for survivors. For fighters. For caregivers. For families.
            For every story untold but deeply felt. Warrior Sol represents the
            light that breaks through darkness and the belief that healing is
            not only possible but beautiful.
          </p>
        </div>
      </section>

      {/* Our Spirit */}
      <section className="grid md:grid-cols-2 gap-10 mt-20 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <h3 className="text-[32px] md:text-[42px] font-medium mb-4">
            Our Spirit
          </h3>
          <p className="text-[20px] text-[#1F1F1FB2] leading-relaxed">
            Warrior Sol isn’t just clothing; it’s a declaration. A reminder that
            in every scar lies a story. In every silence, a voice waiting to be
            heard. Our spirit is unbreakable. Our message, unstoppable.
          </p>
        </div>
        <div className="order-1 rounded-lg overflow-hidden shadow-md md:order-2">
          <Image
            src={AboutUsImage2}
            alt="Our Spirit"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Team */}
      <section className="w-full mt-20 text-center">
        <h2 className="text-[42px] md:text-[62px] text-[#1F1F1F] font-cormorantSC capitalize">
          Our Team
        </h2>
        <p className="text-[16px] md:text-[42px]">
          We’ve walked these halls. We’ve held the hands. We’ve heard the
          silence—and we chose to speak.
        </p>

        <div className="relative w-full mt-10">
          <Carousel>
            <CarouselContent className="mb-20 mt-10">
              {teamMembers.map((member, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 flex justify-center"
                >
                  <div className="relative w-[500px] h-[500px] rounded-2xl shadow-md overflow-hidden">
                    {/* Full image fill */}
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay box */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%]">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md flex items-center justify-between">
                        {/* Left side: name + role */}
                        <div>
                          <h4 className="text-lg text-left font-semibold text-[#1F1F1F] mb-1">
                            {member.name}
                          </h4>
                          <p className="text-sm text-[#666]">{member.role}</p>
                        </div>

                        {/* Right side: social icons */}
                        <div className="flex gap-2">
                          <div
                            className="w-7 h-7 bg-[#EDF1D3] rounded flex items-center justify-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://twitter.com/warriorsol",
                                "_blank"
                              )
                            }
                          >
                            {/* Twitter Icon */}
                            <FaXTwitter />
                          </div>
                          <div
                            className="w-7 h-7 bg-[#EDF1D3] rounded flex items-center justify-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://instagram.com/warriorsol",
                                "_blank"
                              )
                            }
                          >
                            {/* Instagram Icon */}
                            <FaInstagram />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Nav buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <CarouselPrevious className="w-10 h-10 border border-[#6B2C1A] text-[#6B2C1A] rounded-none bg-transparent hover:bg-[#6B2C1A] hover:text-white transition" />
              <CarouselNext className="w-10 h-10 border border-[#6B2C1A] text-[#6B2C1A] rounded-none bg-transparent hover:bg-[#6B2C1A] hover:text-white transition" />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
