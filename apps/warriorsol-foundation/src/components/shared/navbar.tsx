"use client";

import { User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/logo.svg";
import { Button } from "../ui/button";
import { MdMenu } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const mainURL = process.env.NEXT_PUBLIC_WARRIOR_SOL_MAIN_APP_URL;

export default function Navbar() {
  return (
    <header>
      {/* Top Banner */}
      <div className="bg-[#e88a49] text-white text-xs sm:text-sm text-center py-2 px-4">
        &quot;Your Story Is Your Strength. Wear It With Pride.&quot;
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white relative">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden p-1">
                <MdMenu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetTitle></SheetTitle>
            <SheetContent
              side="left"
              className="p-4 pt-10 space-y-6 w-[250px] sm:w-64 bg-white text-black"
            >
              <nav className="flex flex-col gap-4 font-medium">
                <Link href="/">Home</Link>
                <Link href="/support">Support</Link>
                <Link href="/donations">Donations</Link>
                <Link href="/donor-wall">Donor Wall</Link>
              </nav>

              {/* 🔥 CTA Button */}
              <a
                href={`${mainURL}/home`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#EE9254] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md mt-6"
              >
                Go to Main Site
              </a>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-wide">
            <div className="flex items-center px-2 sm:px-5">
              <Image
                src={Logo}
                alt="Warrior Sol Logo"
                className="h-8 sm:h-10 w-auto"
                width={100}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="absolute hidden md:flex left-1/2 transform -translate-x-1/2 space-x-6 text-sm text-center text-black font-light items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/support" className="hover:underline">
            Support
          </Link>
          <Link href="/donations" className="hover:underline">
            Donations
          </Link>
          <Link href="/donor-wall" className="hover:underline">
            Donor Wall
          </Link>

          {/* Desktop CTA Button */}
          <a
            href={`${mainURL}/home`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-4 py-2 bg-[#EE9254] text-white rounded-full font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md"
          >
            Go to Main Site
          </a>
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
