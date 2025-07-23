"use client";

import Image from "next/image";
import Link from "next/link";
import LogoWhite from "../../assets/logo-white.svg";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();
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
        {/* Navigation */}
        <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline text-white">
                  Apply For Support
                </Link>
              </li>
              <li>
                <Link href="/donations" className="hover:underline text-white">
                  Donations
                </Link>
              </li>
              <li>
                <Link href="/donor-wall" className="hover:underline text-white">
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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-6 border-t border-[#353534] text-sm text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© 2025 Warrior Sol Foundation. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
