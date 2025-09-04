import Image from "next/image";
import { Button } from "../ui/button";
import TashaImage from "../../assets/tasha.svg";
import { GoArrowUpRight } from "react-icons/go";

export default function WhoIsTasha() {
  return (
    <>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-[62px] font-semibold text-[#1F1F1F] mb-8">
              Who Is Tasha Mallet?
            </h1>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg  overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/3 flex-shrink-0">
                <div className="h-64 sm:h-80 lg:h-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src={TashaImage}
                    alt="Tasha Mallet"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-2/3 p-6 sm:p-8 lg:p-20">
                <div className="space-y-6">
                  <p className="text-[#000000] text-base sm:text-[24px] leading-relaxed">
                    Tasha Mellett was a devoted wife, a loving mother, and a
                    loyal friend whose warmth, laughter, and strength lit up
                    every space she entered. She embraced life to the fullest —
                    as an educator, an accomplished athlete, a lover of the
                    ocean, and a source of joy for those around her. Tasha truly
                    embodied love in action.
                  </p>

                  <p className="text-[#000000] text-base sm:text-[24px] leading-relaxed">
                    When faced with her battle with cancer, she met it with
                    unwavering dignity, grace, and remarkable courage.
                  </p>

                  <p className="text-[#000000] text-base sm:text-[24px] leading-relaxed">
                    To honor her legacy, the Tasha Mellett Foundation was
                    established by her beloved husband, Jim, and their children,
                    Cole and Ani. The foundation continues her spirit by sharing
                    her compassion, resilience, and joy with others, keeping her
                    light alive in the lives she continues to touch..
                  </p>

                  {/* Call to Action Button */}
                  <div className="pt-6">
                    <Button
                      size="lg"
                      className=" text-[18px]  text-[#1F1F1F] !rounded-full bg-[#CDED84] hover:bg-[#CDED84]/90"
                    >
                      Learn About Tasha
                      <GoArrowUpRight className="!w-4 !h-4 sm:!w-5 sm:!h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#90AF83]">
        <div className="container mx-auto md:px-20 py-10 lg:py-18">
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            Tasha’s story sparked a movement of love to create a strong
            ecosystem rooted in vulnerability and support{" "}
          </h1>
        </div>
      </div>
    </>
  );
}
