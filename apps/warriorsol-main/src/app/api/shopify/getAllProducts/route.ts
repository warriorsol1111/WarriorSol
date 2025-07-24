import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

interface ImageNode {
  url: string;
  altText: string | null;
}

interface VariantNode {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
  image: ImageNode | null;
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  options: {
    name: string;
    values: string[];
  }[];
  images: {
    edges: { node: ImageNode }[];
  };
  variants: {
    edges: { node: VariantNode }[];
  };
}

interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }[];
  };
}

const GET_PRODUCTS_AND_COLLECTIONS = /* GraphQL */ `
  query GetProductsAndCollections {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          productType
          tags
          options {
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
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
        }
      }
    }
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
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
    const data = await fetchShopify(GET_PRODUCTS_AND_COLLECTIONS);

    const transformedProducts = data.products.edges.map(
      (edge: { node: ProductNode }) => ({
        node: {
          ...edge.node,
          images: {
            edges: edge.node.images.edges.map((img) => ({
              node: {
                originalSrc: img.node.url,
                altText: img.node.altText,
              },
            })),
          },
          variants: {
            edges: edge.node.variants.edges.map((variant) => ({
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
      })
    );

    const transformedCollections = data.collections.edges.map(
      (collection: { node: CollectionNode }) => ({
        id: collection.node.id,
        title: collection.node.title,
        handle: collection.node.handle,
        productHandles: collection.node.products.edges.map(
          (product) => product.node.handle
        ),
      })
    );

    return NextResponse.json({
      products: { edges: transformedProducts },
      collections: transformedCollections,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch products/collections" },
      { status: 500 }
    );
  }
}
