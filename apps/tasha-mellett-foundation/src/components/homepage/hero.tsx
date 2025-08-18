import Image from "next/image";
import HomeImage from "../../assets/homepage.png";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12 relative">
        <div className="relative w-full !rounded-lg h-[300px] sm:h-[400px] md:h-[1000px]">
          <Image
            src={HomeImage}
            alt="Tasha Mellett Foundation"
            fill
            className="object-cover !rounded-2xl"
            priority
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col p-6 sm:p-10">
            {/* Text */}
            <div className="mt-auto">
              <p className="text-white mb-[-40px] text-[42px] font-extrabold">
                Foundation
              </p>
              <h1 className="text-white text-[200px] max-w-[200px] font-extrabold leading-tight">
                Tasha Mellett
              </h1>
            </div>
          </div>
        </div>

        {/* Button - Positioned absolutely at the end of the row */}
        <div className="absolute right-0 bottom-0 p-6 sm:p-10">
          <Button
            onClick={() => {
              window.location.href = "/donations";
            }}
            className="inline-block bg-[#A4CF6D] !text-[32px] font-extrabold text-[#023729] w-[340px] h-[76px] items-center justify-center sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#92be5c] transition-colors"
          >
            Donate Now
          </Button>
        </div>
      </div>
    </section>
  );
}
