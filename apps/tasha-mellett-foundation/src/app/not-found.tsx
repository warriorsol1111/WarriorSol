"use client";

import Link from "next/link";
import Image from "next/image";
import logoWhite from "@/assets/logo-white.svg";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <Image
          src={logoWhite}
          alt="Warrior Sol Logo"
          width={200}
          height={200}
          className="mx-auto mb-8"
        />
        <h1 className="text-[64px] md:text-[84px] font-cormorantSC mb-4">
          404
        </h1>
        <h2 className="text-[32px] md:text-[42px] font-cormorantSC mb-6">
          Page Not Found
        </h2>
        <p className="text-[16px] md:text-[18px] font-light text-white/80 mb-8">
          The page you&apos;re looking for seems to have wandered off. Like
          every warrior&apos;s journey, sometimes we need to find our way back
          home.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-black px-8 py-3 rounded font-medium hover:bg-white/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
