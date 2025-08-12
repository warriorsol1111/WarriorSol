import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";

const CREATE_CHECKOUT_MUTATION = `
  mutation createCheckout($lineItems: [CartLineInput!]!, $attributes: [AttributeInput!]!) {
    cartCreate(
      input: {
        lines: $lineItems
        attributes: $attributes
      }
    ) {
      cart {
        checkoutUrl
        id
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
    const { variantId, quantity, userId } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const variables = {
      lineItems: [
        {
          merchandiseId: variantId,
          quantity: quantity || 1,
        },
      ],
      attributes: [
        {
          key: "user_id",
          value: userId,
        },
      ],
    };

    const data = await fetchShopify(CREATE_CHECKOUT_MUTATION, variables);

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
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
