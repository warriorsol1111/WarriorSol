import Contacts from "@/components/contacts";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { SocialLinks } from "@/components/shared/socialLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts | WarriorSol",
  description: "Get in touch with WarriorSol. Reach out for support, inquiries, or to learn more about our initiatives. We are here to help families in need.",
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
