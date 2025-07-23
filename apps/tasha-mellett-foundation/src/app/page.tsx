import { SocialLinks } from "@/components/shared/socialLinks";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Tasha Mellett Foundation",
  description: "Tasha Mellett Foundation",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <SocialLinks />
      <Footer />
    </>
  );
}
