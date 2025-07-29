import DonorWall from "@/components/donor-wall";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { SocialLinks } from "@/components/shared/socialLinks";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../auth";

export const metadata = {
  title: "Donor Wall | WarriorSol Foundation",
  description:
    "Explore the Donor Wall of the WarriorSol Foundation, honoring our generous supporters who make a difference in the lives of families in need.",
};

export default async function DonorWallPage() {
  const session = await getServerSession(authConfig);

  const [topRes, recentRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/top-donations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },
      method: "GET",
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/recent`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },
      method: "GET",
      cache: "no-store",
    }),
  ]);

  const topDonations = topRes.ok ? (await topRes.json()).data : [];
  const recentDonations = recentRes.ok ? (await recentRes.json()).data : [];

  return (
    <>
      <Navbar />
      <DonorWall
        topDonations={topDonations}
        recentDonations={recentDonations}
      />
      <SocialLinks />
      <Footer />
    </>
  );
}
