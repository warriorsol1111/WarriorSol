import Community from "@/components/community";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Community | WarriorSol",
  description: "Join the WarriorSol community. Connect with like-minded individuals, share your experiences, and support families in need through our community initiatives.",
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
