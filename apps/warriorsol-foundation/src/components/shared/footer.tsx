"use client";

import Image from "next/image";
import Link from "next/link";
import LogoWhite from "../../assets/logo-white.svg";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <footer className="bg-[#1F1F1F] text-[#e5e5e5] pt-12 pb-6 px-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        {/* Brand Section */}
        <div className="md:w-1/3 flex flex-col items-start mb-8 md:mb-0">
          <div className="flex items-center mb-4">
            <Image
              src={LogoWhite}
              alt="Warrior Sol Logo"
              className="w-full h-full"
              width={100}
              height={100}
            />
          </div>
          <p className="text-[16px] font-[Inter] font-normal leading-relaxed max-w-xs text-[#FFFFFF99]">
            Born from experience.
            <br />
            Established 11:11. Apparel
            <br />
            with meaning for every
            <br />
            warrior&apos;s journey.
          </p>
        </div>

        {/* Navigation (hidden on "/") */}
        {pathname !== "/" && (
          <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {/* Quick Links */}
            <div>
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/home"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Apply For Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donations"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Donations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donor-wall"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Donor Wall
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                Account
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/account"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    My Account
                  </Link>
                </li>
                {session?.user?.role === "admin" && (
                  <li>
                    <Link
                      href="/support-applications"
                      className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                    >
                      View Support Applications
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white text-[16px] font-medium font-[Playfair] mb-3">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-6 border-t border-[#353534] text-sm text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm font-[Inter] font-normal text-white mb-4 md:mb-0">
          © 2025 Warrior Sol Foundation. Rooted in light. All rights reserved.
        </div>

        {/* Hide bottom links on "/" too */}
        {pathname !== "/" && (
          <div className="flex gap-4">
            <a
              href="/privacy"
              className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:underline text-[#FFFFFF99] transition-colors font-[Inter] font-normal text-sm"
            >
              Terms
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
