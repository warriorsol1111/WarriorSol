import Donations from "@/components/donations";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { SocialLinks } from "@/components/shared/socialLinks";

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
