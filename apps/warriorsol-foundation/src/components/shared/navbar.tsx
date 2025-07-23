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
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const mainURL = process.env.NEXT_PUBLIC_WARRIOR_SOL_MAIN_APP_URL;

export default function Navbar() {
  const { data: session } = useSession();

  const userName =
    session?.user?.firstName || session?.user?.lastName
      ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim()
      : "Guest";
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
              <Button variant="ghost" size="icon" className="lg:hidden p-1">
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
                <Link href="/support">Apply For Support</Link>
                <Link href="/donations">Donations</Link>
                <Link href="/donor-wall">Donor Wall</Link>
                {session?.user?.role === "admin" && (
                  <Link href="/support-applications">View Applications</Link>
                )}
              </nav>

              {/* 🔥 CTA Button */}
              <a
                href={`${mainURL}/sso?token=${session?.user.token}}`}
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
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6 text-sm text-black font-light overflow-x-auto">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/support" className="hover:underline">
            Apply For Support
          </Link>
          <Link href="/donations" className="hover:underline">
            Donations
          </Link>
          <Link href="/donor-wall" className="hover:underline">
            Donor Wall
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/support-applications" className="hover:underline">
              View Applications
            </Link>
          )}

          {/* Desktop CTA Button */}
          <a
            href={`${mainURL}/sso?token=${session?.user.token}}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-4 py-2 bg-[#EE9254] text-white rounded-full font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md"
          >
            Go to Main Site
          </a>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center sm:gap-4">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="p-1 sm:p-2">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {session?.user ? (
                <>
                  <DropdownMenuLabel className="text-lg text-gray-500">
                    Signed in as
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="font-medium text-lg truncate">
                    {userName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      document.cookie =
                        "cartId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                      signOut();
                    }}
                    className="cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuLabel className="text-sm text-gray-500">
                  Not signed in
                </DropdownMenuLabel>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
