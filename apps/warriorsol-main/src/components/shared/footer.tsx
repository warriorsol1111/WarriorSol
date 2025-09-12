"use client";

import React from "react";
import LogoWhite from "../../assets/logo-white.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const isHomePage = usePathname() === "/";
  return (
    <footer className="bg-[#1F1F1F] text-[#e5e5e5] pt-12 pb-6 px-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-0">
        {/* Brand Section */}
        {/* Brand Section */}
        <div
          className={`flex flex-col mb-8 md:mb-0 ${
            isHomePage
              ? "w-full items-center text-center" // Center logo + text on homepage
              : "md:w-1/3 items-start text-left" // Default alignment for other pages
          }`}
        >
          <div className="flex justify-center mb-4 w-full">
            <Image
              src={LogoWhite}
              alt="Warrior Sol Logo"
              className="h-auto w-64 md:w-32 lg:w-36"
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </div>

          <p
            className={`text-[16px] font-normal leading-relaxed max-w-xs text-[#FFFFFF99] ${
              isHomePage ? "mx-auto" : ""
            }`}
          >
            Born from love, built for warriors.
            <br />
            Est. 11:11
          </p>
        </div>

        {/* Navigation Columns Section */}
        {isHomePage === false && (
          <div className="w-full md:w-2/3 mt-2 flex flex-col sm:flex-row gap-8 md:gap-16">
            {/* Shop Column */}
            <div className="flex-1">
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                Shop
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/warrior-products"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    Warrior Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div className="flex-1">
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                About
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/home"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex-1">
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contacts"
                    className="hover:underline text-[#FFFFFF99] transition-colors  font-normal text-sm"
                  >
                    Contacts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-6 border-t border-[#353534] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="text-sm  font-normal text-white">
          © 2025 Warrior Sol.
          <br />
          All rights reserved.
        </div>
        <div className="text-sm flex space-x-6  font-normal text-[#FFFFFF99]">
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
