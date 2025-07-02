import Community from "@/components/community";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Community",
  description: "Community",
};

const CommunityPage = () => {
  return (
    <div>
      <Navbar />
      <Community />
      <Footer />
    </div>
  );
};

export default CommunityPage;
