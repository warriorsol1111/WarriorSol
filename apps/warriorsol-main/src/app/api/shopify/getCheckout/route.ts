import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

const GET_CHECKOUT_URL_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
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
    const data = await fetchShopify(GET_CHECKOUT_URL_QUERY, variables);

    if (!data.cart) {
      return NextResponse.json(
        { error: "Cart not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({ checkoutUrl: data.cart.checkoutUrl });
  } catch (error) {
    console.error("Error fetching checkout URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout URL" },
      { status: 500 }
    );
  }
}
