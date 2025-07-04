import DonorWall from "@/components/donor-wall";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { SocialLinks } from "@/components/shared/socialLinks";

export default function DonorWallPage() {
  return (
    <>
      <Navbar />
      <DonorWall />
      <SocialLinks />
      <Footer />
    </>
  );
}
