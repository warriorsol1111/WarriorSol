import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/shared/sessionProvider";
import CartDrawer from "@/components/cart/cartDrawer";
import NextTopLoader from "nextjs-toploader";
import CustomToaster from "@/lib/custom-toaster";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-hkGrotesk",
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
      <body className={`${comfortaa.className} antialiased`}>
        <NextTopLoader height={5} showSpinner={false} />
        <CustomToaster />

        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <CartDrawer />
      </body>
    </html>
  );
}
