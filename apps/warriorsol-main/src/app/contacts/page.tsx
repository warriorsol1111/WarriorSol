import Contacts from "@/components/contacts";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { SocialLinks } from "@/components/shared/socialLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Contacts",
};

export default function ContactsPage() {
  return (
    <>
      <Navbar />
      <Contacts />
      <SocialLinks />
      <Footer />
    </>
  );
}
