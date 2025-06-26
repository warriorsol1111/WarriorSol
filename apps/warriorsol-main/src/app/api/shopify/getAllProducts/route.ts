import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

interface Edge {
  node: {
    id: string;
    title: string;
    handle: string;
    images: {
      edges: ImageEdge[];
    };
    variants: {
      edges: VariantEdge[];
    };
  };
}

interface ImageEdge {
  node: {
    url: string;
    altText: string;
  };
}

interface VariantEdge {
  node: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
    image: {
      url: string;
      altText: string;
    };
  };
}

const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const data = await fetchShopify(GET_PRODUCTS);

    // Transform the data to match the expected format in the frontend
    const transformedData = {
      products: {
        edges: data.products.edges.map((edge: Edge) => ({
          node: {
            ...edge.node,
            // Ensure image URLs are properly formatted
            images: {
              edges: edge.node.images.edges.map((img: ImageEdge) => ({
                node: {
                  originalSrc: img.node.url,
                  altText: img.node.altText,
                },
              })),
            },
            // Format the price from the first variant
            variants: {
              edges: edge.node.variants.edges.map((variant: VariantEdge) => ({
                node: {
                  ...variant.node,
                  price: variant.node.price.amount,
                  compareAtPrice: variant.node.compareAtPrice?.amount || null,
                  image: variant.node.image
                    ? {
                        originalSrc: variant.node.image.url,
                        altText: variant.node.image.altText,
                      }
                    : null,
                },
              })),
            },
          },
        })),
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
