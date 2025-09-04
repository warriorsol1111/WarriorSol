import Image from "next/image";
import Link from "next/link";
import RecommendedImage from "@/assets/recommended.png";
import CircleImage from "@/assets/circleImage.svg";
import { GoArrowUpRight } from "react-icons/go";

export default function RecommendedSection() {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={RecommendedImage}
          alt="Person in weighted hoodie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Circle Image (top right, responsive positioning) */}
      <Image
        src={CircleImage}
        alt="Circle Image"
        className="absolute -top-8 sm:-top-12 right-0 sm:-right-10 w-28 sm:w-40 lg:w-56 z-10"
      />

      {/* Main Content (top-left) */}
      <div className="relative z-10 flex flex-col items-start px-4 sm:px-8 lg:px-16 pt-16 sm:pt-20">
        <h1 className="text-white font-semibold leading-tight mb-3 text-[clamp(1.75rem,5vw,3.875rem)]">
          Try Out Our Weighted Hoodies
        </h1>
        <p className="text-white font-medium text-[clamp(1rem,2.5vw,1.25rem)] max-w-xl">
          Real Stories From Real Warriors In Our Community
        </p>
      </div>

      {/* CTA Button (bottom-center) */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 border text-white text-[clamp(1rem,2.2vw,1.375rem)] font-medium px-8 sm:px-12 whitespace-nowrap lg:px-14 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group"
        >
          <span>SHOP NOW</span>
          <GoArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </section>
  );
}
