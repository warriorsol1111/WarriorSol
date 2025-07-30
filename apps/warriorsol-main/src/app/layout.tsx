import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cormorant_SC } from "next/font/google";
import SessionProviderWrapper from "@/components/shared/sessionProvider";
import CartDrawer from "@/components/cart/cartDrawer";
import NextTopLoader from "nextjs-toploader";
import CustomToaster from "@/lib/custom-toaster";

const cormorantSC = Cormorant_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WarriorSol Main",
  description: "WarriorSol Main",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorantSC.className} antialiased`}
      >
        <NextTopLoader height={5} showSpinner={false} />
            <CustomToaster />

        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <CartDrawer />
      </body>
    </html>
  );
}
