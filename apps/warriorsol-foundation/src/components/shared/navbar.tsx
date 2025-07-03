"use client";

import { User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/logo.svg";
import { Button } from "../ui/button";
const mainURL = process.env.NEXT_PUBLIC_WARRIOR_SOL_MAIN_APP_URL;
export default function Navbar() {
  return (
    <header className="">
      <div className="bg-[#e88a49] text-white text-xs sm:text-sm text-center py-2 px-4">
        &quot;Your Story Is Your Strength. Wear It With Pride.&quot;
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white relative">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          <div className="flex items-center space-x-2 px-2 sm:px-5">
            <Image
              src={Logo}
              alt="Warrior Sol Logo"
              className="h-8 w-auto sm:h-10"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        {/* Centered Navigation */}
        <nav className="absolute hidden md:flex left-1/2 transform -translate-x-1/2 space-x-6 text-sm text-center text-black font-light">
          <Link href={`${mainURL}/home`} className="hover:underline">
            Home
          </Link>
          <Link href={`${mainURL}/products`} className="hover:underline">
            All Products
          </Link>
          <Link href={`${mainURL}/community`} className="hover:underline">
            Community
          </Link>
          <Link href={`${mainURL}/about`} className="hover:underline">
            About
          </Link>
          <Link href={`${mainURL}/contacts`} className="hover:underline">
            Contacts
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <Button variant="link">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
