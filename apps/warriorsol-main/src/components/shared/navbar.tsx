"use client";

import { Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/logo.svg";
import { MdOutlineShoppingBag, MdMenu } from "react-icons/md";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";

export default function Navbar() {
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { data: session } = useSession();

  const foundationURL = process.env.NEXT_PUBLIC_FOUNDATION_URL!;
  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);

  const userName =
    session?.user?.firstName || session?.user?.lastName
      ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim()
      : "Guest";

  return (
    <header>
      <div className="bg-[#e88a49] text-white text-xs sm:text-sm text-center py-2 px-4">
        &quot;Your Story Is Your Strength. Wear It With Pride.&quot;
      </div>

      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white relative">
        {/* Left: Sidebar menu + Logo */}
        <div className="flex items-center space-x-1 sm:space-x-3">
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
                <Link href="/home">Home</Link>
                <Link href="/products">All Products</Link>
                <Link href="/warrior-products">Warrior Products</Link>
                <Link href="/community">Community</Link>
                <Link href="/about">About</Link>
                <Link href="/contacts">Contacts</Link>
                {session?.user?.role === "admin" && (
                  <Link href="/admin-story-review">Review Stories</Link>
                )}
              </nav>
              <a
                href={foundationURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EE9254] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md w-fit mx-auto mt-4 mb-2"
              >
                Visit Foundation
              </a>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/home" className="text-lg font-semibold tracking-wide">
            <div className="flex items-center px-1 sm:px-3">
              <Image
                src={Logo}
                alt="Warrior Sol Logo"
                className="h-6 sm:h-8 w-auto"
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (desktop only) */}
        <nav className="absolute hidden lg:flex left-1/2 transform -translate-x-1/2 space-x-6 text-sm text-center text-black font-light items-center">
          <Link href="/home" className="hover:underline">
            Home
          </Link>
          <Link href="/products" className="hover:underline">
            All Products
          </Link>
          <Link href="/warrior-products" className="hover:underline">
            Warrior Products
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
          {session?.user?.role === "admin" && (
            <Link href="/admin-story-review" className="hover:underline">
              Review Stories
            </Link>
          )}

          <a
            href="https://foundation.yoursite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#EE9254] text-white px-4 py-2 rounded-full text-center font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md"
          >
            Visit Foundation Site
          </a>
        </nav>

        {/* Right: Search / User / Cart */}
        <div className="flex items-center sm:gap-4">
          <Button variant="link" className="p-1 sm:p-2">
            <Search className="h-5 w-5" />
          </Button>

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

          {/* Cart Icon */}
          <Button
            variant="link"
            className="relative p-1 sm:p-2"
            onClick={toggleCart}
          >
            <MdOutlineShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-black border border-black rounded-full shadow-sm">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
