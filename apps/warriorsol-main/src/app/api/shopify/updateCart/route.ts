import { NextRequest, NextResponse } from "next/server";
import { fetchShopify } from "../../../../lib/shopify";
import { cookies } from "next/headers";

const UPDATE_CART_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
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
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function PATCH(request: NextRequest) {
  try {
    const { lineId, quantity } = await request.json();
    const cookiesStore = await cookies();
    const cartId = cookiesStore.get("cartId")?.value;

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "Missing cartId or lineId" },
        { status: 400 }
      );
    }

    const variables = {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    };

    const data = await fetchShopify(UPDATE_CART_MUTATION, variables);

    // Check for null or user errors
    const updateResponse = data?.cartLinesUpdate;

    if (!updateResponse) {
      return NextResponse.json(
        {
          error: "cartLinesUpdate returned null",
          raw: data,
        },
        { status: 400 }
      );
    }

    if (updateResponse.userErrors?.length) {
      console.warn("Shopify userErrors:", updateResponse.userErrors);
      return NextResponse.json(
        {
          error: "Shopify userErrors occurred",
          userErrors: updateResponse.userErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: updateResponse.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart", details: String(error) },
      { status: 500 }
    );
  }
}
