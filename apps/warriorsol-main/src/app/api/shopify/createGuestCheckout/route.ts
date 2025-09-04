// api/shopify/createGuestCheckout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

const CREATE_GUEST_CHECKOUT_MUTATION = `
  mutation createCart($lineItems: [CartLineInput!]!, $attributes: [AttributeInput!]) {
    cartCreate(
      input: {
        lines: $lineItems
        attributes: $attributes
      }
    ) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    const lineItems = items.map(
      (item: { variantId: string; quantity: number }) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity || 1,
      })
    );

    const attributes = userId
      ? [
          {
            key: "user_id",
            value: userId,
          },
        ]
      : [];

    const data = await fetchShopify(CREATE_GUEST_CHECKOUT_MUTATION, {
      lineItems,
      attributes,
    });

    if (data.cartCreate.userErrors.length > 0) {
      return NextResponse.json(
        { error: data.cartCreate.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      checkoutUrl: data.cartCreate.cart.checkoutUrl,
      cartId: data.cartCreate.cart.id,
    });
  } catch (error) {
    console.error("Error creating guest checkout:", error);
    return NextResponse.json(
      { error: "Failed to create guest checkout" },
      { status: 500 }
    );
  }
}
