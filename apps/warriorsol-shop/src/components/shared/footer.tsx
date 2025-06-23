import React from "react";
import LogoWhite from "../../assets/logo-white.svg";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-[#1F1F1F] text-[#e5e5e5] pt-12 pb-6 px-10">
      <div className="  flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        {/* Brand Section */}
        <div className="md:w-1/3 flex flex-col items-start mb-8 md:mb-0">
          <div className="flex items-center mb-4">
            {/* Bird Logo */}
            <Image
              src={LogoWhite}
              alt="Warrior Sol Logo"
              className="w-full h-full"
              width={100}
              height={100}
            />
          </div>
          <p className="text-lg leading-relaxed max-w-xs text-white">
            Born from experience.
            <br />
            Established 11:11. Apparel
            <br />
            with meaning for every
            <br />
            warrior's journey.
          </p>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className=" mt-10 pt-6 border-t border-[#353534] flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-white   mb-4 md:mb-0">
          © 2024 Warrior Sol. Rooted in light. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-white">
          <a href="#" className="hover:text-white transition-colors font-light">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors font-light">
            Terms of services
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
