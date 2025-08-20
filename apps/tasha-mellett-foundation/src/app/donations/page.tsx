import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import Donations from "@/components/donations";

export const metadata = {
  title: "Donations | Tasha Mellett Foundation",
  description:
    "Support the Tasha Mellett Foundation by making a donation. Your contributions help us provide essential resources and support to families in need.",
};

export default function DonationsPage() {
  return (
    <>
      <Navbar />
      <Donations />
      <Footer />
    </>
  );
}
