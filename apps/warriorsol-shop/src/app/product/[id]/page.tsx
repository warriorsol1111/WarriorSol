import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ProductDetails from "@/components/product/productDetails";

type Params = Promise<{ id: string }>;
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
async function getProductById(id: string) {
  const response = await fetch(
    `${PUBLIC_URL}/api/shopify/getProductById?id=${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export default async function ProductPage(props: { params: Params }) {
  const { id } = await props.params;
  const product = await getProductById(id);
  return (
    <div>
      <Navbar />
      <ProductDetails product={product} />
      <Footer />
    </div>
  );
}
