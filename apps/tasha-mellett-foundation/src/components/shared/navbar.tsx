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
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "text-[#C1E965] font-bold underline underline-offset-4"
      : "hover:underline";

  const userName =
    session?.user?.firstName || session?.user?.lastName
      ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim()
      : "Guest";

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Mobile Menu Button - Show on screens smaller than 1024px */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden p-1">
                <MdMenu className="h-6 w-6 text-black" />
              </Button>
            </SheetTrigger>
            <SheetTitle />
            <SheetContent
              side="left"
              className="p-4 pt-10 space-y-6 w-[240px] sm:w-64 bg-white text-black"
            >
              <nav className="flex flex-col gap-4 font-medium text-lg">
                <Link href="/home" className={isActive("/home")}>
                  Home
                </Link>
                <Link href="/support" className={isActive("/support")}>
                  Apply for Support
                </Link>
                <Link href="/donations" className={isActive("/donations")}>
                  Donations
                </Link>
                <Link href="/donor-wall" className={isActive("/donor-wall")}>
                  Donor Wall
                </Link>
                {session?.user?.role === "admin" && (
                  <Link
                    href="/support-applications"
                    className={isActive("/support-applications")}
                  >
                    View Applications
                  </Link>
                )}
              </nav>
              <a
                href="/donations"
                className="block text-center bg-[#C5EE92] text-black px-4 py-3 rounded-full font-bold text-base hover:bg-[#b3e06d] transition-all"
              >
                Donate Now
              </a>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/home" className="flex items-center">
            <Image
              src={Logo}
              alt="Warrior Sol Logo"
              className="h-[40px] sm:h-[48px] w-auto"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Navigation - Show on 1280px+ screens */}
          <nav className="hidden xl:flex items-center gap-6 lg:gap-8 text-sm lg:text-base xl:text-lg font-medium text-black">
            <div className="h-6 w-px bg-[#999999]" /> {/* Divider */}
            <Link href="/home" className={isActive("/home")}>
              Home
            </Link>
            <Link href="/support" className={isActive("/support")}>
              Apply for Support
            </Link>
            <Link href="/donations" className={isActive("/donations")}>
              Donations
            </Link>
            <Link href="/donor-wall" className={isActive("/donor-wall")}>
              Donor Wall
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                href="/support-applications"
                className={isActive("/support-applications")}
              >
                View Applications
              </Link>
            )}
          </nav>

          {/* Tablet Navigation - Show on 1024px-1279px screens */}
          <nav className="hidden lg:flex xl:hidden items-center gap-4 text-sm font-medium text-black">
            <div className="h-6 w-px bg-[#999999]" />
            <Link href="/home" className={isActive("/home")}>
              Home
            </Link>
            <Link href="/support" className={isActive("/support")}>
              Support
            </Link>
            <Link href="/donations" className={isActive("/donations")}>
              Donations
            </Link>
            <Link href="/donor-wall" className={isActive("/donor-wall")}>
              Wall
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                href="/support-applications"
                className={isActive("/support-applications")}
              >
                Applications
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/donations"
            className="hidden sm:inline-block px-3 sm:px-4 lg:px-6 py-2 bg-[#C1E965] rounded-full font-extrabold text-xs sm:text-sm lg:text-lg hover:bg-[#b3e06d] text-[#023729] transition-all"
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
