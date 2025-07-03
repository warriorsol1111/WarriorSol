import Homepage from "@/components/homepage";
import { SocialLinks } from "@/components/shared/socialLinks";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | WarriorSol Foundation",
  description: "Warriorol Foundation",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Homepage />
      <SocialLinks />
      <Footer />
    </>
  );
}
