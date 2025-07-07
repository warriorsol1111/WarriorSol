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

    if (data.cartLinesUpdate.userErrors.length > 0) {
      return NextResponse.json(
        { error: data.cartLinesUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cart: data.cartLinesUpdate.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
