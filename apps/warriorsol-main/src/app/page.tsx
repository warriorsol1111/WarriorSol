import ComingSoon from "@/components/comingSoon";
import { SocialLinks } from "@/components/shared/socialLinks";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "Coming Soon | WarriorSol Main",
  description: "WarriorSol Main",
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
