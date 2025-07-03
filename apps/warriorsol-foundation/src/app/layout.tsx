import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cormorant_SC } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
  title: "WarriorSol Foundation",
  description: "Warriorol Foundation",
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
        <Toaster
          toastOptions={{
            className: "!font-bold",
          }}
        />
        {children}
      </body>
    </html>
  );
}
