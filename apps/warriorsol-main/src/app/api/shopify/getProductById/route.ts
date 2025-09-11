import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

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
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
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
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 20) {  # increase to get more product images
        edges { node { url altText } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            sku
            quantityAvailable
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
            image { url altText }
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

    const gid = productId.startsWith("gid://shopify/Product/")
      ? productId
      : `gid://shopify/Product/${productId}`;

    const data = await fetchShopify(GET_PRODUCT_BY_ID, { id: gid });
    const product: ShopifyProduct = data?.product;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Collect all images (product + variant images)
    const allImagesMap = new Map<
      string,
      { url: string; altText: string; isVariantImage: boolean }
    >();

    // Product images first
    product.images.edges.forEach((edge) => {
      allImagesMap.set(edge.node.url, {
        url: edge.node.url,
        altText: edge.node.altText || product.title,
        isVariantImage: false,
      });
    });

    // Add variant images (overwrite if same URL)
    product.variants.edges.forEach((edge) => {
      if (edge.node.image?.url) {
        allImagesMap.set(edge.node.image.url, {
          url: edge.node.image.url,
          altText: edge.node.image.altText || edge.node.title,
          isVariantImage: true,
        });
      }
    });

    const images = Array.from(allImagesMap.values());

    // Transform variants
    const variants = product.variants.edges.map((edge) => {
      const variantImage = edge.node.image;
      return {
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
        image: variantImage
          ? {
              url: variantImage.url,
              altText: variantImage.altText || edge.node.title,
            }
          : null,
      };
    });

    // Default variant (first one)
    const variant = variants[0] || null;

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
      images,
      variants,
      variant,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
