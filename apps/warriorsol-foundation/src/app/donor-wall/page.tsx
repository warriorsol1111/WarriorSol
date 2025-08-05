import DonorWall from "@/components/donor-wall";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { SocialLinks } from "@/components/shared/socialLinks";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../auth";
import { Donation } from "@/components/donor-wall";
export const metadata = {
  title: "Donor Wall | WarriorSol Foundation",
  description:
    "Explore the Donor Wall of the WarriorSol Foundation, honoring our generous supporters who make a difference in the lives of families in need.",
};

export default async function DonorWallPage() {
  const session = await getServerSession(authConfig);

  let topDonations: Donation[] = [];
  let recentDonations: Donation[] = [];

  try {
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

    if (topRes.ok) {
      const topData = await topRes.json();
      topDonations = Array.isArray(topData.data) ? topData.data : [];
    }

    if (recentRes.ok) {
      const recentData = await recentRes.json();
      recentDonations = Array.isArray(recentData.data)
        ? recentData.data
        : [];
    }
  } catch (error) {
    console.error("Failed to fetch donor wall data:", error);
     
  }

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

