import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import Contacts from "@/components/contacts";
export const metadata = {
  title: "Contact Us | Tasha Mellett Foundation",
  description: "Contact Us",
};

const Contact = () => {
  return (
    <>
      <Navbar />
      <Contacts />
      <Footer />
    </>
  );
};

export default Contact;
