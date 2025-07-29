import Donations from "@/components/donations";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { SocialLinks } from "@/components/shared/socialLinks";

export const metadata = {
  title: "Donations | WarriorSol Foundation",
  description:
    "Support the WarriorSol Foundation by making a donation. Your contributions help us provide essential resources and support to families in need.",
};

export default function DonationsPage() {
  return (
    <>
      <Navbar />
      <Donations />
      <SocialLinks />
      <Footer />
    </>
  );
}
