import Image from "next/image";
import BeingAWarriorImage from "../../assets/beingAWarrior.svg";
import { Button } from "../ui/button";
export default function BeingAWarrior() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-[40px] font-medium text-[#002329] ">
          Being a warrior isn&apos;t about fighting alone it&apos;s about having
          the courage to accept help and the strength to keep going.
        </h2>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={BeingAWarriorImage}
          alt="Being a warrior"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <div className="flex items-center justify-center mt-12">
        <Button
          className="bg-[#C1E965] rounded-full !w-[160px] hover:bg-[#b3e06d] !h-[60px] text-[#023729] text-[18px] font-medium"
          size="lg"
        >
          {" "}
          Donate Now{" "}
        </Button>
      </div>
    </section>
  );
}
