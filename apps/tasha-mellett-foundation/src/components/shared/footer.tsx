"use client";

import Image from "next/image";
import Link from "next/link";
import LogoWhite from "../../assets/logo-white.svg";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { CiTwitter } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { FaBehance } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";

export default function Footer() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <footer className="bg-[#1F1F1F] text-[#e5e5e5] pt-12 pb-6 px-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
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

        {/* Navigation (hidden on `/`) */}
        {pathname !== "/" && (
          <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {/* Quick Links */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/home" className="hover:underline text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline text-white">
                    Apply For Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donations"
                    className="hover:underline text-white"
                  >
                    Donations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donor-wall"
                    className="hover:underline text-white"
                  >
                    Donor Wall
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-3">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/account" className="hover:underline text-white">
                    My Account
                  </Link>
                </li>
                {session?.user?.role === "admin" && (
                  <li>
                    <Link
                      href="/support-applications"
                      className="hover:underline text-white"
                    >
                      View Support Applications
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/privacy" className="hover:underline text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company/About */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:underline text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:underline text-white"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-6 border-t border-[#353534] text-[18px] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>© 2025 Tasha Mellett Foundation. All rights reserved.</div>

        {/* Social Media Links */}
        <div className="flex gap-3 items-center">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 h-14 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-between min-w-[100px]"
          >
            <span className="text-[15px] text-[#1F1F1F] font-medium">
              Twitter
            </span>
            <CiTwitter size={18} className="ml-10" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 h-14 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-between min-w-[110px]"
          >
            <span className="text-[15px] text-[#1F1F1F] font-medium">
              Instagram
            </span>
            <CiInstagram size={18} className="ml-10" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 h-14   rounded-full hover:bg-gray-200 transition-colors flex items-center justify-between min-w-[105px]"
          >
            <span className="text-[15px] text-[#1F1F1F] font-medium">
              Pinterest
            </span>
            <FaPinterestP size={18} className="ml-10" />
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2  h-14 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-between min-w-[100px]"
          >
            <span className="text-[15px] text-[#1F1F1F] font-medium">
              Behance
            </span>
            <FaBehance size={18} className="ml-10" />
          </a>
        </div>
      </div>
    </footer>
  );
}
