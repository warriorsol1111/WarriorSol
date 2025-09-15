import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

const GET_CART_WITH_ATTRIBUTES_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      attributes {
        key
        value
      }
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

    // 1. First, get the current cart with its existing attributes
    const cartData = await fetchShopify(GET_CART_WITH_ATTRIBUTES_QUERY, {
      cartId,
    });

    if (!cartData.cart) {
      return NextResponse.json(
        { error: "Cart not found or expired" },
        { status: 404 }
      );
    }

    // 2. Update cart attributes only if gift data is provided
    if (giftMessage || senderName || recipientName) {
      // Create a map of existing attributes
      const existingAttributes = new Map();
      cartData.cart.attributes.forEach(
        (attr: { key: string; value: string }) => {
          existingAttributes.set(attr.key, attr.value);
        }
      );

      // Update or add the gift-related attributes
      existingAttributes.set("Gift Message", giftMessage || "");
      existingAttributes.set("Sender", senderName || "");
      existingAttributes.set("Recipient", recipientName || "");

      // Convert back to array format for Shopify
      const updatedAttributes = Array.from(existingAttributes.entries()).map(
        ([key, value]) => ({
          key,
          value,
        })
      );

      console.log("Updating cart attributes:", updatedAttributes);

      const updateResult = await fetchShopify(UPDATE_CART_ATTRIBUTES, {
        cartId,
        attributes: updatedAttributes,
      });

      if (updateResult.cartAttributesUpdate.userErrors.length > 0) {
        console.error(
          "Failed to update cart attributes:",
          updateResult.cartAttributesUpdate.userErrors
        );
      } else {
        console.log("Successfully updated cart attributes");
      }
    }

    return NextResponse.json({ checkoutUrl: cartData.cart.checkoutUrl });
  } catch (error) {
    console.error("Error fetching checkout URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout URL" },
      { status: 500 }
    );
  }
}
