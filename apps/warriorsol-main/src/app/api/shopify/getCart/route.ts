import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
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
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: "No cart ID found in cookies" },
        { status: 404 }
      );
    }

    const variables = { cartId };
    const data = await fetchShopify(GET_CART_QUERY, variables);

    if (!data.cart) {
      return NextResponse.json(
        { error: "Cart not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart: data.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
