import CartPage from "@/components/cart";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { SocialLinks } from "@/components/shared/socialLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Cart",
};

export default function Cart() {
  return (
    <>
      <Navbar />
      <CartPage />;
      <SocialLinks />
      <Footer />
    </>
  );
}
