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

export default function Navbar() {
  const { data: session } = useSession();

  const userName =
    session?.user?.firstName || session?.user?.lastName
      ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim()
      : "Guest";

  return (
    <header>
      {/* Navbar */}

      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white relative">
        <div className="flex items-center gap-8">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden p-1">
                <MdMenu className="h-6 w-6 text-black" />
              </Button>
            </SheetTrigger>
            <SheetTitle />
            <SheetContent
              side="left"
              className="p-4 pt-10 space-y-6 w-[250px] sm:w-64 bg-white text-black"
            >
              <nav className="flex flex-col gap-4 font-medium">
                <Link href="/">Home</Link>
                <Link href="/community">Community</Link>
                <Link href="/about">About</Link>
                <Link href="/contacts">Contacts</Link>
                {session?.user?.role === "admin" && (
                  <Link href="/support-applications">View Applications</Link>
                )}
              </nav>
              <a
                href="/donate"
                className="block text-center bg-[#C5EE92] text-black px-4 py-3 rounded-full font-medium text-sm hover:bg-[#b3e06d] transition-all"
              >
                Donate Now
              </a>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="Warrior Sol Logo"
              className="h-[48px] w-auto"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center">
            <div className="h-6 w-px bg-[#999999] mx-4"></div>
            <nav className="flex gap-8 text-lg font-medium text-black">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/community" className="hover:underline">
                Community
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contacts" className="hover:underline">
                Contacts
              </Link>
            </nav>
          </div>
        </div>

        {/* Right: Donate + User */}
        <div className="flex items-center gap-4">
          <a
            href="/donate"
            className="px-4 py-2 bg-[#C1E965] rounded-full font-extrabold text-lg hover:bg-[#C1E965] text-[#023729] transition-all"
          >
            Donate Now
          </a>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="p-1 sm:p-2 text-black">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {session?.user ? (
                <>
                  <DropdownMenuLabel className="text-xs text-gray-500">
                    Signed in as
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="font-medium text-sm truncate">
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
