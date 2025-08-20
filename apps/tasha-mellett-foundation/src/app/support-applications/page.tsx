import SupportApplications from "@/components/support-applications";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Support Applications | Tasha Mellett Foundation",
  description:
    "At Tasha Mellett Foundation, we provide support to families facing unexpected challenges. Our mission is to offer financial assistance and resources to help you navigate through difficult times.",
};

export default function SupportApplicationsPage() {
  return (
    <>
      <Navbar />
      <SupportApplications />
      <Footer />
    </>
  );
}
