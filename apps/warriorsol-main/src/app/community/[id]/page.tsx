import { CommunityDetails } from "@/components/community/communityDetails";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

type Params = Promise<{ id: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  return (
    <div>
      <Navbar />
      <CommunityDetails id={id} />
      <Footer />
    </div>
  );
}
