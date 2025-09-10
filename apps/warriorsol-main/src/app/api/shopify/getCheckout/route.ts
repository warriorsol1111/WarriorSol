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

const UPDATE_CART_ATTRIBUTES = `
  mutation UpdateCartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: "No cart ID found in cookies" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { giftMessage, senderName, recipientName } = body;

    // 1. Update cart with attributes
    if (giftMessage || senderName || recipientName) {
      const attributes = [
        { key: "Gift Message", value: giftMessage || "" },
        { key: "Sender", value: senderName || "" },
        { key: "Recipient", value: recipientName || "" },
      ];

      await fetchShopify(UPDATE_CART_ATTRIBUTES, { cartId, attributes });
    }

    // 2. Get checkout URL
    const data = await fetchShopify(GET_CHECKOUT_URL_QUERY, { cartId });
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
