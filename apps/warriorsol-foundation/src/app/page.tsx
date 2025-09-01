import ComingSoon from "@/components/coming-soon";
import { SocialLinks } from "@/components/shared/socialLinks";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Coming Soon | WarriorSol Foundation",
  description: "WarriorSol Foundation",
};

export default function Home() {
  return (
    <>
      <ComingSoon />
      <SocialLinks />
      <Footer />
    </>
  );
}
