"use client";

import { User } from "lucide-react";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/logo.svg";
import { MdOutlineShoppingBag, MdMenu } from "react-icons/md";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
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
import NavbarSearchDrawer from "./navbarDrawer";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/wishlist-store";

export default function Navbar() {
  const router = useRouter();
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { data: session } = useSession();
  const pathname = usePathname();

  const foundationURL = process.env.NEXT_PUBLIC_WARRIOR_SOL_FOUNDATION_APP_URL;
  const { count, hydrateWishlist } = useWishlistStore();

  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);
  useEffect(() => {
    if (session?.user?.token) {
      hydrateWishlist(session.user.token);
    }
  }, [session?.user?.token, hydrateWishlist]);

  const userName =
    session?.user?.firstName || session?.user?.lastName
      ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim()
      : "Guest";

  const isActive = (path: string) =>
    pathname === path
      ? "text-[#EE9254] font-bold  underline underline-offset-4"
      : "hover:underline";

  return (
    <header>
      <div className="bg-[#e88a49] text-white text-xs sm:text-sm text-center py-2 px-4">
        &quot;Your Story Is Your Strength. Wear It With Pride.&quot;
      </div>

      <div className="flex items-start justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white relative">
        {/* Left: Sidebar menu + Logo */}
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
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
                <Link className={isActive("/home")} href="/home">
                  Home
                </Link>
                <Link className={isActive("/products")} href="/products">
                  All Products
                </Link>
                <Link
                  className={isActive("/warrior-products")}
                  href="/warrior-products"
                >
                  Warrior Products
                </Link>
                <Link className={isActive("/community")} href="/community">
                  Community
                </Link>
                <Link className={isActive("/about")} href="/about">
                  About
                </Link>
                <Link className={isActive("/contacts")} href="/contacts">
                  Contacts
                </Link>
                {session?.user?.role === "admin" && (
                  <Link
                    className={isActive("/admin-story-review")}
                    href="/admin-story-review"
                  >
                    Review Stories
                  </Link>
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 justify-center items-center px-4 max-w-2xl xl:max-w-none mx-auto">
          <div className="flex flex-wrap xl:flex-nowrap justify-center items-center gap-x-4 lg:gap-x-6 gap-y-2 text-sm text-black ">
            <Link className={isActive("/home")} href="/home">
              Home
            </Link>
            <Link className={isActive("/products")} href="/products">
              All Products
            </Link>
            <Link
              className={isActive("/warrior-products")}
              href="/warrior-products"
            >
              Warrior Products
            </Link>
            <Link className={isActive("/community")} href="/community">
              Community
            </Link>
            <Link className={isActive("/about")} href="/about">
              About
            </Link>
            <Link className={isActive("/contacts")} href="/contacts">
              Contacts
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                className={isActive("/admin-story-review")}
                href="/admin-story-review"
              >
                Review Stories
              </Link>
            )}
            <a
              href={foundationURL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#EE9254] text-white px-4 py-2 rounded-full text-center font-semibold text-sm hover:bg-[#e5772e] transition-all shadow-md whitespace-nowrap"
            >
              Visit Foundation Site
            </a>
          </div>
        </nav>

        {/* Right: Search (Desktop only) / User / Cart */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Search - Only visible on desktop */}
          <div className="hidden lg:block cursor-pointer">
            <NavbarSearchDrawer />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="p-2 sm:p-2 cursor-pointer">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {session?.user ? (
                <>
                  <DropdownMenuLabel className="text-sm text-gray-500">
                    Signed in as
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="font-medium text-base truncate">
                    {userName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      document.cookie =
                        "cartId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                      signOut();
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="text-sm text-gray-500">
                    Not signed in
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signIn()}
                    className="cursor-pointer font-medium text-[#EE9254] focus:text-[#EE9254]"
                  >
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/signup">Create Account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wishlist Button */}
          <Button
            variant="link"
            className="relative p-2 sm:p-2 transition-colors cursor-pointer"
            onClick={() => router.push("/account?tab=wishlist")}
          >
            <AiOutlineHeart className="h-5 w-5 sm:h-6 sm:w-6" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs font-bold text-black border border-black rounded-full shadow-sm bg-white">
                {count}
              </span>
            )}
          </Button>

          {/* Cart Button */}
          <Button
            variant="link"
            className="relative p-2 sm:p-2 cursor-pointer"
            onClick={() => {
              toggleCart();
            }}
          >
            <MdOutlineShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs font-bold text-black border border-black rounded-full shadow-sm bg-white">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
