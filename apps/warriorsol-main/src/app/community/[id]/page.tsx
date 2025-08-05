import { CommunityDetails } from "@/components/community/communityDetails";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../../auth";

type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.token) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-stories/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      cache: "no-store",
    }
  );

  const result = await res.json();

  const storyData = result?.data?.[0];
  const story = storyData?.story;
  const user = storyData?.user;

  return (
    <div>
      <Navbar />
      <CommunityDetails story={story} user={user} />
      <Footer />
    </div>
  );
}
