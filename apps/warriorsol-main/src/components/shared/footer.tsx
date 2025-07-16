import React from "react";
import LogoWhite from "../../assets/logo-white.svg";
import Image from "next/image";
import Link from "next/link";
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
            warrior&apos;s journey.
          </p>
        </div>
        {/* Navigation Columns Section */}
        <div className="w-full md:w-2/3 mt-2 flex flex-col sm:flex-row gap-8 md:gap-16">
          {/* Shop Column */}
          <div className="flex-1">
            <h4 className="text-white text-2xl font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="hover:underline text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/warrior-products"
                  className="hover:underline text-white transition-colors"
                >
                  Warrior Products
                </Link>
              </li>
            </ul>
          </div>
          {/* About Column */}
          <div className="flex-1">
            <h4 className="text-white font-semibold text-2xl mb-3">About</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home"
                  className="hover:underline text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:underline text-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:underline text-white transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          {/* Support Column */}
          <div className="flex-1">
            <h4 className="text-white font-semibold text-2xl mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contacts"
                  className="hover:underline text-white transition-colors"
                >
                  Contacts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className=" mt-10 pt-6 border-t border-[#353534] flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-white   mb-4 md:mb-0">
          © 2025 Warrior Sol. Rooted in light. All rights reserved.
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
