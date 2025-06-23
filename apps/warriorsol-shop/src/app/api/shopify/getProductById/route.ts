import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyVariant {
  id: string;
  title: string;
  sku: string;
  quantityAvailable: number;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  availableForSale: boolean;
  image: ShopifyImage | null;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

const GET_PRODUCT_BY_ID = `
  query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      vendor
      totalInventory
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
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
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    let data;
    let product: ShopifyProduct;

    // Try different approaches to fetch the product
    try {
      // Approach 1: Use the ID as-is if it's already a GID
      if (productId.startsWith("gid://shopify/Product/")) {
        data = await fetchShopify(GET_PRODUCT_BY_ID, { id: productId });
        product = data?.product;
      } else {
        // Approach 2: Convert numeric ID to GID
        const gid = `gid://shopify/Product/${productId}`;
        data = await fetchShopify(GET_PRODUCT_BY_ID, { id: gid });
        product = data?.product;
      }

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Transform the data to match the frontend component's expected format
      const transformedProduct = {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        productType: product.productType,
        vendor: product.vendor,
        price: product.priceRange.minVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode,
        image: product.images.edges[0]?.node.url || null,
        imageAlt: product.images.edges[0]?.node.altText || product.title,
        variants: product.variants.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          sku: edge.node.sku,
          quantityAvailable: edge.node.quantityAvailable,
          price: {
            amount: edge.node.price.amount,
            currencyCode: edge.node.price.currencyCode,
          },
          compareAtPrice: edge.node.compareAtPrice
            ? {
                amount: edge.node.compareAtPrice.amount,
                currencyCode: edge.node.compareAtPrice.currencyCode,
              }
            : null,
          availableForSale: edge.node.availableForSale,
          image: {
            url:
              edge.node.image?.url || product.images.edges[0]?.node.url || null,
            altText:
              edge.node.image?.altText ||
              product.images.edges[0]?.node.altText ||
              product.title,
          },
        })),
        // Set the default variant
        variant: product.variants.edges[0]
          ? {
              id: product.variants.edges[0].node.id,
              title: product.variants.edges[0].node.title,
              sku: product.variants.edges[0].node.sku,
              quantityAvailable:
                product.variants.edges[0].node.quantityAvailable,
              price: {
                amount: product.variants.edges[0].node.price.amount,
                currencyCode: product.variants.edges[0].node.price.currencyCode,
              },
              compareAtPrice: product.variants.edges[0].node.compareAtPrice
                ? {
                    amount:
                      product.variants.edges[0].node.compareAtPrice.amount,
                    currencyCode:
                      product.variants.edges[0].node.compareAtPrice
                        .currencyCode,
                  }
                : null,
              availableForSale: product.variants.edges[0].node.availableForSale,
              image: {
                url:
                  product.variants.edges[0].node.image?.url ||
                  product.images.edges[0]?.node.url ||
                  null,
                altText:
                  product.variants.edges[0].node.image?.altText ||
                  product.images.edges[0]?.node.altText ||
                  product.title,
              },
            }
          : null,
      };

      return NextResponse.json(transformedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
