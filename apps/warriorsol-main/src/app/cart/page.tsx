import CartPage from "@/components/cart";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { SocialLinks } from "@/components/shared/socialLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | WarriorSol",
  description: "Manage your cart on WarriorSol. Review your selected items, update quantities, and proceed to checkout to support families in need through your purchases.",
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
