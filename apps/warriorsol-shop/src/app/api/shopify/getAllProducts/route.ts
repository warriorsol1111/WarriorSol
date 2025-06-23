import { NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";

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
        edges: data.products.edges.map((edge: any) => ({
          node: {
            ...edge.node,
            // Ensure image URLs are properly formatted
            images: {
              edges: edge.node.images.edges.map((img: any) => ({
                node: {
                  originalSrc: img.node.url,
                  altText: img.node.altText,
                },
              })),
            },
            // Format the price from the first variant
            variants: {
              edges: edge.node.variants.edges.map((variant: any) => ({
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
