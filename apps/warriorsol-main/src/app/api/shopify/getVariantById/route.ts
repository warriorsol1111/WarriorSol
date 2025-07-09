import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "../../../../../auth";
import { fetchShopify } from "../../../../lib/shopify";

const GET_PRODUCT_BY_VARIANT_QUERY = `
  query getProductByVariantId($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        title
        sku
        quantityAvailable
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        image {
          originalSrc
          altText
        }
        product {
          id
          title
          description
          productType
          vendor
          totalInventory
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                image {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const variantId = req.nextUrl.searchParams.get("variantId");

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const data = await fetchShopify(GET_PRODUCT_BY_VARIANT_QUERY, {
      id: variantId,
    });

    const variant = data?.node;

    if (!variant || !variant.product) {
      return NextResponse.json(
        { error: "Product not found for this variant" },
        { status: 404 }
      );
    }

    const product = variant.product;

    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      productType: product.productType,
      vendor: product.vendor,
      totalInventory: product.totalInventory,
      images: product.images.edges.map(
        ({ node }: { node: { originalSrc: string; altText: string } }) => ({
          originalSrc: node.originalSrc,
          altText: node.altText,
        })
      ),
      variants: product.variants.edges.map(
        ({
          node,
        }: {
          node: {
            id: string;
            title: string;
            sku: string;
            quantityAvailable: number;
            price: { amount: number; currencyCode: string };
            compareAtPrice: { amount: number; currencyCode: string };
            availableForSale: boolean;
            image: { originalSrc: string; altText: string } | null;
          };
        }) => ({
          id: node.id,
          title: node.title,
          sku: node.sku,
          quantityAvailable: node.quantityAvailable,
          price: node.price,
          compareAtPrice: node.compareAtPrice,
          availableForSale: node.availableForSale,
          image: node.image
            ? {
                originalSrc: node.image.originalSrc,
                altText: node.image.altText,
              }
            : null,
        })
      ),
    };

    return NextResponse.json(
      {
        variant: {
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          quantityAvailable: variant.quantityAvailable,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          availableForSale: variant.availableForSale,
          image: variant.image,
        },
        product: formattedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product by variant:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
