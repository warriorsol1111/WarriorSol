import HomePage from "../components/home/page";
export const dynamic = "force-dynamic";

export default async function Home() {
  const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function fetchCountofMails() {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/launch-mails/count`,
        {}
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch mail count: ${response.status}`);
      }

      const data = await response.json();
      return data.data || 0;
    } catch (error) {
      console.error("Error fetching mail count:", error);
      return 0;
    }
  }

  async function getProducts() {
    try {
      const response = await fetch(
        `${PUBLIC_URL}/api/shopify/getAllProducts`,
        {}
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      if (data.products?.edges) {
        const transformedProducts = data.products.edges.map((edge: any) => {
          const product = edge.node;
          // Get the first available variant for price
          const firstVariant = product.variants?.edges?.[0]?.node;
          // Get the first image
          const firstImage = product.images?.edges?.[0]?.node;

          return {
            id: product.id,
            title: product.title,
            category: product.productType || "General",
            price: firstVariant?.price ? `$${firstVariant.price}` : "$0.00",
            imageUrl: firstImage?.originalSrc || "/placeholder-image.jpg",
            handle: product.handle,
          };
        });
        return transformedProducts;
      }

      return []; // Return empty array if no products
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Return empty array on error
    }
  }

  // Await both async calls
  const products = await getProducts();
  const countofMails = await fetchCountofMails();

  return <HomePage products={products} countofMails={countofMails} />;
}
