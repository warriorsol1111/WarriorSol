import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyImage {
  url: string;
  altText?: string;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("q")?.trim();

  if (!searchTerm) {
    return NextResponse.json({ products: [] });
  }

  const query = `title:*${searchTerm}*`;

  try {
    const data = await fetchShopify(SEARCH_PRODUCTS_QUERY, { query });

    const products = (
      data.products.edges as { node: ShopifyProductNode }[]
    ).map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.images.edges[0]?.node || null,
    }));

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Search error", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
